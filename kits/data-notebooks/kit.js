/* KIT 40 — Data Analysis in Jupyter
   Sources: docs.ai.it.ufl.edu/docs/navigator_models (local models: meta-muse-glimmer-30b,
   nomic-embed-text-v1.5, whisper-large-v3), OpenAI Python SDK docs, uv docs, and the starter
   notebook executed end to end against the NaviGator dev endpoint, September 2026. */
window.KIT = {
  slug: "data-notebooks",
  summary: "Call NaviGator's models from Python in a Jupyter notebook: ask questions, code open-ended survey responses into categories, search text by meaning, and transcribe interviews. Everything here uses **local** models, and every cell was run against NaviGator before we published it.",
  os: true,
  parts: [
    "Your NaviGator key from [Kit 00](../navigator-key/)",
    "[uv](https://docs.astral.sh/uv/getting-started/installation/), a Python project manager (it installs Python for you)",
    "Some Python and pandas",
    "A CSV of text you want to analyze, or the sample data in the starter notebook"
  ],
  outcome: [
    "A Jupyter project connected to NaviGator",
    "Open-ended responses coded into a fixed set of categories, with reasons",
    "An agreement check between the model's codes and yours",
    "Search by meaning, and local interview transcription"
  ],
  steps: [
    {
      id: "project",
      title: "Create a notebook project",
      minutes: 5,
      blocks: [
        "Use one folder per project, with its own Python environment, so package versions are recorded and your analysis can be rerun.",
        { os: {
          unix: [{ code: `mkdir -p ~/research/survey-analysis && cd ~/research/survey-analysis
uv init --bare
uv add jupyterlab openai pandas numpy` }],
          win: [{ code: `New-Item -ItemType Directory -Force "$HOME\\research\\survey-analysis" | Out-Null
Set-Location "$HOME\\research\\survey-analysis"
uv init --bare
uv add jupyterlab openai pandas numpy`, label: "PowerShell" }]
        } },
        "`uv add` writes the packages and their versions to `pyproject.toml` and `uv.lock`. Keep both with your analysis."
      ]
    },
    {
      id: "start",
      title: "Start Jupyter with your key",
      minutes: 2,
      blocks: [
        "Start Jupyter from a terminal where `NAVIGATOR_TOOLKIT_API_KEY` is set (Kit 00). The notebook reads the key from the environment, so it never appears in a cell or in a file you might share.",
        { code: `uv run jupyter lab` },
        "Download the starter notebook into the project folder and open it in Jupyter:",
        { files: [{ href: "files/navigator-starter.ipynb", name: "navigator-starter.ipynb" }] },
        { note: "caution", title: "Started Jupyter another way?", text: "Jupyter opened from Anaconda Navigator, the Dock, or the Start menu may not see your terminal's environment variables. If `os.environ[\"NAVIGATOR_TOOLKIT_API_KEY\"]` fails, start Jupyter from a terminal instead, or read the key file from Kit 10: `open(os.path.expanduser(\"~/.config/navigator/key\")).read().strip()`." }
      ]
    },
    {
      id: "connect",
      title: "Connect and ask a question",
      minutes: 3,
      blocks: [
        "NaviGator uses the same request format as OpenAI, so the `openai` package works with a different base URL:",
        { code: `import os
from openai import OpenAI

client = OpenAI(
    base_url="https://api.ai.it.ufl.edu/v1",
    api_key=os.environ["NAVIGATOR_TOOLKIT_API_KEY"],
)

reply = client.chat.completions.create(
    model="meta-muse-glimmer-30b",
    messages=[{"role": "user", "content": "In one sentence, what is a p-value?"}],
    temperature=0,
)
print(reply.choices[0].message.content)
print(reply.usage)`, label: "Notebook cell" },
        { note: "check", text: "You get a one-sentence answer and a usage line. In our run, the answer used 66 input and 246 output tokens. The model spends some output tokens reasoning before it answers, so output counts run higher than the visible text." }
      ]
    },
    {
      id: "code",
      title: "Code open-ended responses",
      minutes: 10,
      blocks: [
        "Give the model a fixed list of codes, ask for JSON, and reject anything outside the list. Save the results so you don't pay for the same calls twice.",
        { code: `import json
import pandas as pd

CODES = ["transportation", "cost", "scheduling", "trust or communication", "positive", "other"]

def code_response(text):
    reply = client.chat.completions.create(
        model="meta-muse-glimmer-30b",
        temperature=0,
        messages=[
            {"role": "system", "content":
                "You code survey responses about health care access. "
                f"Choose exactly one code from this list: {', '.join(CODES)}. "
                'Reply with JSON only: {"code": "...", "reason": "..."}'},
            {"role": "user", "content": text},
        ],
    )
    raw = reply.choices[0].message.content
    try:
        out = json.loads(raw[raw.index("{"): raw.rindex("}") + 1])
    except ValueError:
        return {"code": "ERROR", "reason": raw[:200]}
    if out.get("code") not in CODES:
        out = {"code": "ERROR", "reason": f"unexpected code: {out.get('code')}"}
    return out

df = pd.read_csv("responses.csv")          # a column named "response"
coded = pd.concat([df, df["response"].apply(code_response).apply(pd.Series)], axis=1)
coded.to_csv("coded_responses.csv", index=False)`, label: "Notebook cell" },
        "On the starter notebook's 10 sample responses, all 10 codes were defensible, and the run took about 16 seconds. Two responses could reasonably take either of two codes: \"They never called me back to reschedule\" (it chose communication, not scheduling) and \"Parking costs twenty dollars\" (cost, not transportation). Write those decisions into your codebook.",
        { note: "data", text: "`meta-muse-glimmer-30b` is a local model, approved for sensitive and restricted data. Notebooks save cell outputs, including rows of your data, inside the `.ipynb` file. Before you share a notebook, clear its outputs: **Kernel › Restart Kernel and Clear Outputs of All Cells**." }
      ]
    },
    {
      id: "agree",
      title: "Check the codes against your own",
      minutes: 15,
      blocks: [
        "Treat the model as a second coder. Code a random sample yourself without looking at its answers, then compare.",
        { code: `sample = coded.sample(n=30, random_state=1)
sample[["response"]].to_csv("my_codes_to_fill.csv", index=False)
# Add a my_code column in a spreadsheet, save, then:
mine = pd.read_csv("my_codes_to_fill.csv")
check = sample.merge(mine, on="response")
print("agreement:", (check["code"] == check["my_code"]).mean())
check[check["code"] != check["my_code"]]`, label: "Notebook cell" },
        { ul: [
          "Read every disagreement. Most show where a code needs a clearer definition.",
          "For reporting, a chance-corrected statistic such as Cohen's kappa is more convincing than percent agreement.",
          "Record the model name, the date, and the exact prompt with your results. Model updates can change answers."
        ] }
      ]
    },
    {
      id: "search",
      title: "Search responses by meaning",
      minutes: 5,
      blocks: [
        "Embeddings turn each text into a list of numbers so that texts with similar meaning end up close together. That finds \"I couldn't get a ride\" when you search for transportation problems, even though it never uses the word.",
        { code: `import numpy as np

def embed(texts):
    data = client.embeddings.create(model="nomic-embed-text-v1.5", input=texts).data
    v = np.array([d.embedding for d in data])
    return v / np.linalg.norm(v, axis=1, keepdims=True)

vectors = embed(["search_document: " + t for t in coded["response"]])
query = embed(["search_query: problems with transportation to appointments"])[0]
coded.assign(similarity=vectors @ query).sort_values("similarity", ascending=False).head(5)`, label: "Notebook cell" },
        "`nomic-embed-text-v1.5` expects the `search_document:` and `search_query:` prefixes.",
        { note: "caution", text: "Test with a question whose answer you already know. Our first query, \"getting to the clinic is hard\", ranked \"the clinic closes at 5\" above the transportation responses with every local embedding model we tried. A specific query put the two transportation responses first with all of them." }
      ]
    },
    {
      id: "transcribe",
      title: "Transcribe interviews locally",
      minutes: 5,
      blocks: [
        "`whisper-large-v3` is a local speech-to-text model, approved for sensitive and restricted data. Put the audio file in the project folder:",
        { code: `with open("interview.wav", "rb") as audio:
    transcript = client.audio.transcriptions.create(model="whisper-large-v3", file=audio)
print(transcript.text)`, label: "Notebook cell" },
        "On a short test clip, the transcript matched the words exactly. It didn't keep the spoken \"Interviewer:\" and \"Participant:\" labels, though: Whisper doesn't identify speakers, so add speaker labels yourself.",
        { note: "data", text: "Check your IRB protocol before you process recordings, and keep transcripts with the same care as the audio." }
      ]
    }
  ],
  trouble: [
    ["`KeyError: 'NAVIGATOR_TOOLKIT_API_KEY'`", "Jupyter didn't inherit the key. Quit Jupyter and start it with `uv run jupyter lab` from a terminal where `echo $NAVIGATOR_TOOLKIT_API_KEY` prints something (don't share what it prints)."],
    ["`401` or `AuthenticationError`", "The key is wrong or expired. Personal keys last one year. Test it with the `curl` command in Kit 00."],
    ["`404` or \"model not found\"", "The model isn't on your key. Run `sorted(m.id for m in client.models.list())` and use a name from that list."],
    ["Many rows come back as `ERROR`", "The model added text around the JSON or invented a code. Make the code list shorter and clearer, and keep `temperature=0`."],
    ["Coding thousands of rows is slow", "Test on 50 rows first. Then run in batches and save after each batch, so a failure doesn't lose finished work."]
  ],
  refs: [
    ["NaviGator AI models", "https://docs.ai.it.ufl.edu/docs/navigator_models/"],
    ["uv installation", "https://docs.astral.sh/uv/getting-started/installation/"],
    ["OpenAI Python library", "https://github.com/openai/openai-python"],
    ["JupyterLab docs", "https://jupyterlab.readthedocs.io/"],
    ["Jupyter MCP server (let an agent drive a notebook)", "../../library.html#jupyter-mcp"]
  ],
  next: ["sensitive-data", "opencode-research"]
};
