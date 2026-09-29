/* =========================================================
   GLOSSARY PAGE (glossary.html) — renders window.GLOSSARY
   (js/glossary.js) as an A–Z list with a live filter.
   Every term has an anchor: glossary.html#context-window
   ========================================================= */
(() => {
  "use strict";
  const { GLOSSARY, KITS } = window;
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const inline = s => String(s ?? "").split(/(`[^`]+`)/).map(p =>
    p.length > 1 && p.startsWith("`") && p.endsWith("`") ? `<code>${esc(p.slice(1, -1))}</code>` : esc(p)).join("");
  const idOf = t => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const bySlug = new Map(KITS.map(k => [k.slug, k]));
  const TOTAL = GLOSSARY.length;
  const terms = new Set(GLOSSARY.map(g => g.term));

  const where = ([slug, step]) => {
    const k = bySlug.get(slug);
    return k ? `<a href="kits/${slug}/${step ? `#${step}` : ""}">${esc(k.code)} ${esc(k.title)}</a>` : "";
  };

  function item(g) {
    const also = (g.also || []).filter(a => terms.has(a)).map(a => `<a href="#${idOf(a)}">${esc(a)}</a>`).join(", ");
    const see = (g.see || []).map(where).filter(Boolean).join(" · ");
    const meta = [see && `<span>Learn it in: ${see}</span>`, also && `<span>See also: ${also}</span>`].filter(Boolean).join("");
    return `
      <div class="gl-item" id="${idOf(g.term)}" data-find="${esc((g.term + " " + g.def).toLowerCase().replace(/`/g, ""))}">
        <dt><a href="#${idOf(g.term)}">${esc(g.term)}</a></dt>
        <dd><p class="gl-def">${inline(g.def)}</p>${meta ? `<p class="gl-meta">${meta}</p>` : ""}</dd>
      </div>`;
  }

  const groups = new Map();
  for (const g of [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term))) {
    const L = g.term[0].toUpperCase();
    if (!groups.has(L)) groups.set(L, []);
    groups.get(L).push(g);
  }
  const letters = [...groups.keys()];

  $("#gl-terms").innerHTML = letters.map(L => `
    <section class="gl-group" id="letter-${L}" aria-labelledby="h-${L}">
      <h2 class="gl-letter" id="h-${L}">${L}</h2>
      <dl class="gl-list">${groups.get(L).map(item).join("")}</dl>
    </section>`).join("") + `<p class="lib-empty" id="gl-empty" hidden>No terms match. Try a shorter word.</p>`;
  $("#gl-letters").innerHTML = letters.map(L => `<li><a href="#letter-${L}" aria-label="Jump to ${L}">${L}</a></li>`).join("");

  /* live filter */
  const q = $("#gl-q"), count = $("#gl-count");
  const items = [...document.querySelectorAll(".gl-item")];
  const sections = [...document.querySelectorAll(".gl-group")];
  let timer;
  function filter() {
    const words = q.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    for (const el of items) {
      const hit = words.every(w => el.dataset.find.includes(w));
      el.hidden = !hit;
      if (hit) shown++;
    }
    for (const s of sections) s.hidden = !s.querySelector(".gl-item:not([hidden])");
    $("#gl-empty").hidden = shown > 0;
    clearTimeout(timer);
    timer = setTimeout(() => { count.textContent = words.length ? `${shown} of ${TOTAL} terms match` : `${TOTAL} terms`; }, 350);
  }
  q.addEventListener("input", filter);
  q.addEventListener("keydown", e => { if (e.key === "Escape" && q.value) { q.value = ""; filter(); } });
  addEventListener("hashchange", () => {
    const el = document.getElementById(location.hash.slice(1));
    if (el && el.closest("[hidden]")) { q.value = ""; filter(); el.scrollIntoView(); }
  });
  count.textContent = `${TOTAL} terms`;
  if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
})();
