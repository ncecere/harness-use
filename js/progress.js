/* =========================================================
   PROGRESS — saved in this browser only (no accounts).
   Kit pages record which steps are checked off; the landing
   page reads it back for the progress bars and stamps.
   ========================================================= */
window.Progress = (() => {
  "use strict";
  const KEY = "hk:progress:v1";
  const PREFS = "hk:prefs:v1";

  const load = k => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch { return {}; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode or storage full */ } };

  return {
    get(slug) { return load(KEY)[slug] || { done: [], total: 0 }; },
    set(slug, done, total) {
      const all = load(KEY);
      all[slug] = { done: [...new Set(done)], total, at: new Date().toISOString() };
      save(KEY, all);
    },
    clear(slug) { const all = load(KEY); delete all[slug]; save(KEY, all); },
    pref(name, value) {
      const p = load(PREFS);
      if (value === undefined) return p[name];
      p[name] = value; save(PREFS, p);
      return value;
    }
  };
})();
