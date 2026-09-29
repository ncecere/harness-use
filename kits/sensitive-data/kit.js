/* KIT 01 — A Sensitive-Data Workspace
   Sources: docs.ai.it.ufl.edu/docs/navigator_models (local vs. cloud approvals),
   opencode.ai/docs (config: share, enabled_providers; permissions; cli env vars),
   Pi docs (cli --tools/--offline, security, sessions, settings telemetry),
   and test runs on the NaviGator dev endpoint, September 2026, with synthetic data. */
window.KIT = {
  slug: "sensitive-data",
  summary: "Set up an agent workspace for sensitive or restricted data. It uses only NaviGator's local models, has no web access, can't change your original files, and asks before it runs any command. Every setting on this page was tested with fake participant data. Pick **OpenCode**, **OpenCode Desktop**, or **Pi** with the Tool switch.",
  os: true,
  variants: [{ id: "opencode", label: "OpenCode" }, { id: "desktop", label: "OpenCode Desktop" }, { id: "pi", label: "Pi" }],
  parts: [
    "Your NaviGator key from [Kit 00](../navigator-key/)",
    "OpenCode, OpenCode Desktop, or Pi, installed as in [Kit 10](../opencode-research/) or [Kit 11](../pi-research/)",
    "Data you're already allowed to keep on this computer",
    "Python 3, for the analysis scripts the agent writes"
  ],
  outcome: [
    "A workspace that only talks to UF's local models",
    "Web search, page fetching, and network commands turned off",
    "Original data files the agent can't change",
    "A checklist for results and transcripts before anything leaves the workspace"
  ],
  steps: [
    {
      id: "check",
      title: "Check what this setup does and doesn't cover",
      minutes: 3,
      blocks: [
        "NaviGator's local models are approved for open, sensitive, and restricted data. That approval covers the model. It doesn't change where your data is allowed to live, or what your IRB protocol, data use agreement, or grant terms say.",
        { table: {
          head: ["This workspace handles", "You still need to handle"],
          rows: [
            ["Only local models can be selected", "Permission to keep the data on this computer"],
            ["No web search or page fetching", "Your IRB protocol, data use agreement, and grant terms"],
            ["The agent can't edit your original files", "Reading each command before you approve it"],
            ["Common network commands are blocked", "Checking results before you share them"],
            ["Sessions can't be shared from the agent", "Deleting transcripts when the project ends"]
          ]
        } },
        { note: "data", title: "If you're not sure", text: "Ask your unit's data steward or your IRB before you start. If your project must use a secure environment, such as UF Research Computing's ResVault, ask them before installing agent tools there." }
      ]
    },
    {
      id: "workspace",
      title: "Create the workspace and lock the data",
      minutes: 3,
      blocks: [
        "Keep the original files in `data/` and make them read-only. That's an operating-system lock, so it holds even if an agent setting is wrong.",
        { os: {
          unix: [{ code: `mkdir -p ~/research/sensitive-project && cd ~/research/sensitive-project
git init
mkdir -p data outputs scripts
cp /path/to/your/files/* data/
chmod -R a-w data` }],
          win: [{ code: `New-Item -ItemType Directory -Force "$HOME\\research\\sensitive-project\\data","$HOME\\research\\sensitive-project\\outputs","$HOME\\research\\sensitive-project\\scripts" | Out-Null
Set-Location "$HOME\\research\\sensitive-project"
git init
Copy-Item C:\\path\\to\\your\\files\\* data\\
Get-ChildItem data -Recurse -File | ForEach-Object { $_.IsReadOnly = $true }`, label: "PowerShell" }]
        } },
        "Keep the data and transcripts out of git, so they can't be committed or pushed by accident. Save this as `.gitignore` in the workspace:",
        { files: [{ href: "files/sensitive-gitignore.txt", name: ".gitignore" }] },
        { code: `# Keep the data and agent transcripts out of git.
data/
.pi-sessions/`, file: ".gitignore" }
      ]
    },
    {
      id: "connect",
      title: "Connect to local models only",
      minutes: 5,
      blocks: [
        { variant: {
          opencode: [
            "Save this as `opencode.json` in the workspace. It lists only local models, turns off web tools and session sharing, and protects `data/`.",
            { files: [{ href: "files/opencode-sensitive.json", name: "opencode.json" }] }
          ],
          desktop: [
            "OpenCode Desktop reads the key from a file (see [Kit 10, step 3](../opencode-research/#connect)). Save this as `opencode.json` in the workspace. It's the same as the terminal version except for the `apiKey` line.",
            { files: [{ href: "files/opencode-sensitive-desktop.json", name: "opencode.json" }] }
          ],
          pi: [
            "Pi reads models from `~/.pi/agent/models.json`. List only local models there. If you set up Pi in Kit 11, it's already this file:",
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
            "Both models are local. Don't add cloud models to this file while you use it for sensitive work."
          ]
        } },
        { variant: {
          opencode: [{ code: `{
  "$schema": "https://opencode.ai/config.json",
  "enabled_providers": ["navigator"],
  "model": "navigator/meta-muse-glimmer-30b",
  "small_model": "navigator/meta-muse-glimmer-30b",
  "share": "disabled",
  "instructions": ["AGENTS.md"],
  "provider": {
    "navigator": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "NaviGator AI Toolkit (local models only)",
      "options": {
        "baseURL": "https://api.ai.it.ufl.edu/v1",
        "apiKey": "{env:NAVIGATOR_TOOLKIT_API_KEY}"
      },
      "models": {
        "meta-muse-glimmer-30b": { "name": "Meta Muse Glimmer 30B (local)" },
        "gpt-oss-120b": { "name": "GPT-OSS 120B (local)" }
      }
    }
  },
  "permission": {
    "webfetch": "deny",
    "websearch": "deny",
    "external_directory": "deny",
    "edit": { "*": "allow", "data/*": "deny" },
    "bash": {
      "*": "ask",
      "curl *": "deny", "wget *": "deny",
      "ssh *": "deny", "scp *": "deny", "rsync *": "deny",
      "git push*": "deny"
    }
  }
}`, file: "opencode.json" }],
          desktop: []
        } },
        { variant: {
          opencode: [{ table: { head: ["Setting", "What it does"], rows: [
            ["`enabled_providers`, `models`", "Only NaviGator, and only its local models, can be selected."],
            ["`share: \"disabled\"`", "Turns off `/share`, which uploads a session to opencode.ai."],
            ["`webfetch`, `websearch`: `deny`", "Removes the web tools. The model doesn't see them at all."],
            ["`external_directory`: `deny`", "Blocks reading or writing files outside the workspace."],
            ["`edit`", "Allows edits anywhere in the workspace except `data/`."],
            ["`bash`", "Asks before every command, and blocks the common ones that reach the network or push code."]
          ] } }],
          desktop: [{ table: { head: ["Setting", "What it does"], rows: [
            ["`enabled_providers`, `models`", "Only NaviGator, and only its local models, can be selected."],
            ["`share: \"disabled\"`", "Turns off sharing a session to opencode.ai."],
            ["`webfetch`, `websearch`: `deny`", "Removes the web tools. The model doesn't see them at all."],
            ["`external_directory`: `deny`", "Blocks reading or writing files outside the workspace."],
            ["`edit`", "Allows edits anywhere in the workspace except `data/`."],
            ["`bash`", "Asks before every command, and blocks the common ones that reach the network or push code."]
          ] } }]
        } }
      ]
    },
    {
      id: "rules",
      title: "Write the house rules",
      minutes: 3,
      blocks: [
        "`AGENTS.md` tells the agent how to treat the data: aggregates only, small counts suppressed, and every number computed by a saved script. Both OpenCode and Pi read it at the start of each session.",
        { files: [{ href: "files/sensitive-AGENTS.md", name: "AGENTS.md" }] },
        { code: `# Sensitive-data workspace

This workspace holds sensitive or restricted data. These rules come first.

## Where data may go
- Use only the local NaviGator models configured for this workspace.
- Never contact outside services: no web search, page fetches, package
  indexes, scholarly APIs, or cloud storage. If a task needs one, stop
  and ask.
- Never paste raw records, names, IDs, or quotes into a command that
  leaves this computer.

## The data folder
- Files in data/ are read-only originals. Never edit, move, or delete them.
- Write derived files to outputs/ and code to scripts/.
- Do analysis with scripts saved in scripts/, so every number can be
  rerun and checked. Don't compute results in your head.

## What goes in outputs
- Report aggregates, not individual records.
- Suppress any group with fewer than 5 people and say that you did.
- Leave out names, IDs, dates of birth, addresses, and other direct
  identifiers, even in examples.
- Paraphrase quotes unless I ask for exact wording.

## Before you finish
- List every file you created and every command you ran.`, file: "AGENTS.md" },
        "Change the threshold of 5 to whatever your protocol or data agreement requires."
      ]
    },
    {
      id: "start",
      title: "Start the agent without web tools",
      minutes: 2,
      blocks: [
        { variant: {
          opencode: [
            "Don't install web or scholarly skills in this workspace. Local-only skills such as `liteparse`, `markitdown`, `exploratory-data-analysis`, and `statistical-analysis` are fine. The [library](../../library.html) marks which skills stay on your computer.",
            { code: `cd ~/research/sensitive-project
opencode` }
          ],
          desktop: [
            "Don't install web or scholarly skills in this workspace. Local-only skills are fine; the [library](../../library.html) marks which ones stay on your computer.",
            "Open the workspace folder in OpenCode Desktop and start a session. Check that the model picker shows only the two local models."
          ],
          pi: [
            "Pi doesn't ask before tool calls, so choose its tools when you start it. This command gives it no shell, turns off automatic network activity other than the model, and keeps transcripts inside the workspace:",
            { code: `cd ~/research/sensitive-project
PI_TELEMETRY=0 pi --offline --tools read,grep,find,ls \\
  --session-dir .pi-sessions --model navigator/meta-muse-glimmer-30b` },
            { ul: [
              "`--tools read,grep,find,ls` lets Pi read and search, but not run commands or write files. Add `write` when you want it to save a report, and keep `data/` read-only.",
              "Pi's `read` can open any file your account can, not just files in the workspace. Start it from the workspace and ask about files there.",
              "`--offline` turns off Pi's automatic network activity, such as model catalog refreshes. Model requests still go to NaviGator. `PI_TELEMETRY=0` turns off Pi's anonymous install reports.",
              "Don't install `pi-web-access` or MCP servers that reach the web for this workspace."
            ] }
          ]
        } }
      ]
    },
    {
      id: "test",
      title: "Test the guardrails",
      minutes: 3,
      blocks: [
        "Before you use real data, check that the limits hold. Ask:",
        { prompt: `Tool test. Try each of these and report exactly what happened:
(1) fetch https://example.com, (2) search the web for "UF data classification",
(3) run the shell command: curl -sI https://example.com,
(4) append the line TEST to a file in data/, (5) read the file /etc/hosts.` },
        { variant: {
          opencode: [{ note: "check", text: "No web tool is available, `curl` is blocked by a rule, the edit in `data/` is blocked by a rule, and reading `/etc/hosts` is blocked. That's what our test run showed." }],
          desktop: [{ note: "check", text: "No web tool is available, `curl` is blocked by a rule, the edit in `data/` is blocked by a rule, and reading `/etc/hosts` is blocked." }],
          pi: [{ note: "check", text: "Pi reports that it has no shell or web tool and lists only `read`, `grep`, `find`, and `ls`. The edit fails because there's no edit tool. Pi can still read `/etc/hosts`, because Pi has no limit on which paths it reads." }]
        } }
      ]
    },
    {
      id: "work",
      title: "Analyze with scripts you can check",
      minutes: 10,
      blocks: [
        "Ask for results that come from a saved script. The script is your audit trail: you can read it, rerun it, and hand it to a colleague.",
        { prompt: `Summarize data/interviews.csv: how many participants mention each
theme, overall and by county. Write a short report to
outputs/theme-summary.md that follows the workspace rules.` },
        "In our test with 40 fake participants, the agent wrote `scripts/analyze_themes.py`, ran it, and produced a report with the correct counts. It suppressed every county cell under 5 and left out all names, IDs, and quotes. It took 39 seconds on `meta-muse-glimmer-30b`.",
        { variant: {
          opencode: [
            { h: "Read every command before you approve it" },
            "OpenCode asks before each command. The blocked list only catches the obvious ones. A short Python or R command can reach the internet too, so read what you approve.",
            { ul: [
              "Approve: running a script in `scripts/`, listing files, checking a Python version.",
              "Stop and ask why: anything with a URL, `pip install`, `npm`, `git remote`, or copying files out of the workspace."
            ] }
          ],
          desktop: [
            { h: "Read every command before you approve it" },
            "OpenCode Desktop asks before each command. The blocked list only catches the obvious ones. A short Python or R command can reach the internet too, so read what you approve."
          ],
          pi: [
            "With no shell, Pi can't run the script itself. Ask it to write the script (add `write` to `--tools`), then run it yourself and ask Pi to read the output:",
            { code: `python3 scripts/analyze_themes.py` }
          ]
        } },
        { note: "caution", text: "Check the numbers yourself the first time. Models make arithmetic and counting mistakes, which is why the rules ask for a script instead of an answer from memory." }
      ]
    },
    {
      id: "finish",
      title: "Check results and clear transcripts",
      minutes: 5,
      blocks: [
        "Transcripts hold everything the agent read, including rows from your data. In our test, fake participant names from the CSV appeared in OpenCode's session database.",
        { ol: [
          "Read each file in `outputs/` for names, IDs, dates, small counts, and quotes before it leaves the workspace.",
          "Don't use `/share`, and don't paste transcripts into tickets, email, or chat.",
          "Delete the sessions when the project ends, or sooner if your protocol requires it."
        ] },
        { variant: {
          opencode: [{ code: `opencode session list
opencode session delete <session-id>` }, "OpenCode keeps sessions in `~/.local/share/opencode/` on macOS and Linux, and in `%USERPROFILE%\\.local\\share\\opencode\\` on Windows."],
          desktop: [{ code: `opencode session list
opencode session delete <session-id>` }, "OpenCode Desktop uses the same session store as the terminal version: `~/.local/share/opencode/` on macOS and Linux. These commands need the terminal version installed; you can also delete sessions in the app."],
          pi: [{ code: `rm -rf .pi-sessions` }, "Because you started Pi with `--session-dir .pi-sessions`, its transcripts are in the workspace, not in `~/.pi/agent/sessions/`."]
        } }
      ]
    }
  ],
  trouble: [
    ["A cloud model shows up in the model list", "Something else is adding providers. In OpenCode, check that `enabled_providers` is `[\"navigator\"]` and that only local models are listed. In Pi, check `~/.pi/agent/models.json` and remove cloud models."],
    ["The agent says a tool is blocked when you need it", "That's the setup working. If the task truly needs it (for example, a package install), do that step yourself, outside the agent, then continue."],
    ["The agent keeps retrying a blocked command", "Local models sometimes repeat a failed call. Tell it the command is blocked on purpose and to use a script in `scripts/` instead."],
    ["Pi can't save the report", "Start Pi with `write` in `--tools`. Keep `data/` read-only so `write` can't overwrite your originals."],
    ["\"Permission denied\" when you update the data yourself", "`data/` is read-only on purpose. Run `chmod -R u+w data`, make the change, then `chmod -R a-w data` again."]
  ],
  refs: [
    ["NaviGator AI models and approved data classes", "https://docs.ai.it.ufl.edu/docs/navigator_models/"],
    ["UF Data Classification Policy", "https://policy.ufl.edu/policy/data-classification-policy/"],
    ["OpenCode permissions", "https://opencode.ai/docs/permissions/"],
    ["OpenCode config (share, providers)", "https://opencode.ai/docs/config/"],
    ["Pi on GitHub", "https://github.com/badlogic/pi-mono"]
  ],
  next: ["opencode-research", "pi-research"]
};
