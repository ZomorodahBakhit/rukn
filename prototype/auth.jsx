// auth.jsx
// Rukn — Login / Register screen. Two-panel split: arch vignette (left) + form (right).
// Validation logic, password show/hide, tab toggle, language dropdown.

// ── Auth strings (EN) ────────────────────────────────────────────────────────
const AUTH_STRINGS = {
  tabLogin: "Log in",
  tabRegister: "Create account",

  // Login
  loginTitle: "Welcome back.",
  loginSub: "Pull up your chair — your books, notes, and ambience are exactly where you left them.",
  emailLabel: "Email",
  emailPlaceholder: "you@example.com",
  passwordLabel: "Password",
  passwordPlaceholder: "••••••••",
  forgot: "Forgot password?",
  cta_login: "Log in",

  // Register
  registerTitle: "Make a corner of your own.",
  registerSub: "A free Rukn account keeps your highlights, notes, and ambience saved for the next time you sit down.",
  nameLabel: "Full name",
  namePlaceholder: "Layla Hassan",
  confirmLabel: "Confirm password",
  langLabel: "Preferred language",
  cta_register: "Create account",

  // Errors
  err_email: "Please enter a valid email.",
  err_password: "Use at least 8 characters.",
  err_confirm: "Passwords do not match.",
  err_name: "Tell us your name.",

  backHome: "Back to home",
  alreadyHave: "Already have an account?",
  needAccount: "New to Rukn?",
  switchToLogin: "Log in",
  switchToRegister: "Create one"
};

