#!/usr/bin/env node
/* =========================================================
   Re-check every entry in js/library.js against GitHub.

   node tools/check-library.mjs                 report only
   node tools/check-library.mjs --write-date    also set CHECKED to today
                                                (only when nothing fails)

   Uses GITHUB_TOKEN if set (60 requests/hour without it, 5,000 with it).
   Exit code 1 when an entry fails: repo missing or archived, skill path
   missing at its pinned ref, or no push in STALE_DAYS.
   Warnings (license differs, license not detected) don't fail the run.
   No dependencies; needs Node 18+ for fetch.
   ========================================================= */
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const STALE_DAYS = 365;
const FILE = fileURLToPath(new URL("../js/library.js", import.meta.url));
const src = readFileSync(FILE, "utf8");
const sandbox = { window: {} };
vm.runInNewContext(src, sandbox);
const { ENTRIES, CHECKED } = sandbox.window.LIBRARY;

const headers = { "Accept": "application/vnd.github+json", "User-Agent": "harness-kits-library-check" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const cache = new Map();
async function gh(path) {
  if (cache.has(path)) return cache.get(path);
  const res = await fetch(`https://api.github.com${path}`, { headers });
  const out = { status: res.status, body: res.ok ? await res.json() : null };
  if (res.status === 403 && res.headers.get("x-ratelimit-remaining") === "0") {
    throw new Error("GitHub rate limit reached. Set GITHUB_TOKEN and try again.");
  }
  cache.set(path, out);
  return out;
}

const norm = s => String(s || "").toLowerCase().replace(/[^a-z0-9.]/g, "");
const today = new Date();
const rows = [];
let failures = 0, warnings = 0;

for (const e of ENTRIES) {
  const problems = [], notes = [];
  const repo = await gh(`/repos/${e.repo}`);
  if (repo.status !== 200) {
    problems.push(`repo not found (HTTP ${repo.status})`);
  } else {
    const r = repo.body;
    if (r.archived) problems.push("repo archived");
    const days = Math.round((today - new Date(r.pushed_at)) / 86400000);
    if (days > STALE_DAYS) problems.push(`no push in ${days} days`);
    /* a skill can declare its own license in SKILL.md; that wins over the repo's */
    let declared = null;
    if (e.type === "skill") {
      const ref = e.ref || r.default_branch;
      const path = e.path ? `${e.path}/SKILL.md` : "SKILL.md";
      const file = await gh(`/repos/${e.repo}/contents/${path}?ref=${encodeURIComponent(ref)}`);
      if (file.status !== 200) problems.push(`${path} missing at ${ref}`);
      else {
        const text = Buffer.from(file.body.content, "base64").toString("utf8");
        const m = text.match(/^license:\s*(.+)$/m);
        if (m) declared = m[1].trim();
      }
    }
    const spdx = r.license?.spdx_id;
    if (declared) {
      if (!norm(declared).startsWith(norm(e.license).replace(/license$/, "")) && !norm(declared).includes(norm(e.license))) {
        notes.push(`SKILL.md declares "${declared}", listed as ${e.license}`);
      }
    } else if (!spdx || spdx === "NOASSERTION") notes.push(`GitHub can't detect the license (listed: ${e.license})`);
    else if (norm(spdx) !== norm(e.license)) notes.push(`license is ${spdx} on GitHub, listed as ${e.license}`);
    rows.push({ id: e.id, stars: r.stargazers_count, pushed: r.pushed_at.slice(0, 10), problems, notes });
  }
  if (repo.status !== 200) rows.push({ id: e.id, stars: "-", pushed: "-", problems, notes });
  failures += problems.length ? 1 : 0;
  warnings += notes.length ? 1 : 0;
}

const pad = (s, n) => String(s).padEnd(n);
console.log(`Library check: ${ENTRIES.length} entries, last checked ${CHECKED}\n`);
console.log(pad("entry", 34) + pad("stars", 8) + pad("pushed", 12) + "status");
for (const r of rows) {
  const status = r.problems.length ? `FAIL: ${r.problems.join("; ")}` : r.notes.length ? `note: ${r.notes.join("; ")}` : "ok";
  console.log(pad(r.id, 34) + pad(r.stars, 8) + pad(r.pushed, 12) + status);
}
console.log(`\n${failures} failing, ${warnings} with notes, ${ENTRIES.length - failures} passing`);

/* GitHub Actions: add a table to the job summary */
if (process.env.GITHUB_STEP_SUMMARY) {
  const md = [`## Library check`, ``, `${failures} failing, ${warnings} with notes, ${ENTRIES.length} entries.`, ``,
    `| Entry | Stars | Last push | Status |`, `|---|---|---|---|`,
    ...rows.map(r => `| ${r.id} | ${r.stars} | ${r.pushed} | ${r.problems.length ? "**" + r.problems.join("; ") + "**" : r.notes.join("; ") || "ok"} |`)];
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, md.join("\n") + "\n");
}

if (process.argv.includes("--write-date")) {
  if (failures) {
    console.log("Not updating CHECKED: fix or remove the failing entries first.");
  } else {
    const iso = today.toISOString().slice(0, 10);
    writeFileSync(FILE, src.replace(/CHECKED: "\d{4}-\d{2}-\d{2}"/, `CHECKED: "${iso}"`));
    console.log(`CHECKED set to ${iso}.`);
  }
}
process.exit(failures ? 1 : 0);
