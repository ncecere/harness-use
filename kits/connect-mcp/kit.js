/* KIT 12 — Connect MCP Servers
   Sources: opencode.ai/docs/mcp-servers, github.com/nicobailon/pi-mcp-adapter (README),
   github.com/cyanheads/pubmed-mcp-server, github.com/microsoft/markitdown (markitdown-mcp),
   and test runs on the NaviGator dev endpoint with meta-muse-glimmer-30b, September 2026. */
window.KIT = {
  slug: "connect-mcp",
  summary: "An MCP server is a small program that gives your agent new tools, such as a PubMed search or a file converter. This kit connects two: **PubMed**, which reaches NCBI's public API, and **MarkItDown**, which converts files on your computer. Every step was run with a NaviGator local model. Pick **OpenCode**, **OpenCode Desktop**, or **Pi** with the Tool switch.",
  variants: [{ id: "opencode", label: "OpenCode" }, { id: "desktop", label: "OpenCode Desktop" }, { id: "pi", label: "Pi" }],
  parts: [
    "A research workspace from [Kit 10](../opencode-research/) or [Kit 11](../pi-research/)",
    "Node.js, for `npx` (the PubMed server asks for version 24 or later)",
    "[uv](https://docs.astral.sh/uv/), for `uvx`",
    "A PDF to practice on"
  ],
  outcome: [
    "Two MCP servers connected to your agent",
    "A way to tell which servers send data outside UF",
    "Prompts that get sourced answers from a server",
    "The habit of turning servers off when you don't need them"
  ],
  steps: [
    {
      id: "choose",
      title: "Choose servers you can trust with your data",
      minutes: 3,
      blocks: [
        "Each server runs as a program on your computer, or as a web service. Before adding one, check three things. The [library](../../library.html) lists them for each server.",
        { table: {
          head: ["Check", "Why it matters"],
          rows: [
            ["Where does it send requests?", "PubMed sends your search terms to NCBI, so use it with open data only. MarkItDown works on files on your computer, so it's fine with any data class and a local model."],
            ["Can it change things?", "Some servers can edit files, write to your Zotero library, or post to GitHub. Start with read-only servers."],
            ["Who maintains it?", "A server runs with your permissions. Prefer servers from the organization behind the service, or projects with a license and recent updates."]
          ]
        } },
        { note: "caution", text: "Every server adds tool descriptions to the model's context, and some return very long results. In our MarkItDown test, converting one 15-page paper used about 625,000 input tokens across the session. Connect only the servers you need for the task at hand." }
      ]
    },
    {
      id: "add",
      title: "Add the servers",
      minutes: 5,
      blocks: [
        { variant: {
          opencode: [
            "Add an `mcp` block to `opencode.json` in your workspace, next to `provider`:",
            { code: `"mcp": {
  "pubmed": {
    "type": "local",
    "command": ["npx", "-y", "@cyanheads/pubmed-mcp-server@latest"]
  },
  "markitdown": {
    "type": "local",
    "command": ["uvx", "markitdown-mcp"]
  }
}`, file: "opencode.json", label: "add inside the top level" },
            "Or download the research config from Kit 10 with these two servers already added:",
            { files: [{ href: "files/opencode-mcp.json", name: "opencode.json" }] }
          ],
          desktop: [
            "OpenCode Desktop reads the same `opencode.json`. Add an `mcp` block next to `provider`:",
            { code: `"mcp": {
  "pubmed": {
    "type": "local",
    "command": ["npx", "-y", "@cyanheads/pubmed-mcp-server@latest"]
  },
  "markitdown": {
    "type": "local",
    "command": ["uvx", "markitdown-mcp"]
  }
}`, file: "opencode.json", label: "add inside the top level" },
            "Or download the desktop research config with these two servers already added:",
            { files: [{ href: "files/opencode-mcp-desktop.json", name: "opencode.json" }] },
            { note: "tip", text: "Apps opened from the Dock or Start menu may not find `npx` and `uvx` if you installed them in a way that only your terminal knows about. If a server fails to start, use the full path from `which npx` or `which uvx` in `command`." }
          ],
          pi: [
            "Pi uses the `pi-mcp-adapter` extension for MCP. Install it once:",
            { code: `pi install npm:pi-mcp-adapter` },
            "Then save this as `.mcp.json` in your workspace. It's the standard MCP format that other tools read too.",
            { files: [{ href: "files/pi-mcp.json", name: ".mcp.json" }] },
            { code: `{
  "mcpServers": {
    "pubmed": {
      "command": "npx",
      "args": ["-y", "@cyanheads/pubmed-mcp-server@latest"]
    },
    "markitdown": {
      "command": "uvx",
      "args": ["markitdown-mcp"]
    }
  }
}`, file: ".mcp.json" },
            "The adapter gives the model one `mcp` tool that looks up server tools when it needs them, instead of loading every tool up front. That keeps context use low."
          ]
        } }
      ]
    },
    {
      id: "check",
      title: "Check that they connect",
      minutes: 2,
      blocks: [
        { variant: {
          opencode: [
            "From the workspace:",
            { code: `opencode mcp list` },
            { note: "check", text: "Both servers show a check mark and **connected**. The first run takes 20–30 seconds while `npx` and `uvx` download the servers." }
          ],
          desktop: [
            "Fully quit and reopen OpenCode Desktop, then open the workspace. If you have the terminal version installed, `opencode mcp list` in the workspace shows the same servers the app will load.",
            { code: `opencode mcp list` },
            { note: "check", text: "Both servers show a check mark and **connected**." }
          ],
          pi: [
            "Start Pi in the workspace. The first time a project server connects, Pi shows its command and asks you to approve it. Approve both. Then open the adapter panel:",
            { code: `pi` },
            { prompt: `/mcp-adapter`, label: "In Pi" },
            { note: "check", text: "The panel lists `pubmed` and `markitdown`. Servers connect the first time the model uses them, so they may show as not connected until then." },
            "Pi won't start a project's servers until you approve them. That stops a folder you download from quietly running programs. In `--print` mode, unapproved servers are skipped."
          ]
        } }
      ]
    },
    {
      id: "search",
      title: "Search PubMed through the server",
      minutes: 5,
      blocks: [
        "Name the server, and tell the agent to use only what the tools return:",
        { prompt: `Use the pubmed MCP tools to find 5 peer-reviewed papers from 2020 or
later on telehealth use in rural areas of the United States. Save a table
to outputs/pubmed-results.md with PMID, DOI, title, first author, journal,
and year. Only include details the tools returned; do not fill anything
in from memory.` },
        "In our run, OpenCode searched PubMed three times, fetched full records for five papers, and wrote the table in 14 seconds. We checked every row against PubMed's own records: all five PMIDs, DOIs, titles, authors, and years were correct.",
        "Relevance was mixed. One result was a position paper rather than a study, and two were only partly about rural care. The server gets the facts right; you still judge what belongs in your review.",
        { note: "data", text: "Your search terms go to NCBI. Don't put unpublished findings, participant details, or anything sensitive in a PubMed search." }
      ]
    },
    {
      id: "convert",
      title: "Convert a PDF on your computer",
      minutes: 5,
      blocks: [
        "MarkItDown converts PDFs, Word, PowerPoint, and Excel files to Markdown without sending them anywhere. Put a PDF in `sources/` and ask:",
        { prompt: `Use the markitdown MCP tool to convert sources/paper.pdf to Markdown
and save it as outputs/paper.md. Then list the paper's numbered section
headings and report the main results table.` },
        "We tried this with the 15-page \"Attention Is All You Need\" paper. The agent converted it, listed the section headings, and reported the two BLEU scores from the results table correctly (28.4 and 41.8), quoting the table row.",
        { note: "caution", text: "Some PDFs lose the spaces between words when converted (\"EncoderandDecoderStacks\"). Numbers usually survive, but compare anything you'll cite against the original page." }
      ]
    },
    {
      id: "keys",
      title: "Servers that need a key or a sign-in",
      minutes: 3,
      blocks: [
        "Some servers need an API key. Keep keys out of config files the same way you did for NaviGator: store the key in an environment variable and refer to it by name.",
        { variant: {
          opencode: [{ code: `"brave": {
  "type": "local",
  "command": ["npx", "-y", "@brave/brave-search-mcp-server"],
  "environment": { "BRAVE_API_KEY": "{env:BRAVE_API_KEY}" }
}`, file: "opencode.json", label: "inside mcp" },
            "Hosted servers use `\"type\": \"remote\"` and a `url`. If one needs you to sign in, OpenCode opens your browser the first time. You can also start it yourself with `opencode mcp auth <name>`."],
          desktop: [{ code: `"brave": {
  "type": "local",
  "command": ["npx", "-y", "@brave/brave-search-mcp-server"],
  "environment": { "BRAVE_API_KEY": "{env:BRAVE_API_KEY}" }
}`, file: "opencode.json", label: "inside mcp" },
            "Apps opened from the Dock or Start menu don't see your terminal's environment variables. For the desktop app, use `{file:~/.config/brave/key}` in place of `{env:...}` and save the key to that file, as you did for NaviGator."],
          pi: [{ code: `"brave": {
  "command": "npx",
  "args": ["-y", "@brave/brave-search-mcp-server"],
  "env": { "BRAVE_API_KEY": "\${BRAVE_API_KEY}" }
}`, file: ".mcp.json", label: "inside mcpServers" },
            "Hosted servers use a `url` instead of `command`. If one needs you to sign in, run `/mcp-auth <name>` in Pi."]
        } },
        "The [library](../../library.html) lists which servers need keys, with install snippets for each."
      ]
    },
    {
      id: "off",
      title: "Turn servers off when you're done",
      minutes: 2,
      blocks: [
        "A connected server's tools are available in every session in that workspace. Turn off the ones you aren't using.",
        { variant: {
          opencode: [{ code: `"pubmed": {
  "type": "local",
  "command": ["npx", "-y", "@cyanheads/pubmed-mcp-server@latest"],
  "enabled": false
}`, file: "opencode.json" }],
          desktop: [{ code: `"pubmed": {
  "type": "local",
  "command": ["npx", "-y", "@cyanheads/pubmed-mcp-server@latest"],
  "enabled": false
}`, file: "opencode.json" }, "Restart the app after changing it."],
          pi: [{ prompt: `/mcp-adapter disable pubmed`, label: "In Pi" }, "Use `/mcp-adapter enable pubmed` to turn it back on. The setting is saved in `.pi/mcp-adapter.json`; your `.mcp.json` doesn't change."]
        } },
        { note: "data", text: "In a [sensitive-data workspace](../sensitive-data/), connect only servers that stay on your computer, such as MarkItDown." }
      ]
    }
  ],
  trouble: [
    ["A server shows as failed", "Run its command yourself in a terminal (for example `npx -y @cyanheads/pubmed-mcp-server@latest`) to see the error. Most failures are a missing Node.js or uv."],
    ["The first connection times out", "`npx` and `uvx` download the server the first time. Run the command once in a terminal, then try again. In OpenCode you can also raise `timeout` (in milliseconds) on the server."],
    ["The agent doesn't use the server", "Name it in the prompt (\"use the pubmed MCP tools\"). Local models are more reliable when you name the tool."],
    ["Pi says a project server is blocked", "Start Pi interactively in the workspace and approve the server when asked. Changing a server's command asks again."],
    ["Answers get slow or the model loses track", "Too many tools or very long tool results fill the context. Turn off servers you aren't using, and ask for results to be saved to files instead of printed."]
  ],
  refs: [
    ["OpenCode MCP servers", "https://opencode.ai/docs/mcp-servers/"],
    ["pi-mcp-adapter", "https://github.com/nicobailon/pi-mcp-adapter"],
    ["PubMed MCP server", "https://github.com/cyanheads/pubmed-mcp-server"],
    ["MarkItDown (includes markitdown-mcp)", "https://github.com/microsoft/markitdown"],
    ["Model Context Protocol", "https://modelcontextprotocol.io"],
    ["Skills & MCP Library", "../../library.html"]
  ],
  next: ["literature-review", "sensitive-data"]
};
