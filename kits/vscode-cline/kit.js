/* KIT 21 — Coding in VS Code (Cline)
   Sources: docs.ai.it.ufl.edu/docs/navigator_toolkit/integrations/cline and .../Cursor,
   docs.cline.bot (OpenAI-compatible providers, rules). */
window.KIT = {
  slug: "vscode-cline",
  summary: "Cline is an open-source coding agent that runs inside VS Code. It reads your project, plans changes, edits files, and runs commands, and it shows each action for approval. This kit connects it to NaviGator.",
  os: false,
  parts: [
    "Your NaviGator key from [Kit 00](../navigator-key/)",
    "[Visual Studio Code](https://code.visualstudio.com/)",
    "A project folder, ideally in git"
  ],
  outcome: [
    "Cline in VS Code, connected to a NaviGator model",
    "Project rules Cline follows",
    "A habit of planning first and approving each action"
  ],
  steps: [
    {
      id: "open",
      title: "Open your project in VS Code",
      minutes: 2,
      blocks: [
        "Install [VS Code](https://code.visualstudio.com/) if you haven't, then choose **File › Open Folder** and open your project.",
        "If the project isn't in git yet, start tracking it so you can undo any change: open the Source Control view and select **Initialize Repository**, or run `git init` in the terminal."
      ]
    },
    {
      id: "install",
      title: "Install the Cline extension",
      minutes: 2,
      blocks: [
        { ol: [
          "Open the **Extensions** view (`Ctrl+Shift+X`, or `Cmd+Shift+X` on macOS).",
          "Search for **Cline**. The publisher is `saoudrizwan`.",
          "Select **Install**. The Cline icon appears in the activity bar."
        ] },
        "If the icon doesn't appear, restart VS Code."
      ]
    },
    {
      id: "connect",
      title: "Connect Cline to NaviGator",
      minutes: 3,
      blocks: [
        "Open Cline, select the gear icon, and set the API configuration:",
        { table: {
          head: ["Setting", "Value"],
          rows: [
            ["API Provider", "`LiteLLM`"],
            ["Base URL", "`https://api.ai.it.ufl.edu`"],
            ["API Key", "Your NaviGator Toolkit key"],
            ["Model ID", "A model from your key, such as `gpt-oss-120b`"]
          ]
        } },
        "Select **Done** to save.",
        { note: "tip", title: "Another option", text: "Cline's **OpenAI Compatible** provider also works. Use the base URL `https://api.ai.it.ufl.edu/v1` with the same key and model ID." },
        { note: "data", text: "Local models are approved for all UF data classes. Cloud models are approved for open data only and need a [Toolkit team](https://docs.ai.it.ufl.edu/docs/navigator_toolkit/getting_started/request-new-team). Check the [model list](https://docs.ai.it.ufl.edu/docs/navigator_models/) before you choose." }
      ]
    },
    {
      id: "rules",
      title: "Give the project its rules",
      minutes: 4,
      blocks: [
        "Cline reads project rules from a `.clinerules/` folder at the project root. It also reads `AGENTS.md`, so the same file can serve Cline and terminal agents.",
        "Create `.clinerules/project.md`, or start from the coding starter:",
        { files: [{ href: "files/coding-AGENTS.md", name: "AGENTS.md" }] },
        { code: `# Project rules
- Test command: npm test
- Make small changes. Explain the plan before editing.
- Run the tests after each change and report the result.
- Don't add dependencies without asking.
- Never read or print .env files or credentials.`, file: ".clinerules/project.md" },
        "Rules show up in Cline's **Rules** panel, where you can turn each one on or off."
      ]
    },
    {
      id: "plan-act",
      title: "Plan first, then act",
      minutes: 5,
      blocks: [
        "Cline has two modes. Switch between them at the bottom of the chat panel.",
        { ul: [
          "**Plan**: Cline reads the project and discusses an approach without changing anything.",
          "**Act**: Cline makes the changes and runs commands, asking for approval at each step."
        ] },
        { prompt: `Read the code for <feature or bug> and propose a plan in 3 to 5 steps.
Don't change anything yet.` },
        "When the plan looks right, switch to **Act** and ask for one step at a time.",
        { note: "caution", title: "Auto-approve", text: "Cline can auto-approve actions. Leave command execution on manual approval until you're comfortable with how it works in your project." }
      ]
    },
    {
      id: "review",
      title: "Review, then commit",
      minutes: 4,
      blocks: [
        "Cline saves checkpoints as it works, so you can compare or restore earlier states from the chat. Before you commit, read the full change in VS Code's **Source Control** view.",
        { ul: [
          "Open each changed file's diff and read it.",
          "Run the tests yourself.",
          "Stage and commit only what you've reviewed."
        ] },
        { note: "caution", title: "Coursework", text: "If this is for a class, follow your course's AI policy." },
        { note: "check", text: "Cline answers with your NaviGator model, and you've reviewed and committed a change it made." }
      ]
    }
  ],
  trouble: [
    ["\"Invalid API key\" or authentication errors", "Paste the key again with no spaces, and confirm it works using the test in Kit 00, step 4."],
    ["\"Model not found\"", "Use a model ID exactly as it appears in your key's model list. Cloud models need a Toolkit team."],
    ["Connection errors", "Check the base URL. For the LiteLLM provider use `https://api.ai.it.ufl.edu`; for OpenAI Compatible use `https://api.ai.it.ufl.edu/v1`."],
    ["Prefer Cursor?", "Cursor can also use Toolkit models. Enter your key and endpoint under **Settings › Models** and add a custom model. Some models require a Cursor Pro or Business plan. See the UF Cursor guide in the references."]
  ],
  refs: [
    ["Cline with NaviGator (UF docs)", "https://docs.ai.it.ufl.edu/docs/navigator_toolkit/integrations/cline"],
    ["Cursor with NaviGator (UF docs)", "https://docs.ai.it.ufl.edu/docs/navigator_toolkit/integrations/Cursor"],
    ["Cline docs", "https://docs.cline.bot/"],
    ["Cline rules", "https://docs.cline.bot/features/cline-rules"],
    ["NaviGator models", "https://docs.ai.it.ufl.edu/docs/navigator_models/"]
  ],
  next: ["terminal-coding", "navigator-key"]
};
