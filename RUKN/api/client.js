/* ─────────────────────────────────────────────────────────────
   RUKN — tiny client for the PHP API.
   Loaded as a plain <script> in every HTML page BEFORE the JSX.
   Exposes window.RuknAPI with:
     RuknAPI.me()                       → GET  /api/auth.php?action=me
     RuknAPI.login(emailOrUser, pw)     → POST /api/auth.php?action=login
     RuknAPI.register(payload)          → POST /api/auth.php?action=register
     RuknAPI.logout()                   → POST /api/auth.php?action=logout
     RuknAPI.call(action, body)         → POST /api/api.php?action=...
                                          (or GET if body is null)
   Every call returns { ok, status, data } where data.ok mirrors the JSON body.
   On 401 from /api/api.php, redirects the browser to Login.html.
   ───────────────────────────────────────────────────────────── */

(function () {
  const AUTH = "api/auth.php";
  const API  = "api/api.php";

  async function send(url, body) {
    const opts = {
      method: body ? "POST" : "GET",
      credentials: "same-origin",
      headers: body ? { "Content-Type": "application/json" } : {},
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    let data;
    try { data = await res.json(); } catch { data = { ok: false, error: "Bad response" }; }
    return { ok: res.ok && data.ok, status: res.status, data };
  }

  function relativeFromHere(path) {
    // Pages live at RUKN/*.html and so does api/. Always relative.
    return path;
  }

  window.RuknAPI = {
    async me()                                  { return send(relativeFromHere(AUTH) + "?action=me"); },
    async login(emailOrUsername, password)      { return send(relativeFromHere(AUTH) + "?action=login",    { email: emailOrUsername, password }); },
    async register(payload)                     { return send(relativeFromHere(AUTH) + "?action=register", payload); },
    async forgot(emailOrUsername)               { return send(relativeFromHere(AUTH) + "?action=forgot",   { email: emailOrUsername }); },
    async reset(token, password, confirm)       { return send(relativeFromHere(AUTH) + "?action=reset",    { token, password, confirm }); },
    async logout()                              {
      const r = await send(relativeFromHere(AUTH) + "?action=logout", {});
      window.location.href = "Homepage.html";
      return r;
    },

    async call(action, body, query) {
      // `action` is the endpoint name. `body` (object|null) → POST JSON body.
      // `query` (object) → extra GET params appended to the URL, properly
      // encoded so they reach $_GET on the PHP side.
      let url = relativeFromHere(API) + "?action=" + encodeURIComponent(action);
      if (query && typeof query === "object") {
        for (const k of Object.keys(query)) {
          if (query[k] !== undefined && query[k] !== null) {
            url += "&" + encodeURIComponent(k) + "=" + encodeURIComponent(query[k]);
          }
        }
      }
      const r = await send(url, body || null);
      if (r.status === 401) window.location.href = "Login.html";
      return r;
    },

    async require() {
      const r = await this.me();
      if (r.status === 401 || !r.data.ok) {
        const p = location.pathname;
        if (!p.endsWith("Login.html") && !p.endsWith("Homepage.html")) {
          window.location.href = "Login.html";
        }
        return null;
      }
      return r.data.user;
    },
  };

  // ── Auto auth-guard for protected pages ────────────────────────
  // Homepage and Login don't require a session; every other .html does.
  // This runs on script load, before the React components mount.
  (function autoGuard() {
    const p = (location.pathname || "").toLowerCase();
    const PUBLIC = ["login.html", "homepage.html", "forgot.html", "reset.html"];
    const isPublic = PUBLIC.some(name => p.endsWith("/" + name) || p.endsWith(name))
                  || p === "/" || p.endsWith("/");
    if (isPublic) return;
    window.RuknAPI.me().then(r => {
      if (r.status === 401 || !r.data.ok) {
        window.location.href = "Login.html";
      }
    });
  })();
})();
