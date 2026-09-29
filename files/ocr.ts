import { execFile } from "node:child_process"
import { access, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import { promisify } from "node:util"
import { fileURLToPath } from "node:url"
import { type Plugin, tool } from "@opencode-ai/plugin"

const execFileAsync = promisify(execFile)
const helperPath = fileURLToPath(new URL("./ocr-helper.swift", import.meta.url))
const MAX_INPUT_BYTES = 100 * 1024 * 1024
const MAX_OUTPUT_CHARS = 150_000
const SUPPORTED_EXTENSIONS = new Set([
  ".pdf", ".png", ".jpg", ".jpeg", ".tif", ".tiff", ".bmp", ".gif", ".heic",
])

export const OCRPlugin: Plugin = async () => ({
  tool: {
    ocr_document: tool({
      description:
        "Run local OCR on a PDF or image using macOS Vision. Returns recognized text grouped by page with confidence scores. Optionally save the extracted text to a project-relative .txt file. No document content is uploaded.",
      args: {
        file_path: tool.schema.string().describe("Absolute or project-relative path to a PDF or image"),
        languages: tool.schema.string().optional().describe("Comma-separated Vision language codes, for example en-US or en-US,id-ID; defaults to en-US"),
        page_limit: tool.schema.number().optional().describe("Maximum PDF pages to process (1-100); defaults to 30"),
        output_file: tool.schema.string().optional().describe("Optional .txt output path relative to the project worktree"),
      },
      async execute(args, context) {
        const sourcePath = path.resolve(context.directory, args.file_path)
        const extension = path.extname(sourcePath).toLowerCase()
        if (!SUPPORTED_EXTENSIONS.has(extension)) {
          throw new Error(`Unsupported file type ${extension || "(no extension)"}. Use PDF, PNG, JPEG, TIFF, BMP, GIF, or HEIC.`)
        }

        await access(sourcePath)
        const sourceStat = await stat(sourcePath)
        if (!sourceStat.isFile()) throw new Error("OCR input must be a regular file")
        if (sourceStat.size > MAX_INPUT_BYTES) throw new Error("OCR input exceeds the 100 MB limit")

        const pageLimit = Math.max(1, Math.min(100, Math.trunc(args.page_limit ?? 30)))
        const languages = (args.languages ?? "en-US").trim()
        const { stdout } = await execFileAsync(
          "/usr/bin/swift",
          [helperPath, sourcePath, languages, String(pageLimit)],
          { timeout: 180_000, maxBuffer: 8 * 1024 * 1024 },
        )

        const result = JSON.parse(stdout) as {
          source: string
          pages: Array<{ page: number; text: string; observations: Array<{ text: string; confidence: number }> }>
          warnings: string[]
        }
        const text = result.pages.map((page) => `--- Page ${page.page} ---\n${page.text}`).join("\n\n")
        let savedTo: string | undefined

        if (args.output_file) {
          const outputPath = path.resolve(context.worktree || context.directory, args.output_file)
          const basePath = path.resolve(context.worktree || context.directory) + path.sep
          if (!outputPath.startsWith(basePath)) {
            throw new Error("output_file must stay inside the project worktree")
          }
          if (path.extname(outputPath).toLowerCase() !== ".txt") {
            throw new Error("output_file must use the .txt extension")
          }
          await writeFile(outputPath, `${text}\n`, "utf8")
          savedTo = outputPath
        }

        const limitedText = text.length > MAX_OUTPUT_CHARS
          ? `${text.slice(0, MAX_OUTPUT_CHARS)}\n\n[Output truncated at ${MAX_OUTPUT_CHARS} characters]`
          : text
        return JSON.stringify({
          source: result.source,
          pages_processed: result.pages.length,
          page_text: limitedText,
          warnings: result.warnings,
          ...(savedTo ? { saved_to: savedTo } : {}),
        }, null, 2)
      },
    }),
  },
})
