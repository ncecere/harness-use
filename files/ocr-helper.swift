import AppKit
import Foundation
import ImageIO
import PDFKit
import Vision

struct OCRObservation: Encodable {
    let text: String
    let confidence: Float
}

struct OCRPage: Encodable {
    let page: Int
    let text: String
    let observations: [OCRObservation]
}

struct OCRResult: Encodable {
    let source: String
    let pages: [OCRPage]
    let warnings: [String]
}

func recognize(_ image: CGImage, pageNumber: Int, languages: [String]) throws -> OCRPage {
    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = true
    request.recognitionLanguages = languages

    try VNImageRequestHandler(cgImage: image).perform([request])
    let observations = (request.results ?? []).compactMap { observation -> OCRObservation? in
        guard let candidate = observation.topCandidates(1).first else { return nil }
        return OCRObservation(text: candidate.string, confidence: candidate.confidence)
    }
    return OCRPage(page: pageNumber, text: observations.map(\.text).joined(separator: "\n"), observations: observations)
}

func imageForPDFPage(_ page: PDFPage) -> CGImage? {
    let bounds = page.bounds(for: .mediaBox)
    guard bounds.width > 0, bounds.height > 0 else { return nil }
    let scale = min(2500 / max(bounds.width, bounds.height), 3.0)
    let size = CGSize(width: bounds.width * scale, height: bounds.height * scale)
    guard let rep = page.thumbnail(of: size, for: .mediaBox).cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        return nil
    }
    return rep
}

let arguments = CommandLine.arguments
guard arguments.count >= 4 else {
    fputs("Usage: ocr-helper.swift <file> <comma-separated-languages> <page-limit>\n", stderr)
    exit(2)
}

let fileURL = URL(fileURLWithPath: arguments[1]).standardizedFileURL
let languages = arguments[2].split(separator: ",").map(String.init).filter { !$0.isEmpty }
let pageLimit = max(1, min(100, Int(arguments[3]) ?? 30))
var pages: [OCRPage] = []
var warnings: [String] = []

do {
    if fileURL.pathExtension.lowercased() == "pdf" {
        guard let document = PDFDocument(url: fileURL) else {
            throw NSError(domain: "LocalOCR", code: 1, userInfo: [NSLocalizedDescriptionKey: "Could not open PDF"])
        }
        let count = min(document.pageCount, pageLimit)
        if document.pageCount > pageLimit {
            warnings.append("PDF has \(document.pageCount) pages; processed the first \(pageLimit).")
        }
        for index in 0..<count {
            guard let page = document.page(at: index), let image = imageForPDFPage(page) else {
                warnings.append("Could not render PDF page \(index + 1).")
                continue
            }
            pages.append(try recognize(image, pageNumber: index + 1, languages: languages))
        }
    } else {
        guard let source = CGImageSourceCreateWithURL(fileURL as CFURL, nil),
              let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
            throw NSError(domain: "LocalOCR", code: 2, userInfo: [NSLocalizedDescriptionKey: "Could not open image"])
        }
        pages.append(try recognize(image, pageNumber: 1, languages: languages))
    }

    let result = OCRResult(source: fileURL.path, pages: pages, warnings: warnings)
    let encoder = JSONEncoder()
    encoder.outputFormatting = [.sortedKeys]
    let data = try encoder.encode(result)
    print(String(decoding: data, as: UTF8.self))
} catch {
    fputs("OCR failed: \(error.localizedDescription)\n", stderr)
    exit(1)
}
