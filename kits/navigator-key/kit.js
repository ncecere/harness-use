/* KIT 00 — Your NaviGator Key
   Sources: docs.ai.it.ufl.edu (Toolkit quickstart, overview, FAQ, team access),
   it.ufl.edu/ai/navigator-toolkit, docs.ai.it.ufl.edu/docs/navigator_models */
window.KIT = {
  slug: "navigator-key",
  summary: "Every kit that uses an AI agent connects to **NaviGator AI Toolkit** with a personal API key. You'll create the key, store it where your tools can read it without putting it in a file, and confirm it works.",
  os: true,
  parts: [
    "A GatorLink account. Toolkit is open to all UF students, faculty, and staff.",
    "A terminal: Terminal on macOS, a shell on Linux, or PowerShell on Windows"
  ],
  outcome: [
    "A personal Toolkit key for the models you choose",
    "The key available to your tools as `NAVIGATOR_TOOLKIT_API_KEY`",
    "A test call that lists your models and gets a reply"
  ],
  steps: [
    {
      id: "sign-in",
      title: "Sign in to NaviGator AI Toolkit",
      minutes: 2,
      blocks: [
        "Open [NaviGator AI Toolkit](https://api.ai.it.ufl.edu/ui) and sign in with your GatorLink.",
        "The dashboard lists your keys, their spend, and the models each key can use."
      ]
    },
    {
      id: "create",
      title: "Create a personal key",
      minutes: 3,
      blocks: [
        { ol: [
          "Select **Create New Key**.",
          "For **Team**, choose `navigator-toolkit`. It's the default team for everyone at UF.",
          "Name the key after where you'll use it, such as `opencode-laptop`.",
          "Choose the models the key can use. You can pick more than one.",
          "Select **Create Key**, then **Copy API Key**."
        ] },
        { note: "caution", title: "The key is shown once", text: "Copy it before you close the window. You can't view it again. If you lose it, delete it and create a new one." },
        { note: "tip", text: "Create one key per tool or computer. If one is exposed, you can delete it without breaking the others." }
      ]
    },
    {
      id: "store",
      title: "Store the key outside your files",
      minutes: 3,
      blocks: [
        "The kits read your key from an environment variable named `NAVIGATOR_TOOLKIT_API_KEY`. These commands keep the key in your system's secure storage, so it never sits in a config file or your shell history.",
        { os: {
          mac: [
            "Save the key in your macOS Keychain. The command asks you to paste it.",
            { code: `security add-generic-password -a "$USER" -s navigator-toolkit -w` },
            "Then load it into every new terminal:",
            { code: `echo 'export NAVIGATOR_TOOLKIT_API_KEY="$(security find-generic-password -a "$USER" -s navigator-toolkit -w)"' >> ~/.zshrc
source ~/.zshrc` }
          ],
          linux: [
            "Save the key in a file only you can read. `read -rs` hides what you paste.",
            { code: `mkdir -p ~/.config/navigator && chmod 700 ~/.config/navigator
read -rs NAV_KEY && printf '%s' "$NAV_KEY" > ~/.config/navigator/key && unset NAV_KEY
chmod 600 ~/.config/navigator/key` },
            "Then load it into every new terminal. If you use zsh, change `~/.bashrc` to `~/.zshrc`.",
            { code: `echo 'export NAVIGATOR_TOOLKIT_API_KEY="$(cat ~/.config/navigator/key)"' >> ~/.bashrc
source ~/.bashrc` }
          ],
          win: [
            "In PowerShell, save the key as a user environment variable. `-AsSecureString` hides what you paste.",
            { code: `$key = Read-Host "Paste your NaviGator key" -AsSecureString
[Environment]::SetEnvironmentVariable("NAVIGATOR_TOOLKIT_API_KEY", [System.Net.NetworkCredential]::new("", $key).Password, "User")`, label: "PowerShell" },
            "Close PowerShell and open a new window so the variable loads."
          ]
        } },
        { note: "caution", text: "Treat the key like a password. Don't paste it into a chat, a prompt, a document, or a support ticket." }
      ]
    },
    {
      id: "test",
      title: "Test the key",
      minutes: 2,
      blocks: [
        "List the models your key can use:",
        { os: {
          unix: [{ code: `curl -s https://api.ai.it.ufl.edu/v1/models \\
  -H "Authorization: Bearer $NAVIGATOR_TOOLKIT_API_KEY" | grep -o '"id": *"[^"]*"'` }],
          win: [{ code: `(Invoke-RestMethod https://api.ai.it.ufl.edu/v1/models -Headers @{ Authorization = "Bearer $env:NAVIGATOR_TOOLKIT_API_KEY" }).data.id`, label: "PowerShell" }]
        } },
        "Then send a short message. If your key doesn't include `gpt-oss-120b`, use another model ID from the list.",
        { os: {
          unix: [{ code: `curl -s https://api.ai.it.ufl.edu/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $NAVIGATOR_TOOLKIT_API_KEY" \\
  -d '{"model": "gpt-oss-120b", "messages": [{"role": "user", "content": "Say hello to a Gator in one sentence."}]}'` }],
          win: [{ code: `$body = @{ model = "gpt-oss-120b"; messages = @(@{ role = "user"; content = "Say hello to a Gator in one sentence." }) } | ConvertTo-Json -Depth 4
(Invoke-RestMethod https://api.ai.it.ufl.edu/v1/chat/completions -Method Post -ContentType "application/json" -Headers @{ Authorization = "Bearer $env:NAVIGATOR_TOOLKIT_API_KEY" } -Body $body).choices[0].message.content`, label: "PowerShell" }]
        } },
        { note: "check", text: "The first command prints model IDs, and the second returns a short reply from the model." }
      ]
    },
    {
      id: "models",
      title: "Choose models for your data",
      minutes: 2,
      blocks: [
        "Every NaviGator model runs in one of two places, and that decides what data you can send it.",
        { table: {
          head: ["Where it runs", "Open", "Sensitive", "Restricted", "How you get it"],
          rows: [
            ["Local (HiPerGator)", "Yes", "Yes", "Yes", "Included with personal keys"],
            ["Cloud (Microsoft, Amazon, Google)", "Yes", "No", "No", "Through a Toolkit team with a UFIT billing ID"]
          ]
        } },
        "Check the [NaviGator model list](https://docs.ai.it.ufl.edu/docs/navigator_models/) for each model's location and approved data classes.",
        { note: "data", title: "Need cloud models?", text: "UF faculty and staff can [request a Toolkit team](https://docs.ai.it.ufl.edu/docs/navigator_toolkit/getting_started/request-new-team). A team needs a UFIT billing ID, a monthly budget, members, and the models to enable. Cloud usage is billed to the team. Student groups need departmental sponsorship." }
      ]
    },
    {
      id: "limits",
      title: "Know the limits",
      minutes: 1,
      blocks: [
        { ul: [
          "Each student, faculty member, and staff member gets a **$100 monthly credit** for local models. It resets at the start of each month.",
          "Personal keys are valid for **one year**.",
          "Select a key's **Key ID** in Toolkit to see its spend, rate limits, and models."
        ] },
        "If a key is exposed, delete it in Toolkit and create a new one right away. Then repeat step 3 with the new key.",
        { note: "check", text: "You know which models your key can use, where they run, and how to replace the key." }
      ]
    }
  ],
  trouble: [
    ["`401` or an authentication error", "The variable isn't set in this terminal. Open a new terminal and try again. On macOS or Linux, `echo ${NAVIGATOR_TOOLKIT_API_KEY:0:6}` should print the first characters of your key."],
    ["A model is missing from the list", "The key wasn't created with that model, or the model is a cloud model that needs a team. Create a new key with the model selected."],
    ["macOS asks for Keychain access", "Choose **Always Allow** so new terminals can read the key without asking."],
    ["Windows: the variable is empty", "Close every PowerShell and editor window, then open a new one. User environment variables load only in new processes."]
  ],
  refs: [
    ["NaviGator AI Toolkit", "https://api.ai.it.ufl.edu/ui"],
    ["Toolkit quickstart", "https://docs.ai.it.ufl.edu/docs/navigator_toolkit/getting_started/quickstart/"],
    ["NaviGator Toolkit overview", "https://it.ufl.edu/ai/navigator-toolkit/"],
    ["Available models and data classes", "https://docs.ai.it.ufl.edu/docs/navigator_models/"],
    ["Request a Toolkit team", "https://docs.ai.it.ufl.edu/docs/navigator_toolkit/getting_started/request-new-team"],
    ["Toolkit FAQ", "https://docs.ai.it.ufl.edu/docs/navigator_toolkit/FAQ"]
  ],
  next: ["opencode-research", "terminal-coding", "vscode-cline"]
};
