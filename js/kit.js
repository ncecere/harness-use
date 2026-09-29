/* =========================================================
   KIT PAGE — renders kits/<slug>/kit.js into a procedure.

   window.KIT = {
     slug, summary, parts: [...], outcome: [...],
     os: true,                               // show the OS switch
     variants: [{ id, label }],              // optional tool switch
     steps: [{ id, title, minutes, blocks }],
     trouble: [[problem, fix]], refs: [[label, url]], next: [slug]
   }

   Blocks (in order of use):
     "text"                        paragraph (inline: `code`, **bold**, [link](url))
     { h: "text" }                 subheading
     { ul: [...] } / { ol: [...] } lists
     { code, label, file }         code panel with a copy button
     { prompt }                    something to type to the agent
     { note: kind, title, text }   kind: data | caution | tip | check
     { table: { head, rows } }
     { files: [{ href, name }] }   downloads (href from the site root)
     { os: { mac, linux, win, unix: [...] } }   unix = mac + linux
     { variant: { <id>: [...] } }
   ========================================================= */
(() => {
  "use strict";
  const { KIT, KITS, SHELVES, Progress, Icons } = window;
  const ROOT = "../../";
  const meta = KITS.find(k => k.slug === KIT.slug);
  const shelf = SHELVES.find(s => s.id === meta.shelf);
  const OS = [["mac", "macOS"], ["linux", "Linux / WSL"], ["win", "Windows"]];
  const osName = Object.fromEntries(OS);

  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  /* inline markup: `code` first (its contents stay literal), then **bold** and [text](url) */
  const inline = s => String(s).split(/(`[^`]+`)/).map(part => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) return `<code>${esc(part.slice(1, -1))}</code>`;
    return esc(part)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a href="${u}"${/^https?:/.test(u) ? ' rel="noopener"' : ""}>${t}</a>`);
  }).join("");
  const pad = n => String(n).padStart(2, "0");

  /* ---------- blocks ---------- */
  let codeId = 0;
  function block(b, ctx) {
    if (typeof b === "string") return `<p>${inline(b)}</p>`;
    if (b.h) return `<h3>${inline(b.h)}</h3>`;
    if (b.ul) return `<ul>${b.ul.map(i => `<li>${inline(i)}</li>`).join("")}</ul>`;
    if (b.ol) return `<ol>${b.ol.map(i => `<li>${inline(i)}</li>`).join("")}</ol>`;
    if (b.code !== undefined) {
      const id = `code-${++codeId}`;
      const where = ctx.os ? ` · ${ctx.os.map(o => osName[o]).join(" / ")}` : "";
      const label = b.file ? `<b>${esc(b.file)}</b>${b.label ? ` · ${esc(b.label)}` : ""}` : `${esc(b.label || "Terminal")}${where}`;
      return `<div class="code"><div class="code-bar"><span class="label" id="${id}-l">${label}</span><button type="button" class="copy" data-copy="${id}" aria-describedby="${id}-l">Copy</button></div><pre id="${id}" tabindex="0" aria-labelledby="${id}-l"><code>${esc(b.code.replace(/^\n+|\s+$/g, ""))}</code></pre></div>`;
    }
    if (b.prompt !== undefined) {
      const id = `code-${++codeId}`;
      return `<div class="code prompt"><div class="code-bar"><span class="label" id="${id}-l">${esc(b.label || "Prompt")}</span><button type="button" class="copy" data-copy="${id}" aria-describedby="${id}-l">Copy</button></div><pre id="${id}" tabindex="0" aria-labelledby="${id}-l"><code>${esc(b.prompt.trim())}</code></pre></div>`;
    }
    if (b.note) {
      const title = b.title || { data: "Data", caution: "Caution", tip: "Tip", check: "You're done when" }[b.note];
      const body = b.blocks ? b.blocks.map(x => block(x, ctx)).join("") : `<p>${inline(b.text)}</p>`;
      return `<div class="callout" role="note" data-kind="${b.note}"><p class="callout-title">${esc(title)}</p>${body}</div>`;
    }
    if (b.table) {
      const { head, rows } = b.table;
      return `<div class="table-wrap" tabindex="0" role="region" aria-label="Table, scrolls sideways on small screens"><table class="spec-table"><thead><tr>${head.map(h => `<th scope="col">${inline(h)}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => i ? `<td>${inline(c)}</td>` : `<th scope="row">${inline(c)}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    }
    if (b.files) return `<ul class="downloads">${b.files.map(f => `<li><a href="${ROOT}${f.href}" download="${esc(f.name)}">${esc(f.name)}</a></li>`).join("")}</ul>`;
    if (b.os) {
      return Object.entries(b.os).map(([key, blocks]) => {
        const list = key === "unix" ? ["mac", "linux"] : [key];
        return `<div class="os-group" data-os="${list.join(" ")}">${blocks.map(x => block(x, { ...ctx, os: list })).join("")}</div>`;
      }).join("");
    }
    if (b.variant) {
      return Object.entries(b.variant).map(([id, blocks]) =>
        `<div class="variant-group" data-variant="${id}">${blocks.map(x => block(x, ctx)).join("")}</div>`).join("");
    }
    return "";
  }

  /* ---------- page ---------- */
  const steps = KIT.steps;
  const total = steps.length;
  const tools = meta.tools.join(", ");

  const header = `
    <nav class="crumbs wrap" aria-label="Breadcrumb"><ol>
      <li><a href="${ROOT}">All kits</a></li>
      <li><a href="${ROOT}#shelf-${shelf.id}">${esc(shelf.title)}</a></li>
      <li aria-current="page">${esc(meta.code)}</li>
    </ol></nav>
    <header class="kit-header wrap">
      <div class="kit-intro">
        <p class="label accent">${esc(meta.code)} · ${esc(shelf.title)}</p>
        <h1 class="display">${esc(meta.title)}</h1>
        <p class="lede">${esc(meta.tagline)}</p>
        <p class="kit-summary">${inline(KIT.summary)}</p>
        <dl class="kit-spec">
          <div><dt>Time</dt><dd>About ${meta.minutes} min</dd></div>
          <div><dt>Steps</dt><dd>${total}</dd></div>
          <div><dt>Level</dt><dd>${esc(meta.level)}</dd></div>
          <div><dt>Tools</dt><dd>${esc(tools)}</dd></div>
        </dl>
      </div>
      <aside class="kit-sheet" aria-label="Parts list">
        <figure class="fig"><div class="fig-body" data-icon="${meta.icon}"></div><figcaption><span><b>${esc(meta.code)}</b> ${esc(meta.title)}</span><span>${total} steps</span></figcaption></figure>
        <div class="sheet-part"><p class="label">Parts list · you'll need</p><ul class="parts-list">${KIT.parts.map(p => `<li>${inline(p)}</li>`).join("")}</ul></div>
        <div class="sheet-part"><p class="label">When you finish</p><ul class="outcome-list">${KIT.outcome.map(p => `<li>${inline(p)}</li>`).join("")}</ul></div>
      </aside>
    </header>`;

  const variantCtl = KIT.variants ? `
    <div class="segmented" role="group" aria-label="Tool"><span class="seg-label" aria-hidden="true">Tool</span><span class="options">${KIT.variants.map(v => `<button type="button" data-set-variant="${v.id}" aria-pressed="false">${esc(v.label)}</button>`).join("")}</span></div>` : "";
  const osCtl = KIT.os ? `
    <div class="segmented" role="group" aria-label="Operating system"><span class="seg-label" aria-hidden="true">System</span><span class="options">${OS.map(([id, label]) => `<button type="button" data-set-os="${id}" aria-pressed="false">${label}</button>`).join("")}</span></div>` : "";
  const bar = `
    <div class="kit-bar"><div class="wrap">
      <p class="bar-title"><b>${esc(meta.code)}</b> ${esc(meta.title)}</p>
      ${variantCtl}${osCtl}
      <p class="progress" aria-live="polite"><span id="progress-text">0 of ${total} steps</span><span class="meter" aria-hidden="true"><i id="progress-bar"></i></span></p>
    </div></div>`;

  const index = `
    <nav class="procedure" aria-label="Procedure">
      <p class="label">Procedure</p>
      <ol>${steps.map((s, i) => `<li data-step="${s.id}"><a href="#${s.id}"><span class="n">${pad(i + 1)}</span><span>${esc(s.title)}</span></a></li>`).join("")}
        <li class="end"><a href="#finish"><span class="n">—</span><span>Troubleshooting &amp; references</span></a></li>
      </ol>
    </nav>`;

  const body = steps.map((s, i) => `
    <section class="step" id="${s.id}" aria-labelledby="${s.id}-t">
      <header class="step-head">
        <span class="step-no" aria-hidden="true">${pad(i + 1)}</span>
        <div><p class="label">Step ${i + 1} of ${total}${s.minutes ? ` · ~${s.minutes} min` : ""}</p><h2 id="${s.id}-t">${esc(s.title)}</h2></div>
      </header>
      <div class="step-body">${s.blocks.map(b => block(b, {})).join("")}</div>
      <div class="step-foot"><button type="button" class="step-check" data-check="${s.id}" aria-pressed="false">Mark step ${i + 1} complete</button></div>
    </section>`).join("");

  const nextKits = (KIT.next || []).map(slug => KITS.find(k => k.slug === slug)).filter(k => k && k.ready);
  const end = `
    <div class="kit-end" id="finish">
      <div class="complete" id="complete" hidden>
        <span class="mark" aria-hidden="true">✓</span>
        <h2>Kit complete</h2>
        <p>Every step is checked off in this browser. <button type="button" class="reset" id="reset">Clear my checkmarks</button></p>
      </div>
      ${KIT.trouble?.length ? `<section aria-labelledby="t-head"><h2 class="end-head" id="t-head">Troubleshooting</h2><div class="trouble">${KIT.trouble.map(([q, a]) => `<details><summary><span>${inline(q)}</span></summary><div class="fix"><p>${inline(a)}</p></div></details>`).join("")}</div></section>` : ""}
      ${KIT.refs?.length ? `<section aria-labelledby="r-head"><h2 class="end-head" id="r-head">References</h2><ul class="refs">${KIT.refs.map(([l, u]) => `<li><a href="${u}">${esc(l)}</a></li>`).join("")}</ul></section>` : ""}
      ${nextKits.length ? `<section aria-labelledby="n-head"><h2 class="end-head" id="n-head">Next kits</h2><ul class="next-kits">${nextKits.map(k => `<li><a href="${ROOT}kits/${k.slug}/"><span class="kit-code">${esc(k.code)}</span><span class="t">${esc(k.title)}</span><span class="d">${esc(k.tagline)}</span></a></li>`).join("")}</ul></section>` : ""}
    </div>`;

  const main = document.getElementById("kit");
  document.title = `${meta.code} ${meta.title} · Harness Kits · University of Florida`;
  main.innerHTML = `${header}${bar}<div class="kit-layout wrap">${index}<div class="steps">${body}${end}</div></div>`;
  Icons.paint(main);

  /* ---------- OS and tool switches ---------- */
  const detectOS = () => {
    const p = (navigator.userAgentData?.platform || navigator.platform || "").toLowerCase();
    return p.includes("mac") ? "mac" : p.includes("win") ? "win" : "linux";
  };
  function setOS(os) {
    Progress.pref("os", os);
    main.querySelectorAll("[data-set-os]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.setOs === os)));
    main.querySelectorAll(".os-group").forEach(g => { g.hidden = !g.dataset.os.split(" ").includes(os); });
  }
  function setVariant(v) {
    Progress.pref(`variant:${KIT.slug}`, v);
    main.querySelectorAll("[data-set-variant]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.setVariant === v)));
    main.querySelectorAll(".variant-group").forEach(g => { g.hidden = g.dataset.variant !== v; });
  }
  setOS(Progress.pref("os") || detectOS());
  if (KIT.variants) setVariant(Progress.pref(`variant:${KIT.slug}`) || KIT.variants[0].id);

  /* ---------- step checkmarks ---------- */
  let done = new Set(Progress.get(KIT.slug).done.filter(id => steps.some(s => s.id === id)));
  function renderProgress() {
    steps.forEach((s, i) => {
      const on = done.has(s.id);
      const btn = main.querySelector(`[data-check="${s.id}"]`);
      btn.setAttribute("aria-pressed", String(on));
      btn.textContent = on ? `Step ${i + 1} complete` : `Mark step ${i + 1} complete`;
      document.getElementById(s.id).classList.toggle("is-done", on);
      main.querySelector(`.procedure [data-step="${s.id}"]`).classList.toggle("is-done", on);
    });
    document.getElementById("progress-text").textContent = `${done.size} of ${total} steps`;
    document.getElementById("progress-bar").style.width = `${(done.size / total) * 100}%`;
    document.getElementById("complete").hidden = done.size < total;
  }
  renderProgress();

  main.addEventListener("click", async e => {
    const t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.setOs) return setOS(t.dataset.setOs);
    if (t.dataset.setVariant) return setVariant(t.dataset.setVariant);
    if (t.dataset.check) {
      const id = t.dataset.check;
      done.has(id) ? done.delete(id) : done.add(id);
      Progress.set(KIT.slug, [...done], total);
      return renderProgress();
    }
    if (t.id === "reset") {
      done = new Set(); Progress.clear(KIT.slug); renderProgress();
      return document.getElementById(steps[0].id).scrollIntoView();
    }
    if (t.dataset.copy) {
      const text = document.getElementById(t.dataset.copy).textContent;
      try { await navigator.clipboard.writeText(text); }
      catch {
        const ta = Object.assign(document.createElement("textarea"), { value: text });
        document.body.append(ta); ta.select(); document.execCommand("copy"); ta.remove();
      }
      t.textContent = "Copied"; t.dataset.copied = "";
      setTimeout(() => { t.textContent = "Copy"; delete t.dataset.copied; }, 1600);
    }
  });

  /* ---------- highlight the step in view ---------- */
  const links = new Map([...main.querySelectorAll(".procedure a")].map(a => [a.hash.slice(1), a]));
  const seen = new Map();
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => seen.set(en.target.id, en.isIntersecting));
    const current = steps.find(s => seen.get(s.id));
    links.forEach(a => a.removeAttribute("aria-current"));
    if (current) links.get(current.id).setAttribute("aria-current", "step");
  }, { rootMargin: "-20% 0px -60% 0px" });
  steps.forEach(s => io.observe(document.getElementById(s.id)));

  if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
})();