// ── Left-panel vignette: an arch view at dusk with a windowsill of books ────
function AuthVignette() {
  return (
    <svg viewBox="0 0 720 900" preserveAspectRatio="xMidYMid slice"
         xmlns="http://www.w3.org/2000/svg" className="auth-art">
      <defs>
        <linearGradient id="av-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="var(--sky-top)"/>
          <stop offset="55%" stopColor="var(--sky-mid)"/>
          <stop offset="100%" stopColor="var(--sky-low)"/>
        </linearGradient>
        <radialGradient id="av-sun" cx="0.5" cy="0.78" r="0.40">
          <stop offset="0%"  stopColor="var(--sky-sun)" stopOpacity="0.95"/>
          <stop offset="45%" stopColor="var(--sky-sun)" stopOpacity="0.40"/>
          <stop offset="100%" stopColor="var(--sky-sun)" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="av-lamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%"   stopColor="#FFE4B0" stopOpacity="0.95"/>
          <stop offset="55%"  stopColor="#E89A4A" stopOpacity="0.30"/>
          <stop offset="100%" stopColor="#E89A4A" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="av-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0E0805"/>
          <stop offset="60%" stopColor="#160C08"/>
          <stop offset="100%" stopColor="#2A1810"/>
        </linearGradient>
        <linearGradient id="av-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A1810"/>
          <stop offset="100%" stopColor="#190E08"/>
        </linearGradient>

        <clipPath id="av-arch-clip">
          <path d="
            M 180 720
            L 180 380
            C 180 200, 280 130, 360 130
            C 440 130, 540 200, 540 380
            L 540 720
            Z"/>
        </clipPath>
      </defs>

      {/* Wall background */}
      <rect width="720" height="900" fill="url(#av-wall)"/>

      {/* Floor */}
      <rect x="0" y="720" width="720" height="180" fill="url(#av-floor)"/>

      {/* Arch reveal — sky + sun + minarets */}
      <g clipPath="url(#av-arch-clip)">
        <rect x="180" y="100" width="360" height="640" fill="url(#av-sky)"/>
        <ellipse cx="360" cy="540" rx="180" ry="160" fill="url(#av-sun)"/>

        {/* Distant city silhouette */}
        <g fill="#1A0E08" opacity="0.92">
          <rect x="180" y="600" width="360" height="120"/>
          {/* Minaret cluster */}
          <rect x="240" y="540" width="22" height="80"/>
          <polygon points="240,540 251,520 262,540"/>
          <circle cx="251" cy="525" r="3" fill="#1A0E08"/>

          <rect x="330" y="500" width="14" height="120"/>
          <polygon points="330,500 337,480 344,500"/>

          <rect x="380" y="520" width="40" height="100"/>
          <path d="M 380 520 Q 400 490 420 520 Z"/>

          <rect x="450" y="555" width="22" height="65"/>
          <polygon points="450,555 461,538 472,555"/>

          {/* Tiny window dots */}
          <rect x="247" y="580" width="3" height="3" fill="#F2B36A" opacity="0.85"/>
          <rect x="395" y="565" width="3" height="3" fill="#F2B36A" opacity="0.85"/>
          <rect x="402" y="580" width="3" height="3" fill="#F2B36A" opacity="0.7"/>
        </g>
      </g>

      {/* Arch frame (stroke for definition) */}
      <path d="M 180 720 L 180 380 C 180 200, 280 130, 360 130 C 440 130, 540 200, 540 380 L 540 720"
            fill="none" stroke="#2C1810" strokeWidth="2" opacity="0.6"/>

      {/* Windowsill ledge */}
      <rect x="160" y="718" width="400" height="10" fill="#1F1208"/>
      <rect x="160" y="716" width="400" height="2" fill="#3A2616" opacity="0.7"/>

      {/* Brass lantern (left of arch) — hanging chain + glow */}
      <line x1="120" y1="120" x2="120" y2="280" stroke="#3A2616" strokeWidth="1"/>
      <ellipse cx="120" cy="330" rx="80" ry="80" fill="url(#av-lamp)"/>
      <g transform="translate(108 280)">
        <path d="M 0 0 L 24 0 L 22 8 L 2 8 Z" fill="#3A2616"/>
        <path d="M 2 8 L 22 8 L 18 38 L 6 38 Z" fill="#5A3D1F"/>
        <path d="M 6 38 L 18 38 L 16 46 L 8 46 Z" fill="#3A2616"/>
        {/* Lantern light core */}
        <rect x="6" y="14" width="12" height="18" fill="#FFE4B0" opacity="0.9"/>
      </g>

      {/* Windowsill: stack of books + small plant */}
      <g transform="translate(220 690)">
        {/* Book stack */}
        <rect x="0" y="0" width="78" height="9" rx="1" fill="#7A3F2A"/>
        <rect x="2" y="-9" width="74" height="9" rx="1" fill="#5A6B3F"/>
        <rect x="4" y="-18" width="68" height="9" rx="1" fill="#3F4F6B"/>
        {/* Page edges */}
        <line x1="2" y1="3" x2="78" y2="3" stroke="#F4E9D4" strokeWidth="0.5" opacity="0.4"/>
        <line x1="4" y1="-6" x2="76" y2="-6" stroke="#F4E9D4" strokeWidth="0.5" opacity="0.4"/>
        <line x1="6" y1="-15" x2="72" y2="-15" stroke="#F4E9D4" strokeWidth="0.5" opacity="0.4"/>
      </g>

      {/* Open book on right of sill */}
      <g transform="translate(360 700)">
        <path d="M 0 18 L 60 14 L 60 22 L 0 22 Z" fill="#2A1810"/>
        <path d="M 0 18 L 30 4 L 60 14 L 30 14 Z" fill="#F4E9D4"/>
        <path d="M 30 4 L 30 14" stroke="#8A6A4A" strokeWidth="0.5"/>
        <line x1="6" y1="10" x2="24" y2="6" stroke="#1F1610" strokeWidth="0.5" opacity="0.5"/>
        <line x1="6" y1="12" x2="24" y2="9" stroke="#1F1610" strokeWidth="0.5" opacity="0.5"/>
        <line x1="36" y1="6" x2="54" y2="10" stroke="#1F1610" strokeWidth="0.5" opacity="0.5"/>
        <line x1="36" y1="9" x2="54" y2="12" stroke="#1F1610" strokeWidth="0.5" opacity="0.5"/>
      </g>

      {/* Small plant pot, right */}
      <g transform="translate(470 690)">
        <path d="M 0 30 L 22 30 L 19 12 L 3 12 Z" fill="#5A3D1F"/>
        <path d="M 3 12 L 19 12 L 21 8 L 1 8 Z" fill="#7A5530"/>
        {/* Leaves */}
        <path d="M 11 8 Q 4 -6 0 0 Q 2 -10 8 -8 Q 10 -16 14 -10 Q 22 -12 22 -2 Q 24 4 18 6 Q 14 -2 11 8 Z"
              fill="#3D4A2A"/>
        <path d="M 14 -10 Q 18 -16 22 -10" fill="#4A5A35"/>
      </g>

      {/* Soft floor glow under arch */}
      <ellipse cx="360" cy="780" rx="220" ry="40" fill="#6B3A22" opacity="0.30"/>

      {/* Vertical light beam from arch */}
      <path d="M 180 720 L 200 900 L 540 900 L 540 720 Z" fill="url(#av-sun)" opacity="0.18"/>
    </svg>
  );
}

