/* KIT 13 — Literature and Systematic Reviews
   Sources: PRISMA 2020 statement (prisma-statement.org), K-Dense scientific-agent-skills v2.69.0
   (paper-lookup, citation-management), NCBI E-utilities and OpenAlex API docs, and a full practice
   review run on the NaviGator dev endpoint with meta-muse-glimmer-30b, September 2026.
   Every result quoted on this page was checked by hand against PubMed and Crossref. */
window.KIT = {
  slug: "literature-review",
  summary: "Use an agent for the repetitive parts of a literature review: running and logging searches, removing duplicates, a first pass at screening, PRISMA counts, and a checked bibliography. You make the decisions. This kit follows a real practice review, including the mistakes the agent made and how we caught them. It works in OpenCode, OpenCode Desktop, or Pi.",
  parts: [
    "A research workspace with the research skills from [Kit 10](../opencode-research/) or [Kit 11](../pi-research/)",
    "A review question and inclusion criteria",
    "Python 3.11 or later",
    "Time to check the agent's work. Plan on as long as the agent takes, or longer."
  ],
  outcome: [
    "A written protocol the agent follows",
    "A search log with exact queries, dates, and counts",
    "A deduplicated record set with a screening decision and reason for each",
    "PRISMA 2020 counts from a script, and a bibliography with verified DOIs"
  ],
  steps: [
    {
      id: "protocol",
      title: "Write the protocol first",
      minutes: 15,
      blocks: [
        "The protocol is the agent's instructions and your methods section. Fill it in before any search: the question, eligibility criteria, databases, search terms, and what to extract.",
        { files: [{ href: "files/review-protocol.md", name: "protocol.md" }] },
        "Save it as `protocol.md` in the workspace. For our practice run, the question was \"How has telehealth been used to deliver mental health care to adults in rural areas of the United States?\", limited to 2020–2025, English, empirical studies, searched in PubMed and OpenAlex.",
        { note: "tip", text: "UF Libraries helps with review protocols and search strategies, and a librarian can join larger reviews as a co-author. See [Systematic Reviews at UF Libraries](https://arcs.uflib.ufl.edu/services/systematic-reviews/). If you plan to publish, register the protocol (for example with PROSPERO or OSF) before you screen." }
      ]
    },
    {
      id: "rules",
      title: "Add review rules to the workspace",
      minutes: 3,
      blocks: [
        "Replace or extend `AGENTS.md` with rules for review work: log every search, count with scripts, give a reason for every screening decision, and never invent a citation.",
        { files: [{ href: "files/review-AGENTS.md", name: "AGENTS.md" }] },
        { code: `## Screening
- Screening is a judgment. Read each title and abstract yourself and
  decide. Never screen with keyword rules or a script.
- Screen against the eligibility criteria in protocol.md only.
- Write outputs/screening.csv: record ID, decision (include, exclude,
  unsure), and a one-line reason that names the criterion.
- When in doubt, mark "unsure". Never exclude a record for lack of an
  abstract.`, file: "AGENTS.md", label: "excerpt" },
        { note: "caution", title: "Why the first rule is there", text: "Our first version said only \"count with scripts\". The agent applied that to screening too and wrote keyword rules, so `app` matched \"approach\" and `us` matched \"focus\". It marked 54 of 79 records \"unsure\" without reading them. Saying outright that screening is a judgment fixed it." }
      ]
    },
    {
      id: "search",
      title: "Run and log the searches",
      minutes: 10,
      blocks: [
        "Start your agent in the workspace (`opencode` or `pi`) and ask:",
        { prompt: `Read protocol.md. Use the paper-lookup skill to search PubMed and
OpenAlex for this review. Build one query per database from the search
terms, apply the year limits, and keep up to 40 records per database.
Log each search in outputs/search-log.md and save all records to
outputs/records.csv as described in AGENTS.md. Use a script in scripts/
to write the CSV.` },
        "In our run this took 53 seconds. The agent wrote a script that queried PubMed's and OpenAlex's public APIs, saved 80 records, and logged both queries with their dates and hit counts.",
        { note: "data", text: "Your search terms go to PubMed and OpenAlex. That's fine for a review question, but keep unpublished findings and participant details out of queries." }
      ]
    },
    {
      id: "check",
      title: "Check the records before screening",
      minutes: 10,
      blocks: [
        "The agent reported success, but the records had problems. Don't take \"done\" as proof. Ask for a check that counts things:",
        { prompt: `Check outputs/records.csv before we screen. With a script, count empty
values in each column by source, and list any records with a year
outside the protocol range. If a bug in scripts/build_records.py caused
a problem, fix the script, rerun it, and show the counts again. Also
check that the PubMed search really applies the publication-date limits.` },
        { table: {
          head: ["What the check found", "Cause"],
          rows: [
            ["All 40 PubMed abstracts were empty", "The script asked PubMed for one format and parsed another. The agent switched to the MEDLINE format and fixed the parser."],
            ["The PubMed date limit wasn't applied as intended", "The query left out `datetype=pdat`, so PubMed filtered by entry date. With the fix, the count went from 55 to 58, matching our own check."],
            ["One record said 2001 but studied 2021–2023", "A quirk in PubMed's own metadata. The agent's fix special-cased the year 2001; a general rule would be better."]
          ]
        } },
        "The check took about four minutes. It's the most valuable prompt in this kit: a screening pass on records without abstracts would have been worthless."
      ]
    },
    {
      id: "screen",
      title: "Deduplicate and screen",
      minutes: 15,
      blocks: [
        { prompt: `Deduplicate outputs/records.csv by DOI, then by normalized title, with a
script; save outputs/records-dedup.csv. Then screen every record's title
and abstract against the eligibility criteria in protocol.md, following
the Screening rules in AGENTS.md. Read the records in batches of 20 so
none are skipped. Write outputs/screening.csv, then use a script to
write the PRISMA 2020 identification and screening counts to
outputs/prisma-counts.md.` },
        "Deduplication was correct: one record appeared in both databases. Screening the 79 remaining records took about two and a half minutes: 13 include, 59 exclude, and 7 unsure, each with a reason.",
        { h: "How the screening held up" },
        "We read every include, every unsure, and 20 of the excludes.",
        { ul: [
          "**Includes:** 8 of 13 were clear includes. Three were about telehealth in general rather than mental health care, and two didn't show a rural focus and should have been \"unsure\".",
          "**Excludes:** 18 of 20 were defensible. One had a false reason (\"year outside 2020–2025\" for a 2022 paper), and one was excluded from its title alone, against the rule for records without abstracts.",
          "**Unsures:** all seven were reasonable calls to send to full-text review."
        ] }
      ]
    },
    {
      id: "verify",
      title: "Check every decision yourself",
      minutes: 30,
      blocks: [
        "Treat the agent's screening as a second screener, never the only one. Review standards expect two independent screeners, and the model makes the same kinds of mistakes a hurried person would, plus a few of its own.",
        { ol: [
          "Screen a sample yourself before you look at the agent's decisions, then compare. Note how often you agree.",
          "Read every exclude reason. A wrong reason is a warning that the decision may be wrong too.",
          "Look hardest at includes that match only part of the question, like our general-telehealth papers.",
          "Record final decisions in a new column, so the file shows both the agent's call and yours.",
          "Report in your methods that an AI model assisted screening, which model, and how its decisions were checked."
        ] },
        { prompt: `Add a column final_decision to outputs/screening.csv, copying decision.
I'll edit it by hand. Then list every record where the reason doesn't
name a criterion from protocol.md.` }
      ]
    },
    {
      id: "bibliography",
      title: "Build a checked bibliography",
      minutes: 5,
      blocks: [
        { prompt: `Use the citation-management skill to build outputs/included.bib, a
BibTeX file for every record marked include in outputs/screening.csv.
Verify each DOI against Crossref or doi.org before adding it, and list
any you could not verify.` },
        "All 13 entries in our run had real DOIs and titles that matched Crossref exactly. Three used the online-first year rather than the print issue year (for example, 2023 instead of 2024). Neither is wrong, but pick one convention for your citation style and check the years before you submit.",
        { note: "check", text: "Every DOI in `included.bib` resolves, and a spot check of titles and years against Crossref matches." }
      ]
    },
    {
      id: "next",
      title: "Report and continue to full text",
      minutes: 5,
      blocks: [
        "`outputs/prisma-counts.md` gives you the identification and screening numbers for a PRISMA 2020 flow diagram. Full-text review, data extraction, and quality appraisal follow the same pattern: a rule in `AGENTS.md`, a prompt, and your check.",
        { ul: [
          "Download open-access PDFs with the `paper-lookup` skill into `sources/`, and convert them locally with `liteparse` or `markitdown`.",
          "Ask for an extraction table with the columns from your protocol, and a page number for every value.",
          "Use `scientific-critical-thinking` to flag weak evidence, then make the appraisal decisions yourself.",
          "The [slr-prisma](../../library.html#slr-prisma) skill can help draft a PRISMA-structured manuscript. It was written for Claude.ai, and its Word export step won't work in OpenCode or Pi."
        ] },
        { note: "data", text: "This practice run used the NaviGator dev endpoint and `meta-muse-glimmer-30b`, with commands approved automatically so it could run unattended. In your own sessions, the agent asks before each command." }
      ]
    }
  ],
  trouble: [
    ["The agent says it's done but a file is empty or short", "Ask for counts: rows per source, empty values per column. Then ask it to fix the script that produced the file."],
    ["Screening decisions all look the same", "Check `scripts/` for a keyword script. Remind the agent that screening is a judgment and to read the records in batches."],
    ["The OpenAlex results are off-topic", "OpenAlex's plain search matches words anywhere in a record. Ask the agent to search titles and abstracts only, or to use its concept filters, and log the new query."],
    ["The context fills up during screening", "Screen in smaller batches (10–20 records), or split the file and screen each part in a new session."],
    ["A DOI won't verify", "Check it on doi.org yourself. Records without DOIs, such as some reports and book chapters, need a different identifier or a manual citation."]
  ],
  refs: [
    ["PRISMA 2020 statement and flow diagram", "https://www.prisma-statement.org/"],
    ["NCBI E-utilities (PubMed API)", "https://www.ncbi.nlm.nih.gov/books/NBK25499/"],
    ["OpenAlex API", "https://docs.openalex.org/"],
    ["K-Dense Scientific Agent Skills", "https://github.com/K-Dense-AI/scientific-agent-skills"],
    ["UF Libraries: Systematic Reviews & Evidence Synthesis guide", "https://guides.uflib.ufl.edu/SR"],
    ["UF Libraries: systematic review support (ARCS)", "https://arcs.uflib.ufl.edu/services/systematic-reviews/"]
  ],
  next: ["connect-mcp", "sensitive-data"]
};
