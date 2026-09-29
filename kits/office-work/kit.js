/* KIT 30 — AI for Office Work
   Sources: it.ufl.edu/ai (Microsoft Copilot, NaviGator Chat, NaviGator Notebook, NaviGator Prompt),
   it.ufl.edu/log-into, citt.it.ufl.edu, docs.ai.it.ufl.edu/docs/navigator_models. */
window.KIT = {
  slug: "office-work",
  summary: "No terminal needed. UF offers several AI tools for everyday work: writing, email, documents, spreadsheets, and meetings. This kit sets each one up and shows which to use for the data in front of you.",
  os: false,
  parts: [
    "A GatorLink account",
    "A web browser",
    "Microsoft 365 apps, if you have a Microsoft 365 Copilot license"
  ],
  outcome: [
    "A clear rule for which tool fits which data",
    "Microsoft Copilot signed in with UF protection",
    "NaviGator Chat and NaviGator Notebook ready for your documents",
    "A place to keep prompts you reuse"
  ],
  steps: [
    {
      id: "match",
      title: "Match the tool to the data",
      minutes: 3,
      blocks: [
        "Check this table before you paste anything into an AI tool.",
        { table: {
          head: ["Tool", "Best for", "Open", "Sensitive or restricted"],
          rows: [
            ["NaviGator Chat, **local** models", "Documents and data that need to stay on UF systems", "Yes", "Yes"],
            ["NaviGator Chat, **cloud** models", "Drafting and analysis with the latest cloud models", "Yes", "No"],
            ["Microsoft Copilot", "Quick questions, drafting, web research", "Yes", "No"],
            ["Microsoft 365 Copilot", "Work inside Word, Excel, PowerPoint, Outlook, and Teams", "Yes", "No"],
            ["NaviGator Notebook", "Answers grounded in sources you upload", "Yes", "No"]
          ]
        } },
        { note: "data", text: "UF doesn't permit sensitive or restricted data in Microsoft Copilot or in cloud models. For that data, use a NaviGator Chat model tagged **local**. If you're unsure how your data is classified, ask your unit's data owner." }
      ]
    },
    {
      id: "copilot",
      title: "Sign in to Microsoft Copilot with GatorLink",
      minutes: 2,
      blocks: [
        { ol: [
          "Go to [copilot.microsoft.com](https://copilot.microsoft.com/).",
          "Sign in with your UF account (GatorLink).",
          "Look for the **Protected** badge. It means UF's agreement with Microsoft applies: your chats aren't used to train models."
        ] },
        "Copilot is free for UF students, faculty, and staff. It's good for quick questions, drafting, and research using web results.",
        { note: "caution", text: "Conversations aren't kept after your session. Copy anything you want to keep." }
      ]
    },
    {
      id: "m365",
      title: "Use Microsoft 365 Copilot in your apps",
      minutes: 3,
      blocks: [
        "Microsoft 365 Copilot is a paid add-on license. With it, Copilot appears inside Word, Excel, PowerPoint, Outlook, and Teams, and it can use the email, files, and meetings you already have access to. For pricing, see [UF Software Licensing](https://it.ufl.edu/software/software-listings/).",
        "Good first tasks:",
        { prompt: `Summarize this email thread. List the decisions made and the open
questions, with who owns each one.`, label: "Prompt · Outlook" },
        { prompt: `Draft a one-page summary of <file name> for a department chair.
Keep the key numbers and cite the section each one comes from.`, label: "Prompt · Word" },
        { prompt: `Recap this meeting: decisions, action items with owners, and
anything we said we'd follow up on.`, label: "Prompt · Teams" },
        { note: "caution", text: "Copilot's output isn't guaranteed to be accurate or complete. Check it before you use it for decisions, compliance, finance, legal, or academic work." }
      ]
    },
    {
      id: "chat",
      title: "Set up NaviGator Chat",
      minutes: 4,
      blocks: [
        { ol: [
          "Go to [chat.ai.it.ufl.edu](https://chat.ai.it.ufl.edu/) and sign in with GatorLink.",
          "Open the model menu. Each model is tagged **local** or **cloud**.",
          "For sensitive or restricted data, choose a **local** model.",
          "Upload a document and ask about it, or start a conversation."
        ] },
        "NaviGator Chat also supports voice: select the call button next to the message box. Only you can see your datasets and conversation history.",
        { prompt: `Using the attached report, list the three findings most relevant to
<audience>. Quote the sentence each one comes from.` }
      ]
    },
    {
      id: "notebook",
      title: "Set up NaviGator Notebook",
      minutes: 4,
      blocks: [
        "NaviGator Notebook is Google NotebookLM for UF. It answers questions from the sources you add, with citations back to the exact passage. See [NaviGator Notebook](https://it.ufl.edu/ai/navigator-notebook/) for access.",
        { ol: [
          "Create a notebook for one topic or project.",
          "Add sources: Google Docs, Slides, and Sheets; PDFs and text files; web pages; YouTube links; or audio files.",
          "Ask questions, or request a summary, timeline, FAQ, or study guide.",
          "Select a citation to jump to the passage it came from."
        ] },
        "It can also create an audio or video overview of your sources. It runs on Google's cloud, so use it for open data only.",
        { note: "tip", text: "Updated a Google Doc? Re-sync it in the notebook. Sources don't update automatically." }
      ]
    },
    {
      id: "prompts",
      title: "Save the prompts you reuse",
      minutes: 2,
      blocks: [
        "[NaviGator Prompt](https://prompt.navigator.ai.ufl.edu) helps you write, test, and share prompts. Save the ones that work, such as your meeting recap, email summary, or report outline, so your team can reuse them.",
        "A reusable prompt names the task, the audience, and the format:",
        { prompt: `You're helping <role> in <unit>. Summarize <material> for <audience>.
Use plain language. Give 3 to 5 bullet points, then one sentence on
what needs a decision. Say "not stated" instead of guessing.` }
      ]
    },
    {
      id: "habits",
      title: "Build good habits",
      minutes: 2,
      blocks: [
        { ul: [
          "**Check the data first.** Use the table in step 1 every time.",
          "**Verify before you send.** Check names, numbers, dates, and quotes against the original.",
          "**Ask for sources.** Prefer answers that point to the passage they came from.",
          "**Save what matters.** Copilot doesn't keep conversations after your session.",
          "**Be open about AI use** where your unit or course expects it."
        ] },
        { note: "check", text: "You can open each tool, and you know which one to use for the data you work with." }
      ]
    }
  ],
  trouble: [
    ["No Protected badge in Copilot", "You're signed in with a personal Microsoft account, or not signed in. Sign out and sign in with your UF account."],
    ["Copilot doesn't appear in Word or Outlook", "Microsoft 365 Copilot needs a paid license. See UF Software Licensing."],
    ["I can't tell which NaviGator Chat models are local", "Open the model menu and look for the local and cloud tags, or check the NaviGator model list."],
    ["A notebook answer seems wrong", "Select its citation and read the passage. If the source doesn't support it, tell the notebook and ask again."]
  ],
  refs: [
    ["NaviGator Assistant (for departments; request through UFIT)", "https://it.ufl.edu/ai/navigator-assistant/"],
    ["Microsoft Copilot at UF", "https://it.ufl.edu/ai/microsoft-copilot/"],
    ["NaviGator Chat", "https://it.ufl.edu/ai/navigator-chat/"],
    ["NaviGator Notebook", "https://it.ufl.edu/ai/navigator-notebook/"],
    ["NaviGator Prompt", "https://prompt.navigator.ai.ufl.edu"],
    ["NaviGator models and data classes", "https://docs.ai.it.ufl.edu/docs/navigator_models/"],
    ["UF Data Classification Policy", "https://policy.ufl.edu/policy/data-classification-policy/"],
    ["UF AI services", "https://it.ufl.edu/ai/"]
  ],
  next: ["navigator-key", "data-notebooks"]
};
