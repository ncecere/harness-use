/* =========================================================
   LINE ICONS & FIGURES — technical-drawing style.
   .ln = Dark Blue line, .hl = Core Orange highlight line,
   fill-* = flat fills. Usage: <div data-icon="key"></div>,
   then Icons.paint(root).
   ========================================================= */
window.Icons = (() => {
  "use strict";
  const svg = (vb, body, label) => `<svg class="icon" viewBox="${vb}" ${label ? `role="img" aria-label="${label}"` : `aria-hidden="true"`} focusable="false">${body}</svg>`;

  const icons = {
    key: () => svg("0 0 64 64", `
      <circle cx="20" cy="32" r="12" class="ln"/><circle cx="20" cy="32" r="5" class="hl"/>
      <path d="M32 32h26M50 32v8M44 32v6" class="ln"/>`),
    research: () => svg("0 0 64 64", `
      <path d="M12 8h24l8 8v36H12Z" class="ln"/><path d="M36 8v8h8" class="ln"/>
      <path d="M18 22h14M18 28h18M18 34h10" class="ln"/>
      <circle cx="40" cy="40" r="9" class="hl"/><path d="M47 47l9 9" class="ln"/>`),
    pi: () => svg("0 0 64 64", `
      <path d="M12 18h40M24 18v32M40 18v26c0 4 2 6 6 6" class="ln"/>
      <circle cx="12" cy="18" r="3" class="fill-o"/><circle cx="52" cy="18" r="3" class="fill-o"/>
      <path d="M46 50h8" class="hl"/>`),
    terminal: () => svg("0 0 64 64", `
      <rect x="8" y="12" width="48" height="40" rx="3" class="ln"/><path d="M8 20h48" class="ln"/>
      <path d="M16 30l7 6l-7 6" class="hl"/><path d="M28 42h12" class="ln"/>`),
    editor: () => svg("0 0 64 64", `
      <rect x="6" y="10" width="52" height="44" rx="3" class="ln"/><path d="M18 10v44" class="ln"/>
      <path d="M24 20h14M24 26h20M24 32h10" class="ln"/><path d="M24 38h22" class="hl"/>
      <path d="M44 44h10v6l-4-3h-6Z" class="ln"/>`),
    office: () => svg("0 0 64 64", `
      <path d="M8 8h26v34H8Z" class="ln"/><path d="M14 16h14M14 22h14M14 28h8" class="ln"/>
      <rect x="26" y="30" width="30" height="22" rx="2" class="ln"/><path d="M26 32l15 11l15-11" class="hl"/>`),
    notebook: () => svg("0 0 64 64", `
      <rect x="8" y="8" width="48" height="48" rx="3" class="ln"/><path d="M8 20h48" class="ln"/>
      <path d="M16 46V38M26 46V30M36 46V34M46 46V26" class="hl"/><path d="M14 48h36" class="ln"/>`),
    assistant: () => svg("0 0 64 64", `
      <path d="M8 54V26l14-10l14 10v28Z" class="ln"/><path d="M16 54V40h12v14" class="ln"/>
      <path d="M36 10h20v14H46l-5 5v-5h-5Z" class="hl"/>`),
    check: () => svg("0 0 16 16", `<path d="M3 8.5l3 3l7-7" class="hl"/>`),

    /* FIG. 1 — the parts of an AI workspace */
    anatomy: () => svg("0 0 480 350", `
      <g>
        <rect x="14" y="70" width="128" height="124" rx="3" class="ln fill-p"/>
        <text x="26" y="92" class="txt">YOUR FILES</text>
        <path d="M26 106h22l4 5h26v28H26Z" class="ln"/>
        <text x="26" y="160" class="txt">sources/</text><text x="26" y="174" class="txt">outputs/</text><text x="26" y="188" class="txt-o">AGENTS.md</text>
      </g>
      <g>
        <rect x="176" y="26" width="128" height="206" rx="3" class="ln fill-t"/>
        <text x="188" y="48" class="txt">HARNESS</text>
        <text x="188" y="74" class="txt">OpenCode</text><text x="188" y="90" class="txt">Pi</text>
        <rect x="188" y="140" width="104" height="22" rx="2" class="ln fill-p"/><text x="198" y="155" class="txt-o">skills</text>
        <rect x="188" y="168" width="104" height="22" rx="2" class="ln fill-p"/><text x="198" y="183" class="txt-o">plugins</text>
        <rect x="188" y="196" width="104" height="22" rx="2" class="ln fill-p"/><text x="198" y="211" class="txt-o">permissions</text>
      </g>
      <g>
        <rect x="338" y="26" width="128" height="206" rx="3" class="ln fill-p"/>
        <text x="350" y="48" class="txt">NAVIGATOR AI</text><text x="350" y="62" class="txt">TOOLKIT</text>
        <rect x="350" y="78" width="104" height="74" rx="2" class="ln fill-t"/>
        <text x="360" y="98" class="txt-o">LOCAL</text><text x="360" y="114" class="txt">UF</text><text x="360" y="128" class="txt">datacenters</text><text x="360" y="142" class="txt">all classes</text>
        <rect x="350" y="162" width="104" height="60" rx="2" class="ln fill-p"/>
        <text x="360" y="182" class="txt-o">CLOUD</text><text x="360" y="198" class="txt">vendors</text><text x="360" y="212" class="txt">open only</text>
      </g>
      <g>
        <rect x="176" y="270" width="128" height="62" rx="3" class="ln fill-p dash"/>
        <text x="188" y="292" class="txt">WEB &amp; APIs</text><text x="188" y="310" class="txt">leaves UF</text><text x="188" y="324" class="txt">open only</text>
      </g>
      <path d="M142 132h34" class="hl flow"/><path d="M304 132h34" class="hl flow"/><path d="M240 232v38" class="ln flow"/>
      <path d="M170 128l6 4l-6 4M332 128l6 4l-6 4" class="hl"/>
      ${[[159, 118, "1"], [321, 118, "2"], [256, 252, "3"]].map(([x, y, n]) => `<circle cx="${x}" cy="${y}" r="9" class="fill-o"/><text x="${x}" y="${y + 4}" text-anchor="middle" class="txt txt-w">${n}</text>`).join("")}`,
      "Diagram: your files connect to a harness such as OpenCode or Pi, which adds skills, plugins, and permissions. The harness sends model requests to NaviGator AI Toolkit, where local models in UF datacenters accept all data classes and cloud models accept open data only. Web searches and outside APIs leave UF and are for open data only.")
  };

  function paint(root = document) {
    root.querySelectorAll("[data-icon]").forEach(el => {
      const f = icons[el.dataset.icon];
      if (f && !el.firstElementChild) el.innerHTML = f();
    });
  }
  return { icons, paint };
})();
