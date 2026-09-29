/* =========================================================
   LANDING PAGE — builds the kit shelves from js/kits.js
   ========================================================= */
(() => {
  "use strict";
  const { KITS, SHELVES, Progress, Icons } = window;
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  function state(k) {
    if (!k.ready) return { kind: "soon" };
    const p = Progress.get(k.slug);
    const n = p.done.length;
    if (!n) return { kind: "new" };
    if (n >= k.steps) return { kind: "done" };
    return { kind: "progress", n, pct: Math.round((n / k.steps) * 100) };
  }

  function card(k) {
    const s = state(k);
    const status = {
      soon: `<span class="status">Coming soon</span>`,
      new: `<span class="status" aria-hidden="true">Open kit →</span>`,
      progress: `<span class="status">Step ${s.n} of ${k.steps}</span>`,
      done: `<span class="status done">✓ Complete</span>`
    }[s.kind];
    const title = k.ready
      ? `<a href="kits/${k.slug}/">${esc(k.title)}</a>`
      : `${esc(k.title)}<span class="sr-only">, not yet available</span>`;
    return `
      <li class="card${k.ready ? "" : " soon"}">
        <div class="card-top"><span class="kit-code">${esc(k.code)}</span><span class="lvl">${esc(k.level)}</span></div>
        <div class="card-body">
          <h4>${title}</h4>
          <div class="glyph" data-icon="${k.icon}"></div>
          <p class="tagline">${esc(k.tagline)}</p>
          <ul class="chips" aria-label="Tools">${k.tools.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
        </div>
        <div>
          ${s.kind === "progress" ? `<div class="meter" role="progressbar" aria-label="${esc(k.title)} progress" aria-valuenow="${s.pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${s.pct}%"></i></div>` : ""}
          <div class="card-foot"><p class="spec">~${k.minutes} min · ${k.steps} steps</p>${status}</div>
        </div>
      </li>`;
  }

  const root = document.getElementById("shelves");
  root.innerHTML = SHELVES.map(sh => {
    const kits = KITS.filter(k => k.shelf === sh.id);
    if (!kits.length) return "";
    return `
      <section class="shelf" aria-labelledby="shelf-${sh.id}">
        <div class="shelf-head">
          <span class="n">SECTION ${sh.n}</span>
          <h3 id="shelf-${sh.id}">${esc(sh.title)}</h3>
          <p>${esc(sh.blurb)}</p>
        </div>
        <ul class="cards">${kits.map(card).join("")}</ul>
      </section>`;
  }).join("");

  const count = document.getElementById("spec-kits");
  if (count) count.textContent = KITS.filter(k => k.ready).length;
  Icons.paint();
})();
