/* KIT 11 — Pi for Research
   Sources: Pi docs (quickstart, models, configuration, skills, packages, security, windows, cli),
   docs.ai.it.ufl.edu/docs/navigator_toolkit/integrations/pi, pi-web-access README. */
window.KIT = {
  slug: "pi-research",
  summary: "Pi is a small, extensible AI agent for the terminal. It starts minimal on purpose: you add the skills, packages, and extensions your research needs, or ask Pi to build them. This kit sets it up with NaviGator, research skills, and web access.",
  os: true,
  parts: [
    "Your NaviGator key from [Kit 00](../navigator-key/)",
    "macOS, Linux, or Windows. On Windows, install Git for Windows or use WSL.",
    "Git and Python 3.11 or later",
    "Node.js 22.19 or later, if you install Pi with npm"
  ],
  outcome: [
    "Pi connected to NaviGator models",
    "A research workspace with house rules and research skills",
    "Web search and page fetching you can switch on when you need them",
    "A clear picture of what Pi can do without asking"
  ],
  steps: [
    {
      id: "install",
      title: "Install Pi",
      minutes: 5,
      blocks: [
        { os: {
          unix: [
            { code: `curl -fsSL https://pi.dev/install.sh | sh` },
            "Or install with npm (Node.js 22.19 or later):",
            { code: `npm install -g --ignore-scripts @earendil-works/pi-coding-agent` }
          ],
          win: [
            "Install [Git for Windows](https://git-scm.com/download/win) first. Pi uses Git Bash for shell commands. Then install Pi with npm (Node.js 22.19 or later):",
            { code: `npm install -g --ignore-scripts @earendil-works/pi-coding-agent`, label: "PowerShell" },
            "You can also run Pi inside WSL. Choose **Linux / WSL** above for those commands."
          ]
        } },
        "Confirm the install:",
        { code: `pi --version` }
      ]
    },
    {
      id: "connect",
      title: "Connect Pi to NaviGator",
      minutes: 4,
      blocks: [
        "Pi reads custom providers from `models.json` in its agent folder. Create the file, or download the starter.",
        { os: {
          unix: [{ code: `mkdir -p ~/.pi/agent
$EDITOR ~/.pi/agent/models.json` }],
          win: [{ code: `New-Item -ItemType Directory -Force "$env:USERPROFILE\\.pi\\agent"
notepad "$env:USERPROFILE\\.pi\\agent\\models.json"`, label: "PowerShell" }]
        } },
        { files: [{ href: "files/pi-models.json", name: "models.json" }] },
        { code: `{
  "providers": {
    "navigator": {
      "baseUrl": "https://api.ai.it.ufl.edu/v1",
      "api": "openai-completions",
      "apiKey": "$NAVIGATOR_TOOLKIT_API_KEY",
      "models": [
        { "id": "meta-muse-glimmer-30b" },
        { "id": "gpt-oss-120b" }
      ]
    }
  }
}`, file: "~/.pi/agent/models.json" },
        "`\"$NAVIGATOR_TOOLKIT_API_KEY\"` tells Pi to read the key from your environment each time it sends a request, so the key never sits in the file. Add any other model IDs your key includes.",
        "Start Pi, run `/model`, and choose a NaviGator model. Press `Ctrl+S` in the picker to save it as your default.",
        { code: `pi` },
        { note: "check", text: "`/model` shows the navigator models, and a short test message gets a reply." }
      ]
    },
    {
      id: "workspace",
      title: "Create a research workspace",
      minutes: 3,
      blocks: [
        "Pi groups sessions by folder and reads `AGENTS.md` from the folder you start it in. Give each project its own folder with git.",
        { code: `mkdir -p ~/research/my-project && cd ~/research/my-project
git init
mkdir -p sources outputs scripts` },
        "Add the same research house rules used in the OpenCode kit:",
        { files: [{ href: "files/research-AGENTS.md", name: "AGENTS.md" }] },
        { note: "tip", text: "Rules in `~/.pi/agent/AGENTS.md` apply in every folder. Keep personal preferences there and project standards in the project's `AGENTS.md`." }
      ]
    },
    {
      id: "skills",
      title: "Install research skills",
      minutes: 5,
      blocks: [
        "Pi supports the open Agent Skills format and discovers skills in `.agents/skills/`. Install the same reviewed set as the OpenCode kit:",
        { code: `git clone --depth 1 --branch v2.69.0 \\
  https://github.com/K-Dense-AI/scientific-agent-skills.git /tmp/sci-skills
mkdir -p .agents/skills
for s in paper-lookup citation-management database-lookup \\
         scientific-critical-thinking scientific-writing liteparse markitdown; do
  cp -R "/tmp/sci-skills/skills/$s" .agents/skills/
done` },
        "The next time you start Pi here, it asks whether to trust the project, because project skills can instruct the model to run code. Read the skills, then trust the project. Use `/trust` to save the decision.",
        { note: "caution", text: "Project trust controls what Pi loads at startup. It doesn't limit what the model can do once it's running. Review skills before you trust a folder." },
        { note: "tip", title: "About the citation request", text: "Each K-Dense skill ends with a section asking the agent to add the K-Dense paper to your manuscript's references. Whether to cite a tool is your call. Add a line to `AGENTS.md` such as \"Don't add citations for software or skills unless I ask.\"" }
      ]
    },
    {
      id: "web",
      title: "Add web search and page fetching",
      minutes: 3,
      blocks: [
        "Pi doesn't search the web on its own. The community package `pi-web-access` adds web search, page fetching, PDF extraction, and GitHub cloning.",
        { code: `pi install npm:pi-web-access` },
        "It works without API keys by using Exa's hosted search. You can add keys for other search providers, or point it at a self-hosted SearXNG server, in `~/.pi/agent/web-search.json`.",
        { note: "data", text: "Search queries and fetched URLs go to outside services, even when the model is local. Don't include restricted, confidential, or unpublished details in anything Pi searches for." }
      ]
    },
    {
      id: "safety",
      title: "Know what Pi does without asking",
      minutes: 2,
      blocks: [
        "Pi doesn't ask for approval before each tool call. It can read, change, and run files with the permissions of your account. Set up your workspace with that in mind:",
        { ul: [
          "Start Pi in the project folder, never in your home folder.",
          "Keep credentials and private files out of the workspace.",
          "Commit to git often, and review changes with `git diff`.",
          "For a read-only session, limit Pi's tools: `pi --tools read,grep,find,ls`."
        ] },
        { note: "tip", text: "Want approval prompts or other guardrails? Ask Pi to write an extension that adds them. Step 8 shows how Pi extends itself." }
      ]
    },
    {
      id: "investigate",
      title: "Run your first investigation",
      minutes: 15,
      blocks: [
        "Start Pi in the workspace. If you added skills while Pi was running, run `/reload`. Then name the skill and the evidence standard:",
        { prompt: `Use the paper-lookup skill to find peer-reviewed research on <your topic>.
Prefer primary sources, DOI-backed papers, and open-access PDFs.
Only use web search if scholarly databases fail.
Save the results to outputs/papers.md.` },
        { prompt: `Find the official source for <dataset or report>. Download it into
sources/, extract the relevant tables to CSV in outputs/, and record
the table name and page number for each one.` },
        { prompt: `Use scientific-critical-thinking to audit everything in outputs/.
List each claim that is not supported by primary evidence and what
would be needed to verify it.` }
      ]
    },
    {
      id: "extend",
      title: "Extend Pi for your work",
      minutes: 5,
      blocks: [
        "Pi is built to be reshaped. Ask it to create what you're missing: skills, prompt templates, or TypeScript extensions that add tools and commands.",
        { prompt: `Create a Pi extension in .pi/extensions/ that adds a tool for OCR on
PDFs and images using software already on this computer. Test it,
explain how it works, and tell me when to run /reload.` },
        { ul: [
          "Project extensions live in `.pi/extensions/`; personal ones in `~/.pi/agent/extensions/`.",
          "Run `/reload` to load new extensions, skills, and prompt templates.",
          "Install shared packages with `pi install npm:<package>` or `pi install git:<repo>`. Browse the [Pi package gallery](https://pi.dev/packages)."
        ] },
        { note: "caution", text: "Extensions run inside Pi with full access to your account. Review what Pi writes, and review third-party packages before installing them." }
      ]
    }
  ],
  trouble: [
    ["NaviGator models don't appear in `/model`", "Pi hides models it can't authenticate. Make sure `NAVIGATOR_TOOLKIT_API_KEY` is set in the terminal that started Pi, and that `models.json` is valid JSON. `/model` reloads the file."],
    ["Skills don't load", "Confirm each one is at `.agents/skills/<name>/SKILL.md`, that you trusted the project, and run `/reload`."],
    ["Windows: Pi can't find Bash", "Install Git for Windows, or set `shellPath` in `~/.pi/agent/settings.json`."],
    ["Web search returns nothing", "Run `pi list` to confirm `pi-web-access` is installed, then restart Pi."]
  ],
  refs: [
    ["Pi (pi.dev)", "https://pi.dev"],
    ["Pi with NaviGator (UF docs)", "https://docs.ai.it.ufl.edu/docs/navigator_toolkit/integrations/pi/"],
    ["Pi source and docs", "https://github.com/earendil-works/pi"],
    ["pi-web-access", "https://pi.dev/packages/pi-web-access"],
    ["Agent Skills specification", "https://agentskills.io/specification"],
    ["K-Dense Scientific Agent Skills", "https://github.com/K-Dense-AI/scientific-agent-skills"]
  ],
  next: ["connect-mcp", "literature-review", "opencode-research"]
};
