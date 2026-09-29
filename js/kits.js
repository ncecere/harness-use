/* =========================================================
   KIT CATALOG — the one place to add or list kits.
   The landing page builds itself from this list, and each kit
   page reads its own entry for the cover.

   shelf:  which shelf the kit sits on (see SHELVES)
   icon:   line icon name in js/icons.js
   steps:  number of steps in kits/<slug>/kit.js
   ready:  false shows "Printing soon" until kits/<slug>/ exists
   ========================================================= */

window.SITE = {
  title: "Harness Kits",
  tagline: "Field guides for setting up AI workspaces with NaviGator AI.",
  issue: "Field guide · Fall 2026",
  toolkitUrl: "https://api.ai.it.ufl.edu/ui",
  modelsUrl: "https://docs.ai.it.ufl.edu/docs/navigator_models/",
  docsUrl: "https://docs.ai.it.ufl.edu/",
  aiUrl: "https://it.ufl.edu/ai/",
  helpUrl: "https://ufl.teamdynamix.com/TDClient/33/IT-Portal/Requests/ServiceDet?ID=413"
};

window.SHELVES = [
  { id: "start", n: "0", title: "Start here", blurb: "Get your key, and set up a workspace for sensitive data if you have any." },
  { id: "research", n: "1", title: "Research", blurb: "Agents that search scholarly sources, pull data from PDFs, and check their own claims." },
  { id: "coding", n: "2", title: "Coding", blurb: "Coding agents in your terminal or on your desktop, with git as the undo button." },
  { id: "office", n: "3", title: "Office work", blurb: "Everyday writing, email, documents, and meetings, with the right tool for your data." }
];

window.KITS = [
  {
    slug: "navigator-key",
    code: "KIT 00",
    shelf: "start",
    title: "Your NaviGator Key",
    tagline: "The key that connects every other kit to UF's AI models.",
    level: "Start here",
    minutes: 10,
    steps: 6,
    icon: "key",
    tools: ["NaviGator AI Toolkit"],
    ready: true
  },
  {
    slug: "sensitive-data",
    code: "KIT 01",
    shelf: "start",
    title: "A Sensitive-Data Workspace",
    tagline: "Local models only, no web access, and original files the agent can't change.",
    level: "Start here",
    minutes: 25,
    steps: 8,
    icon: "lock",
    tools: ["OpenCode", "OpenCode Desktop", "Pi"],
    ready: true
  },
  {
    slug: "opencode-research",
    code: "KIT 10",
    shelf: "research",
    title: "OpenCode for Research",
    tagline: "A research agent, in the terminal or the desktop app, with scholarly skills, citation checks, and an audit step.",
    level: "Intermediate",
    minutes: 45,
    steps: 8,
    icon: "research",
    tools: ["OpenCode", "OpenCode Desktop", "Research skills"],
    ready: true
  },
  {
    slug: "pi-research",
    code: "KIT 11",
    shelf: "research",
    title: "Pi for Research",
    tagline: "A small, extensible agent you shape into your own research assistant.",
    level: "Intermediate",
    minutes: 40,
    steps: 8,
    icon: "pi",
    tools: ["Pi", "Research skills", "Web access"],
    ready: true
  },
  {
    slug: "connect-mcp",
    code: "KIT 12",
    shelf: "research",
    title: "Connect MCP Servers",
    tagline: "Give your agent new tools, like a PubMed search or a local file converter.",
    level: "Intermediate",
    minutes: 25,
    steps: 7,
    icon: "plug",
    tools: ["OpenCode", "OpenCode Desktop", "Pi", "MCP"],
    ready: true
  },
  {
    slug: "literature-review",
    code: "KIT 13",
    shelf: "research",
    title: "Literature and Systematic Reviews",
    tagline: "Logged searches, a first-pass screen you check, PRISMA counts, and verified citations.",
    level: "Intermediate",
    minutes: 90,
    steps: 8,
    icon: "review",
    tools: ["OpenCode", "Pi", "Research skills"],
    ready: true
  },
  {
    slug: "terminal-coding",
    code: "KIT 20",
    shelf: "coding",
    title: "Coding with an AI Agent",
    tagline: "OpenCode, OpenCode Desktop, or Pi as a pair programmer that plans, edits, and runs your tests.",
    level: "Intermediate",
    minutes: 30,
    steps: 7,
    icon: "terminal",
    tools: ["OpenCode", "OpenCode Desktop", "Pi", "git"],
    ready: true
  },
  {
    slug: "office-work",
    code: "KIT 30",
    shelf: "office",
    title: "AI for Office Work",
    tagline: "Copilot, NaviGator Chat, and Notebook, matched to the data you work with.",
    level: "Beginner",
    minutes: 20,
    steps: 7,
    icon: "office",
    tools: ["Microsoft Copilot", "NaviGator Chat", "NaviGator Notebook"],
    ready: true
  },
  {
    slug: "data-notebooks",
    code: "KIT 40",
    shelf: "research",
    title: "Data Analysis in Jupyter",
    tagline: "Code survey responses, search text by meaning, and transcribe interviews from Python.",
    level: "Intermediate",
    minutes: 45,
    steps: 7,
    icon: "notebook",
    tools: ["Jupyter", "Python", "Local models"],
    ready: true
  }
];
