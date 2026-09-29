/* KIT 20 — Coding in the Terminal (OpenCode or Pi)
   Sources: opencode.ai/docs (install, agents, permissions, /init), Pi docs (quickstart, cli, security),
   docs.ai.it.ufl.edu integrations for OpenCode and Pi. */
window.KIT = {
  slug: "terminal-coding",
  summary: "A coding agent reads your code, proposes a plan, edits files, and runs your tests. Pick **OpenCode**, **OpenCode Desktop**, or **Pi** with the Tool switch; the steps change to match. Whichever you choose, git is your undo button.",
  os: true,
  variants: [{ id: "opencode", label: "OpenCode" }, { id: "desktop", label: "OpenCode Desktop" }, { id: "pi", label: "Pi" }],
  parts: [
    "Your NaviGator key from [Kit 00](../navigator-key/)",
    "A project in a git repository",
    "The project's usual build and test commands"
  ],
  outcome: [
    "A coding agent connected to NaviGator in every project",
    "Project rules the agent follows",
    "Guardrails that match how much you trust the agent",
    "A plan, change, test, review, commit loop"
  ],
  steps: [
    {
      id: "install",
      title: "Install the agent",
      minutes: 5,
      blocks: [
        "Already set it up in a research kit? Skip to step 3.",
        { variant: {
          opencode: [{ os: {
            mac: [{ code: `brew install anomalyco/tap/opencode` }],
            linux: [{ code: `curl -fsSL https://opencode.ai/install | bash` }],
            win: ["UF recommends WSL2 on Windows. You can also install with npm:", { code: `npm install -g opencode-ai`, label: "PowerShell" }]
          } }, { code: `opencode --version` }],
          desktop: [{ os: {
            mac: [{ code: `brew install --cask opencode-desktop` }, "Or download the `.dmg` from [opencode.ai/download](https://opencode.ai/download)."],
            linux: ["Download the `.deb`, `.rpm`, or AppImage from [opencode.ai/download](https://opencode.ai/download)."],
            win: ["Download and run the Windows installer from [opencode.ai/download](https://opencode.ai/download). It needs the Microsoft Edge WebView2 Runtime."]
          } }],
          pi: [{ os: {
            unix: [{ code: `curl -fsSL https://pi.dev/install.sh | sh` }],
            win: ["Install [Git for Windows](https://git-scm.com/download/win), then:", { code: `npm install -g --ignore-scripts @earendil-works/pi-coding-agent`, label: "PowerShell" }]
          } }, { code: `pi --version` }]
        } }
      ]
    },
    {
      id: "connect",
      title: "Connect it to NaviGator for every project",
      minutes: 4,
      blocks: [
        { variant: {
          opencode: [
            "Put the provider in your global config so every project can use it. Download the starter, or copy it below.",
            { files: [{ href: "files/opencode-coding.json", name: "opencode.json" }] },
            { os: {
              unix: [{ code: `mkdir -p ~/.config/opencode
$EDITOR ~/.config/opencode/opencode.json` }],
              win: [{ code: `mkdir -p ~/.config/opencode
$EDITOR ~/.config/opencode/opencode.json`, label: "WSL" }]
            } },
            { code: `{
  "$schema": "https://opencode.ai/config.json",
  "enabled_providers": ["navigator"],
  "model": "navigator/gpt-oss-120b",
  "small_model": "navigator/gpt-oss-120b",
  "provider": {
    "navigator": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "NaviGator AI Toolkit",
      "options": {
        "baseURL": "https://api.ai.it.ufl.edu/v1",
        "apiKey": "{env:NAVIGATOR_TOOLKIT_API_KEY}"
      },
      "models": {
        "gpt-oss-120b": { "name": "GPT-OSS 120B (local)" },
        "meta-muse-glimmer-30b": { "name": "Meta Muse Glimmer 30B (local)" }
      }
    }
  },
  "permission": {
    "edit": "allow",
    "bash": {
      "*": "ask",
      "git status*": "allow",
      "git diff*": "allow",
      "git log*": "allow",
      "git push*": "deny"
    },
    "webfetch": "ask",
    "websearch": "ask"
  }
}`, file: "~/.config/opencode/opencode.json" }
          ],
          desktop: [
            "OpenCode Desktop reads the same global config as the terminal version, but apps opened from the Dock or Start menu can't see `NAVIGATOR_TOOLKIT_API_KEY`. Put the key in a file only you can read:",
            { os: {
              mac: [{ code: `mkdir -p ~/.config/navigator && chmod 700 ~/.config/navigator
security find-generic-password -a "$USER" -s navigator-toolkit -w > ~/.config/navigator/key
chmod 600 ~/.config/navigator/key` }],
              linux: ["If you followed Kit 00 on Linux, the key is already in `~/.config/navigator/key`."],
              win: [{ code: `New-Item -ItemType Directory -Force "$env:USERPROFILE\\.config\\navigator" | Out-Null
Set-Content -NoNewline -Path "$env:USERPROFILE\\.config\\navigator\\key" -Value $env:NAVIGATOR_TOOLKIT_API_KEY`, label: "PowerShell" }]
            } },
            "Save the desktop starter as `~/.config/opencode/opencode.json` (on Windows, `%USERPROFILE%\\.config\\opencode\\opencode.json`). It matches the OpenCode config except that `apiKey` is `{file:~/.config/navigator/key}`. Then fully quit and reopen the app.",
            { files: [{ href: "files/opencode-coding-desktop.json", name: "opencode.json" }] }
          ],
          pi: [
            "Add NaviGator to Pi's `models.json`. It applies in every folder.",
            { files: [{ href: "files/pi-models.json", name: "models.json" }] },
            { code: `{
  "providers": {
    "navigator": {
      "baseUrl": "https://api.ai.it.ufl.edu/v1",
      "api": "openai-completions",
      "apiKey": "$NAVIGATOR_TOOLKIT_API_KEY",
      "models": [
        { "id": "gpt-oss-120b" },
        { "id": "meta-muse-glimmer-30b" }
      ]
    }
  }
}`, file: "~/.pi/agent/models.json" },
            "Start Pi, run `/model`, pick a NaviGator model, and press `Ctrl+S` to make it the default."
          ]
        } },
        { note: "data", title: "Local or cloud models", text: "Local models run in UF datacenters and are approved for all UF data classes, including code that touches sensitive data. Cloud coding models, such as the GPT Codex and Claude families, are approved for open data only and need a [Toolkit team](https://docs.ai.it.ufl.edu/docs/navigator_toolkit/getting_started/request-new-team)." }
      ]
    },
    {
      id: "repo",
      title: "Start from a clean branch",
      minutes: 2,
      blocks: [
        "Commit or stash your work first, then give the agent its own branch. If a change goes wrong, you can throw it away.",
        { code: `cd path/to/your-project
git status
git switch -c ai/short-task-name` },
        { ul: [
          "`git diff` shows exactly what the agent changed.",
          "`git restore .` discards uncommitted changes.",
          "`git switch main` leaves the experiment on its own branch."
        ] }
      ]
    },
    {
      id: "rules",
      title: "Give the project its rules",
      minutes: 4,
      blocks: [
        "An `AGENTS.md` at the project root tells the agent how to build, test, and behave in this codebase.",
        { variant: {
          opencode: ["Start OpenCode in the project and run `/init`. It reads the project and writes an `AGENTS.md`. Review it and fill in anything it missed.", { code: `opencode` }],
          desktop: ["Open the project folder in OpenCode Desktop and start a session. Run `/init`, or ask it to write the file:", { prompt: `Read this repository and write an AGENTS.md with the install, test, and
lint commands, the code style it uses, and folders I should not edit.
Keep it short.` }],
          pi: ["Start Pi in the project and ask it to write one:", { code: `pi` }, { prompt: `Read this repository and write an AGENTS.md with the install, test, and
lint commands, the code style it uses, and folders I should not edit.
Keep it short.` }]
        } },
        "Either way, make sure it covers these points. A starter is below.",
        { files: [{ href: "files/coding-AGENTS.md", name: "AGENTS.md" }] },
        { code: `## How to work
- Make small, focused changes. One task at a time.
- Before editing, explain the plan in a few lines.
- After editing, run the tests and report the result.
- Don't add new dependencies without asking.
- Don't commit, push, or change git history.

## Boundaries
- Never read or print .env files, keys, or credentials.`, file: "AGENTS.md" }
      ]
    },
    {
      id: "guardrails",
      title: "Set the guardrails",
      minutes: 3,
      blocks: [
        { variant: {
          opencode: [
            "The config from step 2 lets OpenCode edit files but asks before most shell commands, and it never lets the agent push. Adjust `permission` as you learn what you're comfortable with.",
            "OpenCode also has two built-in agents. In the terminal, press **Tab** to switch between them:",
            { ul: [
              "**Plan** asks before any edit or command. Use it to explore a codebase and agree on an approach.",
              "**Build** has the tools enabled. Switch to it once the plan looks right."
            ] }
          ],
          desktop: [
            "OpenCode Desktop uses the same `permission` settings from the config in step 2: it can edit files, asks before most shell commands, and never pushes.",
            "It also has the same two built-in agents. Choose **Plan** to explore a codebase and agree on an approach without changes, then switch to **Build** to make them."
          ],
          pi: [
            "Pi doesn't ask before tool calls. Your guardrails are the branch from step 3, your review, and how you start Pi:",
            { ul: [
              "Plan without edits: `pi --tools read,grep,find,ls`, then restart Pi normally to make the change.",
              "Start Pi in the project folder only, never in your home folder.",
              "Keep keys and `.env` files out of the repository."
            ] },
            { note: "tip", text: "Want approval prompts? Ask Pi to write an extension that asks before running shell commands. Kit 11, step 8 shows how." }
          ]
        } }
      ]
    },
    {
      id: "loop",
      title: "Work in a tight loop",
      minutes: 8,
      blocks: [
        "Agents do best with small, checkable tasks. Plan first, then build one piece at a time.",
        { prompt: `Read the code related to <feature or bug>. Explain how it works today
and propose a plan in 3 to 5 steps. Don't change anything yet.` },
        { prompt: `Do step 1 of the plan only. Then run the tests and show me the result.` },
        { prompt: `The test <name> fails with <error>. Find the cause before changing
anything, then fix it and run the tests again.` },
        { ol: [
          "Plan: ask for the approach before any edit.",
          "Change: one step at a time.",
          "Test: have the agent run the tests after each step.",
          "Review: read `git diff` yourself.",
          "Commit: when it's right, commit it yourself."
        ] }
      ]
    },
    {
      id: "review",
      title: "Review and commit it yourself",
      minutes: 4,
      blocks: [
        "You're responsible for code you commit, whoever wrote it. Read every change before it goes in.",
        { code: `git diff
git add -p
git commit -m "Describe the change"` },
        "`git add -p` walks through each change so you accept them one piece at a time.",
        { note: "caution", title: "Coursework", text: "If this is for a class, follow your course's AI policy and say how you used AI when it's required." },
        { note: "check", text: "The change passes its tests, you've read the diff, and the commit is yours." }
      ]
    }
  ],
  trouble: [
    ["The agent keeps editing things I didn't ask for", "Tighten the task and point to specific files. Add the boundary to `AGENTS.md` so it applies every time."],
    ["It says tests pass, but they don't", "Run the tests yourself. Ask the agent to paste the exact command and output."],
    ["Changes went wrong", "`git restore .` discards uncommitted changes. If you committed on the branch, `git switch main` and delete the branch."],
    ["Responses are slow or cut off", "Long files fill the model's context. Point the agent at the specific functions or files it needs."]
  ],
  refs: [
    ["OpenCode agents (Plan and Build)", "https://opencode.ai/docs/agents/"],
    ["OpenCode downloads (terminal and desktop)", "https://opencode.ai/download"],
    ["OpenCode permissions", "https://opencode.ai/docs/permissions/"],
    ["OpenCode with NaviGator (UF docs)", "https://docs.ai.it.ufl.edu/docs/navigator_toolkit/integrations/opencode"],
    ["Pi with NaviGator (UF docs)", "https://docs.ai.it.ufl.edu/docs/navigator_toolkit/integrations/pi/"],
    ["Pi source and docs", "https://github.com/earendil-works/pi"],
    ["NaviGator models", "https://docs.ai.it.ufl.edu/docs/navigator_models/"]
  ],
  next: ["opencode-research", "pi-research"]
};
