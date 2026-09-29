# Harness Kits

Step-by-step setup guides for AI workspaces at the University of Florida. Each kit connects a tool (OpenCode, Pi, Microsoft Copilot, NaviGator Chat) to NaviGator AI and walks through the setup as a numbered procedure.

Plain HTML, CSS, and JavaScript. No build step, and no inline scripts, so it fits a strict Content Security Policy.

## Preview

```bash
python3 -m http.server 8766
```

Open <http://127.0.0.1:8766>.

## Container

```bash
docker build -t harness-use .
docker run --rm -p 8080:8080 \
  --read-only \
  --tmpfs /var/cache/nginx:uid=101,gid=101 \
  --tmpfs /var/run:uid=101,gid=101 \
  --tmpfs /tmp:uid=101,gid=101 \
  harness-use
```

Pushes to `main` publish `ghcr.io/ncecere/harness-use` through `.github/workflows/publish.yaml`.

## Layout

```text
index.html                 landing page: hero, how the parts fit, data rules, kit shelves
kits/<slug>/index.html     page shell for one kit (identical for every kit)
kits/<slug>/kit.js         the kit's content: parts list, steps, troubleshooting, references
files/                     starter files the kits offer as downloads
js/kits.js                 catalog: kit titles, shelves, time, step counts, ready flags
js/kit.js                  renders a kit.js into the procedure page
js/landing.js              builds the kit shelves on the landing page
js/icons.js                line icons and Fig. 1
js/progress.js             step checkmarks and OS/tool choices, saved in localStorage
css/main.css               entry point: imports everything in cascade layers
css/tokens.css             every design value (colors, type, spacing, radius, shadow)
css/base.css               reset and layout primitives
css/components/*.css       one file per component
fonts/                     Anybody, IBM Plex Sans, IBM Plex Mono (SIL OFL 1.1)
img/                       official UF logos, cropped to the artwork, otherwise unaltered
```

## Styling

The look is a "field manual": white pages, Dark Blue rules, mono labels, numbered steps, and Core Orange accents.

- **All design values live in `css/tokens.css`.** Components use only the semantic tokens (`--color-primary`, `--color-heading`, `--font-display`, `--space-4`, ...), never raw colors. To restyle the site, change the tokens first.
- **One component per file** in `css/components/`, imported by `css/main.css` into the `components` cascade layer. To add one, create the file and add an `@import` line.
- Content never contains styling. Kit files describe blocks (steps, code, prompts, callouts, tables) and `js/kit.js` decides how they look.

UF brand rules the tokens follow ([UF Brand Center](https://brandcenter.ufl.edu/)):

- Core Orange `#FA4616` and Core Blue `#0021A5` lead; Dark Blue `#002657` for headings and bands.
- Secondary colors (Gator, Alachua, Bottlebrush) are small accents only: status marks and callout edges.
- Black is used only for body copy. Labels and UI text use Dark Blue.
- Orange is used for large type, rules, and marks, not small text, because it doesn't meet WCAG AA contrast at small sizes.
- Type: Anybody (display), IBM Plex Sans (body), IBM Plex Mono (labels and code; the brand's typeface for AI-related material).
- The UF logo is the official artwork, unmodified, with clear space.

## Add or edit a kit

1. Add or update its entry in `js/kits.js`. Keep `steps` equal to the number of steps in the kit file.
2. Copy any `kits/<slug>/index.html` to the new folder. The shell is identical for every kit.
3. Write `kits/<slug>/kit.js`. The block types are documented at the top of `js/kit.js`:
   - `"text"` paragraphs with `` `code` ``, `**bold**`, and `[links](url)`
   - `{ code, file, label }` code panels with a copy button
   - `{ prompt }` things to type to the agent
   - `{ note: "data" | "caution" | "tip" | "check", text }` callouts
   - `{ table }`, `{ ul }`, `{ ol }`, `{ h }`, `{ files }` downloads
   - `{ os: { mac, linux, win, unix } }` blocks that change with the System switch
   - `{ variant: { <tool>: [...] } }` blocks that change with the Tool switch
4. Set `ready: true` in `js/kits.js`.
No other changes are needed. The Dockerfile already copies `kits/` and `files/`.

In template literals, avoid `${` in commands. Use `$VAR` or `$(...)` instead.

## Keeping kits accurate

Kits describe third-party tools that change often. Each `kit.js` lists its sources in a comment at the top and in `refs`. Before a semester, re-check:

- install commands and config formats for OpenCode and Pi;
- the NaviGator model list and data classifications;
- the pinned research-skill release (`v2.69.0`) in `files/install-research-skills.sh` and the kits.
