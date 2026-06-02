// i18n.jsx
// Shared bilingual helper used by every Rukn page. Loaded BEFORE any other
// JSX so widgets.jsx / auth.jsx / dashboard.jsx etc. can use <LangPill/>
// without worrying about whether widgets.jsx was loaded first.
//
// Exposes:
//   window.Rukn.lang()          → "en" | "ar"
//   window.Rukn.setLang(code)   → flips dir, persists, fires a "rukn:lang" event
//   useRuknLang()               → React hook, re-renders on language change
//   <LangPill compact?/>        → drop-in EN/AR toggle component

// ── Global language state ────────────────────────────────────────────────────
(function () {
  if (!window.Rukn) window.Rukn = {};
  if (window.Rukn.__langInitialized) return;
  window.Rukn.__langInitialized = true;

  const KEY = "rukn.lang";
  let cur = (() => {
    try {
      const v = localStorage.getItem(KEY);
      return v === "ar" ? "ar" : "en";
    } catch (e) { return "en"; }
  })();

  function apply(code) {
    const isAr = code === "ar";
    document.documentElement.lang = isAr ? "ar" : "en";
    document.documentElement.dir  = isAr ? "rtl" : "ltr";
  }

  window.Rukn.lang    = () => cur;
  window.Rukn.setLang = (code) => {
    cur = code === "ar" ? "ar" : "en";
    try { localStorage.setItem(KEY, cur); } catch (e) {}
    apply(cur);
    if (window.RuknAPI) {
      window.RuknAPI.call("update_preference", { preferred_lang: cur === "ar" ? "AR" : "EN" });
    }
    window.dispatchEvent(new CustomEvent("rukn:lang", { detail: cur }));
    return cur;
  };
  apply(cur);
})();

// ── React hook that re-renders the component on language flip ────────────────
function useRuknLang() {
  const [lang, set] = React.useState(() => (window.Rukn && window.Rukn.lang()) || "en");
  React.useEffect(() => {
    const h = (e) => set(e.detail || "en");
    window.addEventListener("rukn:lang", h);
    return () => window.removeEventListener("rukn:lang", h);
  }, []);
  return lang;
}

// ── The EN / AR pill ────────────────────────────────────────────────────────
function LangPill({ compact = true }) {
  const lang = useRuknLang();
  const cls = "lang-pill" + (compact ? " compact" : "");
  return (
    <div className={cls}>
      <button className={lang === "en" ? "active" : ""}
              onClick={() => window.Rukn.setLang("en")}>EN</button>
      <span/>
      <button className={lang === "ar" ? "active" : ""}
              onClick={() => window.Rukn.setLang("ar")}>AR</button>
    </div>
  );
}

// Make these globals so other JSX files can use them without imports.
window.useRuknLang = useRuknLang;
window.LangPill    = LangPill;
