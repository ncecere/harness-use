/* =========================================================
   LIBRARY PAGE (library.html) — renders window.LIBRARY
   (js/library.js), grouped by task, with a live filter.
   Every entry has an anchor: library.html#<id>
   ========================================================= */
(() => {
  "use strict";
  const { CHECKED, TASKS, ENTRIES, DIRECTORIES, LEFT_OUT } = window.LIBRARY;
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  /* `code` spans stay literal */
  const inline = s => String(s ?? "").split(/(`[^`]+`)/).map(p =>
    p.length > 1 && p.startsWith("`") && p.endsWith("`") ? `<code>${esc(p.slice(1, -1))}</code>` : esc(p)).join("");
  const plain = s => String(s ?? "").replace(/`/g, "");
  const TOTAL = ENTRIES.length;
  const TYPE = { skill: "Skill", mcp: "MCP server" };
  const STATUS = { reviewed: "Reviewed", listed: "Listed, not reviewed" };
  const FLOW = {
    local: ["Stays on your computer", "Any data class, with a local model"],
    external: ["Sends requests outside UF", "Open data only"]
  };

  /* ---------- install snippets ---------- */
  let codeId = 0;
  const panel = (label, text) => {
    const id = `lib-code-${++codeId}`;
    return `<div class="code"><div class="code-bar"><span class="label" id="${id}-l">${label}</span><button type="button" class="copy" data-copy="${id}" aria-describedby="${id}-l">Copy</button></div><pre id="${id}" tabindex="0" aria-labelledby="${id}-l"><code>${esc(text)}</code></pre></div>`;
  };
  const repoName = r => r.split("/")[1];

  function skillInstall(e) {
    const url = `https://github.com/${e.repo}.git`;
    const folder = e.path ? e.path.split("/").pop() : e.id;
    const tmp = `/tmp/hk-${repoName(e.repo)}`;
    const cmd = e.path
      ? [`git clone --depth 1${e.ref ? ` --branch ${e.ref}` : ""} ${url} ${tmp}`,
         `mkdir -p .agents/skills`,
         `cp -R ${tmp}/${e.path} .agents/skills/`].join("\n")
      : [`git clone --depth 1 ${url} .agents/skills/${folder}`,
         `rm -rf .agents/skills/${folder}/.git`].join("\n");
    return `<p>Run this in your workspace folder${e.ref ? ` (pinned to <code>${esc(e.ref)}</code>)` : ""}:</p>
      ${panel("Terminal · macOS / Linux / WSL", cmd)}
      <p>Read <code>.agents/skills/${esc(folder)}/SKILL.md</code> before the first use. Then restart OpenCode, or run <code>/reload</code> in Pi.</p>`;
  }

  function mcpInstall(e) {
    const key = e.id.replace(/-mcp$/, "");
    const setup = e.setup ? `<p>${inline(e.setup)}</p>` : "";
    if (!e.run) return `${setup}<p>Details: <a href="https://github.com/${e.repo}#readme" rel="noopener">${esc(e.repo)} README</a>.</p>`;
    const envs = e.run.env || {};
    const envFor = fmt => Object.fromEntries(Object.entries(envs).map(([k, v]) => [k, v.startsWith("=") ? v.slice(1) : fmt(v)]));
    const hasEnv = Object.keys(envs).length > 0;
    let oc, pi;
    if (e.run.url) {
      oc = { type: "remote", url: e.run.url };
      pi = { url: e.run.url };
    } else {
      oc = { type: "local", command: e.run.command, ...(hasEnv && { environment: envFor(v => `{env:${v}}`) }) };
      pi = { command: e.run.command[0], args: e.run.command.slice(1), ...(hasEnv && { env: envFor(v => "$" + "{" + v + "}") }) };
    }
    const secrets = Object.values(envs).filter(v => !v.startsWith("="));
    return `${setup}
      <p><strong>OpenCode and OpenCode Desktop:</strong> add this to <code>opencode.json</code>, next to <code>provider</code>.</p>
      ${panel("<b>opencode.json</b> · mcp block", JSON.stringify({ mcp: { [key]: oc } }, null, 2))}
      <p><strong>Pi:</strong> run <code>pi install npm:pi-mcp-adapter</code> once, then save this as <code>.mcp.json</code> in the workspace.</p>
      ${panel("<b>.mcp.json</b>", JSON.stringify({ mcpServers: { [key]: pi } }, null, 2))}
      ${secrets.length ? `<p>Set ${secrets.map(v => `<code>${esc(v)}</code>`).join(" and ")} the same way you stored your NaviGator key, so the value never appears in the file.</p>` : ""}`;
  }

  /* ---------- entries ---------- */
  function item(e) {
    const [flowHead, flowRule] = FLOW[e.flow];
    const find = [e.name, e.summary, e.tags, e.repo, TYPE[e.type], e.needs].map(plain).join(" ").toLowerCase();
    return `
      <article class="lib-item" id="${e.id}" data-type="${e.type}" data-status="${e.status}" data-flow="${e.flow}" data-find="${esc(find)}" aria-labelledby="${e.id}-h">
        <header class="lib-head">
          <h3 id="${e.id}-h"><a href="#${e.id}">${esc(e.name)}</a></h3>
          <p class="lib-tags"><span class="tag tag-${e.type}">${TYPE[e.type]}</span><span class="tag tag-${e.status}">${STATUS[e.status]}</span></p>
        </header>
        <p class="lib-sum">${inline(e.summary)}</p>
        <dl class="lib-meta">
          <div class="lib-flow flow-${e.flow}"><dt>Data</dt><dd><b>${flowHead}</b> ${flowRule}</dd></div>
          <div><dt>Needs</dt><dd>${inline(e.needs)}</dd></div>
          ${e.only ? `<div><dt>Works with</dt><dd>${esc(e.only)}</dd></div>` : ""}
          <div><dt>Source</dt><dd><a href="https://github.com/${e.repo}${e.type === "skill" && e.path ? `/tree/${e.ref || "HEAD"}/${e.path}` : ""}" rel="noopener">${esc(e.repo)}</a> · ${esc(e.license)}</dd></div>
        </dl>
        ${e.note ? `<div class="lib-note" role="note"><b>Note</b> ${inline(e.note)}</div>` : ""}
        <details class="lib-install"><summary><span>How to add it</span></summary><div class="lib-install-body">${e.type === "skill" ? skillInstall(e) : mcpInstall(e)}</div></details>
      </article>`;
  }

  const groups = TASKS.map(t => ({ ...t, items: ENTRIES.filter(e => e.task === t.id) })).filter(g => g.items.length);
  const byName = (a, b) => (a.status !== b.status ? (a.status === "reviewed" ? -1 : 1) : a.name.localeCompare(b.name));

  $("#lib-list").innerHTML = groups.map((g, i) => `
    <section class="lib-group" id="task-${g.id}" aria-labelledby="task-${g.id}-h">
      <h2 class="lib-group-title" id="task-${g.id}-h"><span class="sec" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>${esc(g.title)}</h2>
      <div class="lib-items">${g.items.sort(byName).map(item).join("")}</div>
    </section>`).join("") + `<p class="lib-empty" id="lib-empty" hidden>Nothing matches. Try a shorter word or clear the filters.</p>`;

  $("#lib-jump").innerHTML = groups.map(g => `<li><a href="#task-${g.id}">${esc(g.title)}</a></li>`).join("");

  $("#lib-dirs").innerHTML = DIRECTORIES.map(d => `<li><a href="${d.url}" rel="noopener">${esc(d.name)}</a><span>${esc(d.text)}</span></li>`).join("");
  $("#lib-out").innerHTML = LEFT_OUT.map(d => `<li><b>${esc(d.name)}</b><span>${esc(d.why)}</span></li>`).join("");
  $("#lib-checked").textContent = new Date(CHECKED + "T12:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  $("#spec-skills").textContent = ENTRIES.filter(e => e.type === "skill").length;
  $("#spec-mcp").textContent = ENTRIES.filter(e => e.type === "mcp").length;
  $("#spec-reviewed").textContent = ENTRIES.filter(e => e.status === "reviewed").length;

  /* ---------- filter ---------- */
  const q = $("#lib-q"), count = $("#lib-count"), localOnly = $("#lib-local");
  const items = [...document.querySelectorAll(".lib-item")];
  const sections = [...document.querySelectorAll(".lib-group")];
  const state = { type: "all", status: "all" };
  let timer;

  function filter() {
    const words = q.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    for (const el of items) {
      const hit = words.every(w => el.dataset.find.includes(w))
        && (state.type === "all" || el.dataset.type === state.type)
        && (state.status === "all" || el.dataset.status === state.status)
        && (!localOnly.checked || el.dataset.flow === "local");
      el.hidden = !hit;
      if (hit) shown++;
    }
    for (const s of sections) s.hidden = !s.querySelector(".lib-item:not([hidden])");
    $("#lib-empty").hidden = shown > 0;
    const filtered = words.length || state.type !== "all" || state.status !== "all" || localOnly.checked;
    /* update the live count after typing pauses, so screen readers aren't flooded */
    clearTimeout(timer);
    timer = setTimeout(() => { count.textContent = filtered ? `${shown} of ${TOTAL} entries shown` : `${TOTAL} entries`; }, 350);
  }

  document.querySelectorAll("[data-filter]").forEach(group => {
    group.addEventListener("click", ev => {
      const b = ev.target.closest("button[data-value]");
      if (!b) return;
      state[group.dataset.filter] = b.dataset.value;
      group.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      filter();
    });
  });
  q.addEventListener("input", filter);
  q.addEventListener("keydown", e => { if (e.key === "Escape" && q.value) { q.value = ""; filter(); } });
  localOnly.addEventListener("change", filter);

  function clearFilters() {
    q.value = ""; localOnly.checked = false; state.type = state.status = "all";
    document.querySelectorAll("[data-filter] button").forEach(x => x.setAttribute("aria-pressed", String(x.dataset.value === "all")));
    filter();
  }
  /* a link to an entry hidden by the filter: clear the filters first */
  addEventListener("hashchange", () => {
    const el = document.getElementById(location.hash.slice(1));
    if (el && el.closest("[hidden]")) { clearFilters(); el.scrollIntoView(); }
  });

  /* copy buttons */
  document.addEventListener("click", async ev => {
    const t = ev.target.closest("[data-copy]");
    if (!t) return;
    const text = document.getElementById(t.dataset.copy).textContent;
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = Object.assign(document.createElement("textarea"), { value: text });
      document.body.append(ta); ta.select(); document.execCommand("copy"); ta.remove();
    }
    t.textContent = "Copied";
    setTimeout(() => { t.textContent = "Copy"; }, 1600);
  });

  count.textContent = `${TOTAL} entries`;
  /* deep link on load (content was rendered after the browser tried to scroll) */
  if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
})();
