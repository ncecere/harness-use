/* =========================================================
   SKILLS & MCP LIBRARY — data for library.html
   (rendered by js/library-page.js)

   Entry fields
     id       anchor: library.html#<id>
     name     display name
     type     "skill" | "mcp"
     task     one TASKS id (the group it's listed under)
     status   "reviewed"  installed by a kit, pinned, read in full
              "listed"    repo checked (exists, license, recent
                          activity, SKILL.md path), not read line by line
     summary  plain words; what it does for a researcher
     repo     "owner/name" on GitHub
     path     skills: folder holding SKILL.md ("" = repo root)
     ref      optional git tag to pin
     license  SPDX id or short text
     flow     "local"     runs on your computer; no outside calls
              "external"  sends requests to outside services
     needs    what you need besides the agent
     only     optional: which agents it works with, if not all
     run      mcp only: { command: [...], env: {NAME: "ENV_VAR"} }
              or { url: "https://..." }
     setup    optional extra install steps (plain text)
     note     optional caution shown on the entry
     tags     extra search words

   Checked against GitHub on CHECKED. Re-check before relying
   on a "listed" entry.
   ========================================================= */
window.LIBRARY = (() => {
  const KD = "K-Dense-AI/scientific-agent-skills";
  const KD_REF = "v2.69.0";

  const TASKS = [
    { id: "papers", title: "Find and read papers" },
    { id: "reviews", title: "Literature and systematic reviews" },
    { id: "citations", title: "Citations and Zotero" },
    { id: "documents", title: "Read and convert documents" },
    { id: "data", title: "Public and government data" },
    { id: "analysis", title: "Data analysis and statistics" },
    { id: "figures", title: "Figures" },
    { id: "geo", title: "Maps and geospatial data" },
    { id: "writing", title: "Writing, peer review, and grants" },
    { id: "audio", title: "Interviews and audio" },
    { id: "notes", title: "Notes and knowledge bases" },
    { id: "web", title: "Web search and browsing" },
    { id: "code", title: "Code and collaboration" }
  ];

  const ENTRIES = [
    /* ---------- reviewed: the pinned set our research kits install ---------- */
    { id: "paper-lookup", name: "paper-lookup", type: "skill", task: "papers", status: "reviewed",
      summary: "Searches 18 scholarly sources, including PubMed, arXiv, OpenAlex, Crossref, Semantic Scholar, and Unpaywall, and records where each result came from.",
      repo: KD, path: "skills/paper-lookup", ref: KD_REF, license: "MIT", flow: "external",
      needs: "Python 3.11+ and curl. Free API keys (NCBI, Semantic Scholar, CORE, OpenAlex) are optional and raise rate limits.",
      tags: "pubmed arxiv doi open access search" },
    { id: "citation-management", name: "citation-management", type: "skill", task: "citations", status: "reviewed",
      summary: "Looks up papers in OpenAlex, PubMed, and Google Scholar, checks citation details, and writes BibTeX entries.",
      repo: KD, path: "skills/citation-management", ref: KD_REF, license: "MIT", flow: "external",
      needs: "Python 3.9+ with requests.", tags: "bibtex doi references bibliography" },
    { id: "database-lookup", name: "database-lookup", type: "skill", task: "data", status: "reviewed",
      summary: "Queries documented public database APIs and records the exact endpoint and filters, so every number can be traced to its source.",
      repo: KD, path: "skills/database-lookup", ref: KD_REF, license: "MIT", flow: "external",
      needs: "Network access. Some databases need their own free key.", tags: "api provenance regulatory financial scientific" },
    { id: "scientific-critical-thinking", name: "scientific-critical-thinking", type: "skill", task: "writing", status: "reviewed",
      summary: "Checks claims and the quality of evidence: study design, bias, confounders, and grading frameworks such as GRADE.",
      repo: KD, path: "skills/scientific-critical-thinking", ref: KD_REF, license: "MIT", flow: "local",
      needs: "Nothing extra.", note: "An optional figure feature calls OpenRouter, an outside service. Leave it off.",
      tags: "evidence bias audit claims grade" },
    { id: "scientific-writing", name: "scientific-writing", type: "skill", task: "writing", status: "reviewed",
      summary: "Drafts and revises manuscripts and reports while tracking where each claim came from and which reporting guideline applies.",
      repo: KD, path: "skills/scientific-writing", ref: KD_REF, license: "MIT", flow: "local",
      needs: "Python 3.11+ for the optional checking tools.", tags: "manuscript report draft revise" },
    { id: "liteparse", name: "liteparse", type: "skill", task: "documents", status: "reviewed",
      summary: "Pulls text out of PDFs, Office files, and images on your computer, keeping the layout, with OCR for scanned pages.",
      repo: KD, path: "skills/liteparse", ref: KD_REF, license: "Apache-2.0", flow: "local",
      needs: "Python 3.10+. LibreOffice for Office files and ImageMagick for images are optional.", tags: "pdf ocr scan extract tables" },
    { id: "markitdown", name: "markitdown", type: "skill", task: "documents", status: "reviewed",
      summary: "Converts PDF, Word, PowerPoint, Excel, HTML, and other files to Markdown on your computer so the agent can read them.",
      repo: KD, path: "skills/markitdown", ref: KD_REF, license: "MIT", flow: "local",
      needs: "Python 3.10+ and uv.", note: "Converting a URL, a YouTube video, or audio, or using the Azure options, sends data to outside services.",
      tags: "pdf docx pptx xlsx convert markdown" },
    { id: "exploratory-data-analysis", name: "exploratory-data-analysis", type: "skill", task: "analysis", status: "reviewed",
      summary: "Profiles CSV, TSV, and JSON files on your computer: missing values, outliers, and a report you can check.",
      repo: KD, path: "skills/exploratory-data-analysis", ref: KD_REF, license: "MIT", flow: "local",
      needs: "Python 3.11+.", tags: "eda csv profile missing outliers" },
    { id: "statistical-analysis", name: "statistical-analysis", type: "skill", task: "analysis", status: "reviewed",
      summary: "Helps choose a statistical test, check its assumptions, compute effect sizes and power, and report results in APA style.",
      repo: KD, path: "skills/statistical-analysis", ref: KD_REF, license: "MIT", flow: "local",
      needs: "Python with the statistics packages it asks for.", tags: "t-test anova regression power apa hypothesis" },

    /* ---------- listed: same collection, not part of the pinned set ---------- */
    { id: "kdense-literature-review", name: "literature-review", type: "skill", task: "reviews", status: "listed",
      summary: "Runs a structured literature search across PubMed, arXiv, bioRxiv, Semantic Scholar, and others and writes a formatted review with citations.",
      repo: KD, path: "skills/literature-review", ref: KD_REF, license: "MIT", flow: "external",
      needs: "Network access.", note: "Can use paid search services (Parallel, Exa, or OpenRouter) that need their own accounts. The Kit 10 installer adds it only with `--extended`.",
      tags: "systematic review synthesis meta-analysis" },
    { id: "peer-review", name: "peer-review", type: "skill", task: "writing", status: "listed",
      summary: "Drafts a structured peer review of a manuscript, protocol, or proposal: claims against evidence, methods, statistics, and reporting.",
      repo: KD, path: "skills/peer-review", ref: KD_REF, license: "MIT", flow: "local", needs: "Python 3.11+ for the optional checking tools.",
      note: "Manuscripts you review are confidential. Use a local model, and check the journal's or funder's policy on AI in review first.",
      tags: "referee manuscript critique" },
    { id: "research-grants", name: "research-grants", type: "skill", task: "writing", status: "listed",
      summary: "Guides proposals for NSF, NIH, DOE, and DARPA: agency formatting, review criteria, budgets, and broader impacts.",
      repo: KD, path: "skills/research-grants", ref: KD_REF, license: "MIT", flow: "local", needs: "Nothing extra.",
      tags: "grant proposal nsf nih funding" },
    { id: "scientific-brainstorming", name: "scientific-brainstorming", type: "skill", task: "writing", status: "listed",
      summary: "Structures early-stage idea generation: independent ideas, stated assumptions, a critical review, and a decision log.",
      repo: KD, path: "skills/scientific-brainstorming", ref: KD_REF, license: "MIT", flow: "local", needs: "Nothing extra.",
      tags: "ideas research questions" },
    { id: "statsmodels", name: "statsmodels", type: "skill", task: "analysis", status: "listed",
      summary: "Fits regression, GLM, mixed-effects, and time-series models with full diagnostics and coefficient tables.",
      repo: KD, path: "skills/statsmodels", ref: KD_REF, license: "BSD-3-Clause", flow: "local", needs: "Python 3.9+ and statsmodels.",
      tags: "econometrics ols glm arima regression" },
    { id: "pymc", name: "pymc", type: "skill", task: "analysis", status: "listed",
      summary: "Builds Bayesian models with PyMC: hierarchical models, MCMC sampling, and model comparison.",
      repo: KD, path: "skills/pymc", ref: KD_REF, license: "Apache-2.0", flow: "local", needs: "Python 3.12+ and PyMC.",
      tags: "bayesian mcmc hierarchical" },
    { id: "polars", name: "polars", type: "skill", task: "analysis", status: "listed",
      summary: "Cleans and reshapes large tables quickly with the Polars DataFrame library, including files larger than memory.",
      repo: KD, path: "skills/polars", ref: KD_REF, license: "MIT", flow: "local", needs: "Python 3.10+ and Polars.",
      tags: "dataframe pandas etl large data" },
    { id: "astropy", name: "astropy", type: "skill", task: "analysis", status: "listed",
      summary: "Works with astronomy data in Astropy: units, coordinates, FITS files, time systems, and cosmology.",
      repo: KD, path: "skills/astropy", ref: KD_REF, license: "BSD-3-Clause", flow: "local", needs: "Python 3.11+ and Astropy.",
      note: "Name lookups and remote FITS reads contact outside services.", tags: "astronomy astrophysics fits" },
    { id: "datalad", name: "datalad", type: "skill", task: "data", status: "listed",
      summary: "Downloads and versions research datasets with DataLad (OpenNeuro, DANDI, and others) and records how each output was made.",
      repo: KD, path: "skills/datalad", ref: KD_REF, license: "MIT", flow: "external", needs: "DataLad, git, and git-annex.",
      tags: "dataset provenance neuroimaging reproducibility" },
    { id: "usfiscaldata", name: "usfiscaldata", type: "skill", task: "data", status: "listed",
      summary: "Pulls federal financial data from the U.S. Treasury Fiscal Data API: debt, daily and monthly statements, auctions, and rates.",
      repo: KD, path: "skills/usfiscaldata", ref: KD_REF, license: "MIT", flow: "external", needs: "Network access. No key needed.",
      tags: "treasury federal budget debt government" },
    { id: "scientific-visualization", name: "scientific-visualization", type: "skill", task: "figures", status: "listed",
      summary: "Designs and checks publication figures in Matplotlib, Seaborn, or Plotly: multi-panel layouts, uncertainty, color, and contrast.",
      repo: KD, path: "skills/scientific-visualization", ref: KD_REF, license: "MIT", flow: "local", needs: "Python 3.11+ and uv.",
      tags: "plot chart matplotlib seaborn accessible" },
    { id: "geopandas", name: "geopandas", type: "skill", task: "geo", status: "listed",
      summary: "Works with vector map data in GeoPandas: spatial joins, projections, and reading and writing shapefiles and GeoPackages.",
      repo: KD, path: "skills/geopandas", ref: KD_REF, license: "MIT", flow: "local", needs: "Python 3.10+ and the GeoPandas stack.",
      tags: "gis shapefile spatial vector" },

    /* ---------- listed: other collections ---------- */
    { id: "slr-prisma", name: "slr-prisma", type: "skill", task: "reviews", status: "listed",
      summary: "Guides a systematic review that follows PRISMA 2020, including the flow diagram, the checklist, and a Word manuscript.",
      repo: "keemanxp/slr-prisma", path: "", license: "MIT", flow: "local", needs: "Nothing extra.",
      tags: "prisma systematic review flow diagram" },
    { id: "scholar-literature-review", name: "literature-review (ai-skill-scholar)", type: "skill", task: "reviews", status: "listed",
      summary: "Runs a two-pass review: a wide OpenAlex search, screening by title and abstract, full-text reading of the shortlist, then a written synthesis.",
      repo: "dsebastien/ai-skill-scholar", path: "skills/literature-review", license: "MIT", flow: "external",
      needs: "Python 3.11+. Also install the scholar-search skill from the same repository.", tags: "openalex screening synthesis" },
    { id: "zotero-use", name: "zotero-use", type: "skill", task: "citations", status: "listed",
      summary: "Searches your Zotero library and inserts live Zotero citations into Word documents.",
      repo: "drguptavivek/zotero-use", path: "", license: "MIT", flow: "local", needs: "Zotero 7+ and the tools listed in its SKILL.md.",
      tags: "zotero word docx citations library" },
    { id: "academic-paper-reviewer", name: "academic-paper-reviewer", type: "skill", task: "writing", status: "listed",
      summary: "Simulates a panel review of a paper (an editor, three reviewers, and a devil's advocate) and returns a decision and revision plan.",
      repo: "timpara/opencode-academic-research", path: "skills/academic-paper-reviewer", license: "CC-BY-NC-4.0", flow: "local", needs: "Nothing extra.",
      note: "Noncommercial license.", tags: "peer review manuscript feedback" },
    { id: "grant-writer", name: "grant-writer", type: "skill", task: "writing", status: "listed",
      summary: "Drafts grant sections (specific aims, significance, approach, broader impacts, budget justification, data management plan) for NSF, NIH, and others.",
      repo: "Marazii/research-co-pilot", path: "skills/grant-writer", license: "MIT", flow: "local", needs: "Nothing extra.",
      tags: "grant proposal aims nih nsf dmp" },
    { id: "api-data-fetcher", name: "api-data-fetcher", type: "skill", task: "data", status: "listed",
      summary: "Writes reproducible Python scripts that download data from FRED, the World Bank, BLS, OECD, IMF, and Eurostat, with a codebook for each source.",
      repo: "JonasWeinert/EconAgentSkills", path: "_skills/data/api-data-fetcher", license: "CC0-1.0", flow: "external",
      needs: "Python. FRED and BLS need free API keys.", tags: "economics fred world bank imf oecd" },
    { id: "gdal", name: "gdal", type: "skill", task: "geo", status: "listed",
      summary: "Uses GDAL command-line tools to inspect, reproject, clip, and convert raster and vector map data.",
      repo: "isaaccorley/geospatial-skills", path: "skills/gdal", license: "Apache-2.0", flow: "local", needs: "GDAL installed.",
      tags: "raster gis reproject cog" },
    { id: "transcribe", name: "transcribe", type: "skill", task: "audio", status: "listed",
      summary: "Transcribes audio on your Mac without sending it anywhere, with timestamps every 15 seconds.",
      repo: "badlogic/pi-skills", path: "transcribe", license: "MIT", flow: "local", only: "Pi, on Apple silicon Macs",
      needs: "ffmpeg for formats other than WAV. The first run downloads the transcription program and model.",
      note: "Transcription is local, which suits interview data. Check your IRB protocol before processing recordings.",
      tags: "interview speech qualitative recording" },

    /* ---------- listed: MCP servers ---------- */
    { id: "pubmed-mcp", name: "PubMed MCP server", type: "mcp", task: "papers", status: "listed",
      summary: "Searches PubMed and Europe PMC, fetches abstracts and open full text, follows citations, and looks up MeSH terms.",
      repo: "cyanheads/pubmed-mcp-server", license: "Apache-2.0", flow: "external", needs: "Node.js. An NCBI API key is optional.",
      run: { command: ["npx", "-y", "@cyanheads/pubmed-mcp-server@latest"] },
      note: "The README also offers a hosted copy run by the author. Use the local command above instead.", tags: "pubmed mesh biomedical" },
    { id: "arxiv-mcp", name: "arXiv MCP server", type: "mcp", task: "papers", status: "listed",
      summary: "Searches arXiv, downloads papers, reads sections, and exports BibTeX.",
      repo: "cyanheads/arxiv-mcp-server", license: "Apache-2.0", flow: "external", needs: "Node.js.",
      run: { command: ["npx", "-y", "@cyanheads/arxiv-mcp-server@latest"] }, tags: "preprints physics cs math" },
    { id: "semantic-scholar-mcp", name: "Semantic Scholar MCP server", type: "mcp", task: "papers", status: "listed",
      summary: "Searches Semantic Scholar and returns paper details, authors, and citation links.",
      repo: "smaniches/semantic-scholar-mcp", license: "MIT", flow: "external", needs: "uv. A Semantic Scholar API key is optional.",
      run: { command: ["uvx", "s2-mcp-server"] }, tags: "citations graph authors" },
    { id: "crossref-mcp", name: "Crossref MCP server", type: "mcp", task: "citations", status: "listed",
      summary: "Resolves DOIs and searches Crossref metadata for works, journals, and funders.",
      repo: "cyanheads/crossref-mcp-server", license: "Apache-2.0", flow: "external", needs: "Node.js. Crossref asks for a contact email.",
      run: { command: ["npx", "-y", "@cyanheads/crossref-mcp-server@latest"], env: { CROSSREF_MAILTO: "CROSSREF_MAILTO" } },
      setup: "Set `CROSSREF_MAILTO` to your UF email address.", tags: "doi metadata funders" },
    { id: "zotero-mcp", name: "Zotero MCP server", type: "mcp", task: "citations", status: "listed",
      summary: "Lets the agent search, read, and annotate your Zotero library through Zotero's local connection.",
      repo: "54yyyu/zotero-mcp", license: "MIT", flow: "local", needs: "Zotero 7+ running on the same computer, and uv.",
      run: { command: ["zotero-mcp"], env: { ZOTERO_LOCAL: "=true" } },
      setup: "Run `uv tool install zotero-mcp-server`. In Zotero, open Settings › Advanced and allow other applications on this computer to communicate with Zotero.",
      note: "It can also add and change library items if you authorize writes. Leave writes off until you trust it.", tags: "references library pdfs annotations" },
    { id: "markitdown-mcp", name: "MarkItDown MCP server", type: "mcp", task: "documents", status: "listed",
      summary: "Microsoft's server for converting files to Markdown. The agent calls one tool with a file path.",
      repo: "microsoft/markitdown", license: "MIT", flow: "local", needs: "uv.",
      run: { command: ["uvx", "markitdown-mcp"] },
      note: "Also accepts web addresses, which fetch from the internet. The markitdown skill does the same job without a server.", tags: "pdf docx convert" },
    { id: "jupyter-mcp", name: "Jupyter MCP server", type: "mcp", task: "analysis", status: "listed",
      summary: "Lets the agent create, edit, and run cells in a Jupyter notebook you have open, and see the output.",
      repo: "datalayer/jupyter-mcp-server", license: "BSD-3-Clause", flow: "local", needs: "JupyterLab running on your computer, and uv.",
      run: { command: ["uvx", "jupyter-mcp-server@latest"], env: { JUPYTER_URL: "=http://localhost:8888", JUPYTER_TOKEN: "JUPYTER_TOKEN" } },
      setup: "Start JupyterLab with a token, for example `jupyter lab --port 8888 --IdentityProvider.token \"$JUPYTER_TOKEN\"`.",
      tags: "notebook python kernel" },
    { id: "census-mcp", name: "U.S. Census Bureau MCP server", type: "mcp", task: "data", status: "listed",
      summary: "The Census Bureau's own server for finding datasets and pulling statistics from the Census Data API.",
      repo: "uscensusbureau/us-census-bureau-data-api-mcp", license: "CC0-1.0", flow: "external", needs: "Docker and a free Census API key.",
      setup: "Clone the repository and follow its README: it builds a local database with Docker, then gives the command to add to your agent.",
      tags: "acs demographics government statistics" },
    { id: "data360-mcp", name: "World Bank Data360 MCP server", type: "mcp", task: "data", status: "listed",
      summary: "The World Bank's server for searching development indicators and retrieving time series from Data360.",
      repo: "worldbank/data360-mcp", license: "MIT", flow: "external", needs: "uv.",
      run: { url: "http://localhost:8000/mcp" },
      setup: "Clone the repository, then run `uv run poe serve` in it. Keep that running while you work.", tags: "development indicators gdp poverty" },
    { id: "earthdata-mcp", name: "NASA Earthdata MCP server", type: "mcp", task: "data", status: "listed",
      summary: "NASA's hosted server for finding Earth science datasets, files, and tools in the Common Metadata Repository.",
      repo: "nasa/earthdata-mcp", license: "Not stated (U.S. government)", flow: "external", needs: "Nothing. NASA hosts it.",
      run: { url: "https://cmr.earthdata.nasa.gov/mcp/v1" }, tags: "remote sensing climate satellite" },
    { id: "obsidian-mcp", name: "Obsidian MCP server", type: "mcp", task: "notes", status: "listed",
      summary: "Reads, searches, and edits notes in your Obsidian vault.",
      repo: "cyanheads/obsidian-mcp-server", license: "Apache-2.0", flow: "local", needs: "Obsidian with the Local REST API plugin, and Node.js.",
      run: { command: ["npx", "-y", "obsidian-mcp-server@latest"], env: { OBSIDIAN_API_KEY: "OBSIDIAN_API_KEY" } },
      setup: "Install the Local REST API community plugin in Obsidian and copy its key into `OBSIDIAN_API_KEY`.", tags: "notes vault markdown" },
    { id: "notion-mcp", name: "Notion MCP server", type: "mcp", task: "notes", status: "listed",
      summary: "Notion's server for searching, reading, and updating pages and databases.",
      repo: "makenotion/notion-mcp-server", license: "MIT", flow: "external", needs: "Node.js and a Notion integration token.",
      run: { command: ["npx", "-y", "@notionhq/notion-mcp-server"], env: { NOTION_TOKEN: "NOTION_TOKEN" } }, tags: "wiki pages databases" },
    { id: "playwright-mcp", name: "Playwright MCP server", type: "mcp", task: "web", status: "listed",
      summary: "Microsoft's server that lets the agent drive a real web browser: open pages, click, fill forms, and read what's on screen.",
      repo: "microsoft/playwright-mcp", license: "Apache-2.0", flow: "external", needs: "Node.js.",
      run: { command: ["npx", "@playwright/mcp@latest"] },
      note: "The browser can reach anything you can, including sites you're signed in to. Watch what it does.", tags: "browser automation scrape forms" },
    { id: "brave-search-mcp", name: "Brave Search MCP server", type: "mcp", task: "web", status: "listed",
      summary: "Brave's server for web, news, image, and video search.",
      repo: "brave/brave-search-mcp-server", license: "MIT", flow: "external", needs: "Node.js and a Brave Search API key.",
      run: { command: ["npx", "-y", "@brave/brave-search-mcp-server"], env: { BRAVE_API_KEY: "BRAVE_API_KEY" } }, tags: "search news" },
    { id: "exa-mcp", name: "Exa MCP server", type: "mcp", task: "web", status: "listed",
      summary: "Exa's hosted server for web search and page fetching. It asks you to sign in to Exa the first time.",
      repo: "exa-labs/exa-mcp-server", license: "MIT", flow: "external", needs: "An Exa account.",
      run: { url: "https://mcp.exa.ai/mcp" }, tags: "search fetch" },
    { id: "github-mcp", name: "GitHub MCP server", type: "mcp", task: "code", status: "listed",
      summary: "GitHub's hosted server for repositories, issues, pull requests, and code search.",
      repo: "github/github-mcp-server", license: "MIT", flow: "external", needs: "A GitHub account.",
      run: { url: "https://api.githubcopilot.com/mcp/" },
      note: "It adds many tools, which uses up the model's context. Turn it on only when you need it.", tags: "issues pull requests repositories" }
  ];

  const DIRECTORIES = [
    { name: "Official MCP Registry", url: "https://registry.modelcontextprotocol.io", text: "The MCP project's own list of published servers." },
    { name: "MCP reference servers", url: "https://github.com/modelcontextprotocol/servers", text: "Example servers from the MCP maintainers, plus a long list of community servers." },
    { name: "Agent Skills", url: "https://agentskills.io", text: "The open SKILL.md format that OpenCode and Pi both read, with links to skill collections." },
    { name: "skills.sh", url: "https://skills.sh", text: "A searchable index of public skills with install counts." },
    { name: "Pi packages", url: "https://pi.dev/packages", text: "Extensions and skills packaged for Pi, including pi-mcp-adapter." },
    { name: "Awesome Agent Skills", url: "https://github.com/VoltAgent/awesome-agent-skills", text: "A community-curated list of skills, grouped by topic." }
  ];

  const LEFT_OUT = [
    { name: "pdf, docx, xlsx, pptx (Anthropic)", why: "Their license allows use only inside Anthropic's services and forbids keeping copies elsewhere. Copies ship in some collections, including K-Dense. Use liteparse and markitdown instead." },
    { name: "paper-search-mcp", why: "It includes an optional Sci-Hub connector. It's off by default, but we don't list tools that offer it." },
    { name: "Microsoft 365 MCP servers", why: "Connecting an outside app to UF mail and files needs UFIT approval. Use Microsoft 365 Copilot (Kit 30) instead." },
    { name: "Google Scholar servers", why: "Google Scholar has no public API. These servers scrape it, often through a paid proxy." },
    { name: "Repositories with no license or no SKILL.md", why: "Without a license you have no clear right to copy the files. Without a SKILL.md, OpenCode and Pi can't load them as skills." }
  ];

  return { CHECKED: "2026-09-28", KD_REF, TASKS, ENTRIES, DIRECTORIES, LEFT_OUT };
})();