// ── Input field ──────────────────────────────────────────────────────────────
function Field({ label, type="text", value, onChange, onBlur, error, placeholder, autoComplete,
                 trailing, ...rest }) {
  const id = React.useId();
  return (
    <div className={`field${error ? " has-error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <div className="field-control">
        <input id={id}
               type={type}
               value={value}
               placeholder={placeholder}
               autoComplete={autoComplete}
               onChange={(e) => onChange(e.target.value)}
               onBlur={onBlur}
               {...rest}/>
        {trailing}
      </div>
      {error && (
        <div className="field-error">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v4"/><path d="M12 17h.01"/>
            <path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.41 0Z"/>
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}

// ── Show/hide password trailing button ───────────────────────────────────────
function PassToggle({ shown, onToggle }) {
  return (
    <button type="button" className="field-trailing" aria-label={shown ? "Hide password" : "Show password"}
            onClick={onToggle} tabIndex={-1}>
      {shown ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24"/>
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
          <line x1="2" y1="2" x2="22" y2="22"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      )}
    </button>
  );
}

// ── Login form ───────────────────────────────────────────────────────────────
function LoginForm({ t, onSubmit }) {
  const [email, setEmail] = React.useState("");
  const [pw, setPw] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [touched, setTouched] = React.useState({});

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const pwValid = pw.length >= 8;

  const emailErr = touched.email && !emailValid ? t.err_email : null;
  const pwErr = touched.pw && !pwValid ? t.err_password : null;
  const formValid = emailValid && pwValid;

  return (
    <form className="auth-form" onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(); }}>
      <Field label={t.emailLabel} type="email"
             value={email} onChange={setEmail}
             placeholder={t.emailPlaceholder}
             autoComplete="email"
             onBlur={() => setTouched(t => ({...t, email: true}))}
             error={emailErr}/>

      <Field label={t.passwordLabel} type={showPw ? "text" : "password"}
             value={pw} onChange={setPw}
             placeholder={t.passwordPlaceholder}
             autoComplete="current-password"
             onBlur={() => setTouched(t => ({...t, pw: true}))}
             error={pwErr}
             trailing={<PassToggle shown={showPw} onToggle={() => setShowPw(s => !s)}/>}/>

      <div className="form-meta">
        <a href="#" className="link-quiet" onClick={(e) => e.preventDefault()}>
          {t.forgot}
        </a>
      </div>

      <button type="submit" className="btn btn-primary btn-block"
              disabled={!formValid}>
        {t.cta_login}
      </button>
    </form>
  );
}

// ── Register form ────────────────────────────────────────────────────────────
function RegisterForm({ t, onSubmit }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [pw, setPw] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [showCfm, setShowCfm] = React.useState(false);
  const [lang, setLang] = React.useState("en");
  const [touched, setTouched] = React.useState({});

  const nameValid = name.trim().length >= 2;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const pwValid = pw.length >= 8;
  const confirmValid = confirm.length > 0 && confirm === pw;

  const errs = {
    name: touched.name && !nameValid ? t.err_name : null,
    email: touched.email && !emailValid ? t.err_email : null,
    pw: touched.pw && !pwValid ? t.err_password : null,
    confirm: touched.confirm && !confirmValid ? t.err_confirm : null
  };

  const formValid = nameValid && emailValid && pwValid && confirmValid;

  return (
    <form className="auth-form" onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(); }}>
      <Field label={t.nameLabel}
             value={name} onChange={setName}
             placeholder={t.namePlaceholder}
             autoComplete="name"
             onBlur={() => setTouched(t => ({...t, name: true}))}
             error={errs.name}/>

      <Field label={t.emailLabel} type="email"
             value={email} onChange={setEmail}
             placeholder={t.emailPlaceholder}
             autoComplete="email"
             onBlur={() => setTouched(t => ({...t, email: true}))}
             error={errs.email}/>

      <Field label={t.passwordLabel} type={showPw ? "text" : "password"}
             value={pw} onChange={setPw}
             placeholder={t.passwordPlaceholder}
             autoComplete="new-password"
             onBlur={() => setTouched(t => ({...t, pw: true}))}
             error={errs.pw}
             trailing={<PassToggle shown={showPw} onToggle={() => setShowPw(s => !s)}/>}/>

      <Field label={t.confirmLabel} type={showCfm ? "text" : "password"}
             value={confirm} onChange={setConfirm}
             placeholder={t.passwordPlaceholder}
             autoComplete="new-password"
             onBlur={() => setTouched(t => ({...t, confirm: true}))}
             error={errs.confirm}
             trailing={<PassToggle shown={showCfm} onToggle={() => setShowCfm(s => !s)}/>}/>

      <div className="field">
        <label htmlFor="lang-select">{t.langLabel}</label>
        <div className="field-control">
          <select id="lang-select" value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
          <div className="field-trailing" aria-hidden="true" style={{pointerEvents: "none"}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-primary btn-block"
              disabled={!formValid}>
        {t.cta_register}
      </button>
    </form>
  );
}

// ── Auth screen shell ────────────────────────────────────────────────────────
function AuthScreen() {
  const initial = (typeof window !== "undefined" && window.location.hash === "#register") ? "register" : "login";
  const [tab, setTab] = React.useState(initial);
  const t = AUTH_STRINGS;

  React.useEffect(() => {
    document.documentElement.dir = "ltr";
    document.documentElement.lang = "en";
    document.documentElement.setAttribute("data-palette", "dusk");
  }, []);

  const onSubmit = () => {
    // In the prototype this would route to the dashboard.
    window.location.href = "Dashboard.html";
  };

  return (
    <div className="auth-stage">
      {/* Left — vignette */}
      <aside className="auth-left">
        <AuthVignette/>
        <div className="auth-left-overlay">
          <div className="brand brand-stacked">
            <span className="dot"/>
            <span className="mark">Rukn</span>
            <span className="mark-ar">رُكن</span>
          </div>
          <p className="auth-pullquote">
            <em>"Your daily life is your temple and your religion."</em>
            <span className="auth-pullquote-cite">— Khalil Gibran</span>
          </p>
        </div>
      </aside>

      {/* Right — form */}
      <main className="auth-right">
        <a href="Homepage.html" className="auth-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          {t.backHome}
        </a>

        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title display">
              {tab === "login" ? t.loginTitle : t.registerTitle}
            </h1>
            <p className="auth-sub">
              {tab === "login" ? t.loginSub : t.registerSub}
            </p>
          </div>

          <div className="auth-tabs" role="tablist">
            <button role="tab" aria-selected={tab === "login"}
                    className={`auth-tab${tab === "login" ? " active" : ""}`}
                    onClick={() => setTab("login")}>{t.tabLogin}</button>
            <button role="tab" aria-selected={tab === "register"}
                    className={`auth-tab${tab === "register" ? " active" : ""}`}
                    onClick={() => setTab("register")}>{t.tabRegister}</button>
            <span className="auth-tab-indicator" data-pos={tab}/>
          </div>

          {tab === "login"
            ? <LoginForm t={t} onSubmit={onSubmit}/>
            : <RegisterForm t={t} onSubmit={onSubmit}/>}

          <div className="auth-switch">
            {tab === "login"
              ? <>{t.needAccount} <button className="link-quiet" onClick={() => setTab("register")}>{t.switchToRegister}</button></>
              : <>{t.alreadyHave} <button className="link-quiet" onClick={() => setTab("login")}>{t.switchToLogin}</button></>}
          </div>
        </div>

        <div className="auth-foot">
          <div className="lang-pill">
            <button className="active">EN</button>
            <span/>
            <button>AR</button>
          </div>
        </div>
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AuthScreen/>);
