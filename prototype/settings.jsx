// settings.jsx
// Rukn — Settings (Screen 7). Profile + reading preferences + plan + account.
// Sidebar's gear icon now has a real destination.
// Covers: UPDATE users, UPDATE user_preferences, INSERT paid_users, DELETE users.

const SETTINGS_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#3F2A4A", "#C66B3D", "#F2B36A"]
}/*EDITMODE-END*/;

// ── Icons specific to Settings ───────────────────────────────────────────────
// (ICheck is already provided globally by dashboard-widgets.jsx)
const IUser2 = (p) => (
  <Icon {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></Icon>
);
const ISliders = (p) => (
  <Icon {...p}>
    <line x1="4" y1="6" x2="20" y2="6"/><circle cx="9"  cy="6"  r="2"/>
    <line x1="4" y1="12" x2="20" y2="12"/><circle cx="15" cy="12" r="2"/>
    <line x1="4" y1="18" x2="20" y2="18"/><circle cx="9"  cy="18" r="2"/>
  </Icon>
);
const ISpark = (p) => (
  <Icon {...p}>
    <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>
  </Icon>
);
const IWarn = (p) => (
  <Icon {...p}>
    <path d="M12 3l10 18H2z"/>
    <path d="M12 10v5M12 18v.5"/>
  </Icon>
);

// ── Section nav (sticky left rail) ───────────────────────────────────────────
const SECTIONS = [
  { id: "account",     label: "Account",      icon: IUser2,   sub: "Identity & language" },
  { id: "preferences", label: "Preferences",  icon: ISliders, sub: "Theme, font, sound"  },
  { id: "premium",     label: "Plan",         icon: ISpark,   sub: "Free or Premium"     },
  { id: "danger",      label: "Account data", icon: IWarn,    sub: "Export · Delete"     }
];

function SettingsNav({ active, setActive, tier }) {
  return (
    <nav className="settings-nav" aria-label="Settings sections">
      {SECTIONS.map(s => (
        <button key={s.id}
                className={"settings-nav-item" + (active === s.id ? " active" : "")}
                onClick={() => setActive(s.id)}>
          <span className="settings-nav-icon"><s.icon size={16}/></span>
          <span className="settings-nav-text">
            <span className="settings-nav-label">{s.label}</span>
            <span className="settings-nav-sub">{s.sub}</span>
          </span>
          {s.id === "premium" && tier === "paid" && (
            <span className="settings-nav-badge">Premium</span>
          )}
        </button>
      ))}
    </nav>
  );
}

// ── Account section ──────────────────────────────────────────────────────────
function AccountSection({ user, onChange, onSave, status }) {
  return (
    <section className="settings-card" aria-labelledby="account-heading">
      <header className="settings-card-head">
        <h2 className="display" id="account-heading">Account</h2>
        <p>Your identity — visible to you, used for syncing.</p>
      </header>

      <div className="settings-row">
        <label htmlFor="set-display">Display name</label>
        <input id="set-display" type="text"
               value={user.display_name}
               onChange={(e) => onChange("display_name", e.target.value)}
               maxLength={40}/>
      </div>

      <div className="settings-row two">
        <div>
          <label htmlFor="set-username">Username</label>
          <input id="set-username" type="text"
                 value={user.username}
                 onChange={(e) => onChange("username", e.target.value)}
                 pattern="[a-z0-9_]{3,20}"
                 minLength={3} maxLength={20}/>
          <p className="settings-hint">Lowercase letters, numbers, underscore — 3 to 20.</p>
        </div>
        <div>
          <label htmlFor="set-email">Email</label>
          <input id="set-email" type="email"
                 value={user.email}
                 onChange={(e) => onChange("email", e.target.value)}/>
        </div>
      </div>

      <div className="settings-row">
        <label>Preferred language</label>
        <div className="settings-pillgroup" role="radiogroup" aria-label="Preferred language">
          {[
            ["EN", "English"],
            ["AR", "العربية"]
          ].map(([val, label]) => (
            <button key={val}
                    className={"settings-pill" + (user.preferred_lang === val ? " active" : "")}
                    onClick={() => onChange("preferred_lang", val)}
                    role="radio"
                    aria-checked={user.preferred_lang === val}>
              {user.preferred_lang === val && <ICheck size={12}/>}
              <span>{label}</span>
            </button>
          ))}
        </div>
        <p className="settings-hint">Changes the UI direction and default reading font.</p>
      </div>

      <hr className="settings-divider"/>

      <h3 className="settings-subhead">Change password</h3>
      <div className="settings-row two">
        <div>
          <label htmlFor="set-pw-cur">Current</label>
          <input id="set-pw-cur" type="password" autoComplete="current-password"/>
        </div>
        <div>
          <label htmlFor="set-pw-new">New (min 8)</label>
          <input id="set-pw-new" type="password" autoComplete="new-password" minLength={8}/>
        </div>
      </div>

      <footer className="settings-card-foot">
        {status === "saved" && (
          <span className="settings-status saved"><ICheck size={12}/> Saved</span>
        )}
        <button className="btn btn-primary" onClick={onSave}>Save changes</button>
      </footer>
    </section>
  );
}

// ── Preferences section ──────────────────────────────────────────────────────
function PrefsSection({ prefs, onChange, onSave, status }) {
  const THEMES = [
    { id: "dusk",        label: "Desert Dusk",  swatch: ["#3F2A4A", "#C66B3D", "#F2B36A"] },
    { id: "olive",       label: "Olive Grove",  swatch: ["#2E3A2E", "#8A7A3F", "#D9B86A"] },
    { id: "candlelight", label: "Candlelight",  swatch: ["#1F140C", "#9C4F1E", "#F2C77A"] },
    { id: "rose",        label: "Rose Vellum",  swatch: ["#2A1830", "#B8466A", "#F0A6A0"] }
  ];
  const FONTS = [
    { id: "cormorant",   label: "Cormorant Garamond", sample: "When love beckons" },
    { id: "eb-garamond", label: "EB Garamond",        sample: "When love beckons" },
    { id: "amiri",       label: "Amiri (AR/EN)",      sample: "حين يناديك الحب" },
    { id: "manrope",     label: "Manrope",            sample: "When love beckons" }
  ];
  const SOUNDS = ["rain", "fireplace", "cafe", "lofi", "forest", "none"];

  return (
    <section className="settings-card" aria-labelledby="prefs-heading">
      <header className="settings-card-head">
        <h2 className="display" id="prefs-heading">Reading preferences</h2>
        <p>Make the room yours. These set the defaults — you can always override per-book.</p>
      </header>

      <h3 className="settings-subhead">Theme</h3>
      <div className="settings-theme-grid">
        {THEMES.map(t => (
          <button key={t.id}
                  className={"theme-card" + (prefs.theme === t.id ? " active" : "")}
                  onClick={() => onChange("theme", t.id)}>
            <div className="theme-swatches">
              {t.swatch.map((c, i) => (
                <span key={i} style={{ background: c }}/>
              ))}
            </div>
            <span className="theme-label">{t.label}</span>
            {prefs.theme === t.id && <span className="theme-check"><ICheck size={12}/></span>}
          </button>
        ))}
      </div>

      <h3 className="settings-subhead">Reading font</h3>
      <div className="settings-font-list">
        {FONTS.map(f => (
          <button key={f.id}
                  className={"font-card" + (prefs.font === f.id ? " active" : "")}
                  onClick={() => onChange("font", f.id)}>
            <span className="font-name">{f.label}</span>
            <span className={"font-sample font-" + f.id}>{f.sample}</span>
            {prefs.font === f.id && <span className="font-check"><ICheck size={12}/></span>}
          </button>
        ))}
      </div>

      <h3 className="settings-subhead">Font size</h3>
      <div className="settings-slider-row">
        <span className="slider-min">Aa</span>
        <input type="range" min="13" max="22" value={prefs.font_size}
               onChange={(e) => onChange("font_size", parseInt(e.target.value, 10))}/>
        <span className="slider-max">Aa</span>
        <span className="slider-val">{prefs.font_size}px</span>
      </div>

      <h3 className="settings-subhead">Default ambient sound</h3>
      <div className="settings-pillgroup wrap">
        {SOUNDS.map(s => (
          <button key={s}
                  className={"settings-pill" + (prefs.ambient_sound === s ? " active" : "")}
                  onClick={() => onChange("ambient_sound", s)}>
            {prefs.ambient_sound === s && <ICheck size={12}/>}
            <span>{s === "none" ? "Silent" : s[0].toUpperCase() + s.slice(1)}</span>
          </button>
        ))}
      </div>

      <h3 className="settings-subhead">Default volume</h3>
      <div className="settings-slider-row">
        <span className="slider-min">0</span>
        <input type="range" min="0" max="100"
               value={Math.round(prefs.sound_volume * 100)}
               onChange={(e) => onChange("sound_volume",
                                          parseInt(e.target.value, 10) / 100)}/>
        <span className="slider-max">100</span>
        <span className="slider-val">{Math.round(prefs.sound_volume * 100)}</span>
      </div>

      <footer className="settings-card-foot">
        {status === "saved" && (
          <span className="settings-status saved"><ICheck size={12}/> Saved</span>
        )}
        <button className="btn btn-primary" onClick={onSave}>Save preferences</button>
      </footer>
    </section>
  );
}

// ── Premium section ──────────────────────────────────────────────────────────
function PremiumSection({ tier, onUpgrade, onCancel }) {
  if (tier === "paid") {
    return (
      <section className="settings-card" aria-labelledby="prem-heading">
        <header className="settings-card-head">
          <h2 className="display" id="prem-heading">Plan</h2>
          <p>You're on Premium — thank you for supporting Rukn.</p>
        </header>

        <div className="plan-status-card">
          <div className="plan-status-badge">
            <ISpark size={16}/>
            <span>Premium · Monthly</span>
          </div>
          <p className="plan-status-line">Next renewal · <strong>June 14, 2026</strong> · $4.99</p>
          <p className="plan-status-line">Member since · <strong>May 13, 2026</strong></p>
        </div>

        <h3 className="settings-subhead">Premium features active</h3>
        <ul className="settings-perklist">
          <li><ICheck size={14}/> Full background gallery</li>
          <li><ICheck size={14}/> Audiobooks (12 titles available)</li>
          <li><ICheck size={14}/> Offline downloads</li>
          <li><ICheck size={14}/> Ad-free, always</li>
        </ul>

        <footer className="settings-card-foot">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel subscription</button>
        </footer>
      </section>
    );
  }
  return (
    <section className="settings-card" aria-labelledby="prem-heading">
      <header className="settings-card-head">
        <h2 className="display" id="prem-heading">Plan</h2>
        <p>You're on the free plan. Upgrade for the full cozy experience.</p>
      </header>

      <div className="plan-status-card free">
        <div className="plan-status-badge muted">Free</div>
        <p className="plan-status-line">Everything you need to read, journal, and reflect.</p>
        <p className="plan-status-line settings-hint">
          Premium unlocks audiobooks, the full background gallery, offline reading, and removes ads.
        </p>
      </div>

      <div className="plan-compare">
        <div className="plan-col">
          <h4>Free</h4>
          <ul>
            <li><ICheck size={12}/> Unlimited reading & journaling</li>
            <li><ICheck size={12}/> 3 ambient sounds</li>
            <li><ICheck size={12}/> 1 background scene</li>
            <li className="muted">— Audiobooks</li>
            <li className="muted">— Offline downloads</li>
          </ul>
        </div>
        <div className="plan-col highlight">
          <h4>Premium <span>$4.99/mo</span></h4>
          <ul>
            <li><ICheck size={12}/> Everything in Free</li>
            <li><ICheck size={12}/> All ambient sounds</li>
            <li><ICheck size={12}/> Full background gallery</li>
            <li><ICheck size={12}/> Audiobooks</li>
            <li><ICheck size={12}/> Offline downloads</li>
          </ul>
        </div>
      </div>

      <footer className="settings-card-foot">
        <button className="btn btn-primary big" onClick={onUpgrade}>
          <ISpark size={14}/>
          <span>Start Premium</span>
        </button>
      </footer>
    </section>
  );
}

// ── Danger zone ──────────────────────────────────────────────────────────────
function DangerSection({ onExport, onDelete }) {
  return (
    <section className="settings-card" aria-labelledby="danger-heading">
      <header className="settings-card-head">
        <h2 className="display" id="danger-heading">Account data</h2>
        <p>Take your data with you, or end your time with Rukn entirely.</p>
      </header>

      <div className="danger-row">
        <div>
          <h3 className="settings-subhead no-mt">Export your data</h3>
          <p className="settings-hint">
            A JSON file with every journal entry, highlight, bookmark, and tag you've created. Yours to keep.
          </p>
        </div>
        <button className="btn btn-ghost" onClick={onExport}>Download .json</button>
      </div>

      <hr className="settings-divider"/>

      <div className="danger-row warn">
        <div>
          <h3 className="settings-subhead no-mt">Delete account</h3>
          <p className="settings-hint">
            Removes your user record. All your books, journals, highlights, bookmarks, tags, and collections cascade-delete with it. <strong>This cannot be undone.</strong>
          </p>
        </div>
        <button className="btn btn-danger" onClick={onDelete}>Delete account…</button>
      </div>
    </section>
  );
}

// ── Confirm delete overlay ───────────────────────────────────────────────────
function DeleteAccountConfirm({ open, onCancel, onConfirm }) {
  const [typed, setTyped] = React.useState("");
  if (!open) return null;
  const canDelete = typed.trim().toLowerCase() === "delete my account";

  return (
    <div className="journal-overlay-back" onClick={onCancel}>
      <div className="journal-confirm glass" style={{ maxWidth: 480 }}
           onClick={(e) => e.stopPropagation()}>
        <h3 className="display">Delete your account?</h3>
        <p>
          This will permanently remove your profile and every piece of data tied to it — books you've uploaded, journal entries, highlights, bookmarks, tags, collections, and reading progress. None of it can be recovered.
        </p>
        <label className="settings-confirm-lbl">
          Type <strong>delete my account</strong> to confirm.
        </label>
        <input className="journal-field-input"
               value={typed}
               onChange={(e) => setTyped(e.target.value)}
               placeholder="delete my account"
               autoFocus/>
        <div className="journal-confirm-actions" style={{ marginTop: 16 }}>
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" disabled={!canDelete} onClick={onConfirm}>
            Yes, delete everything
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main app ─────────────────────────────────────────────────────────────────
function SettingsApp() {
  const [t, setTweak] = useTweaks(SETTINGS_TWEAK_DEFAULTS);
  const tStr = { ...STRINGS.en, ...DASH_STRINGS };

  const [active, setActive] = React.useState("account");
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [cancelOpen, setCancelOpen] = React.useState(false);
  const [accountStatus, setAccountStatus] = React.useState(null);
  const [prefsStatus, setPrefsStatus] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const flashToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const [user, setUser] = React.useState({
    display_name: "Layla Amin",
    username: "layla_amin",
    email: "layla@example.com",
    preferred_lang: "EN",
    tier: "free"
  });
  const [prefs, setPrefs] = React.useState({
    theme: "dusk",
    font: "cormorant",
    font_size: 17,
    ambient_sound: "fireplace",
    sound_volume: 0.40
  });

  // Palette → root
  React.useEffect(() => {
    document.documentElement.setAttribute("data-palette",
      prefs.theme === "candlelight" ? "candlelight" :
      prefs.theme === "olive"       ? "olive"       :
      prefs.theme === "rose"        ? "rose"        : "dusk");
  }, [prefs.theme]);

  const onUserChange = (k, v) => {
    setUser(u => ({ ...u, [k]: v }));
    setAccountStatus(null);
  };
  const onPrefsChange = (k, v) => {
    setPrefs(p => ({ ...p, [k]: v }));
    setPrefsStatus(null);
  };
  const onSaveAccount = () => {
    setAccountStatus("saved");
    setTimeout(() => setAccountStatus(null), 2500);
  };
  const onSavePrefs = () => {
    setPrefsStatus("saved");
    setTimeout(() => setPrefsStatus(null), 2500);
  };
  const onUpgrade = () => {
    setUser(u => ({ ...u, tier: "paid" }));
    flashToast("Welcome to Premium ✨");
  };
  const onCancelSub = () => setCancelOpen(true);
  const confirmCancelSub = () => {
    setUser(u => ({ ...u, tier: "free" }));
    setCancelOpen(false);
    flashToast("Subscription cancelled");
  };
  const onExport = () => {
    const blob = new Blob([JSON.stringify({ user, prefs }, null, 2)],
                          { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "rukn-account-export.json";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    flashToast("Export downloaded");
  };
  const onDeleteConfirm = () => {
    setDeleteOpen(false);
    flashToast("Account deleted (demo)");
    setTimeout(() => { window.location.href = "Homepage.html"; }, 1200);
  };

  return (
    <>
      <div className="library-stage" data-screen-label="07 Settings">
        <div className="library-bg"><SceneMaghrib/></div>
        <div className="library-tint"/>
        <div className="grain"/>

        <Sidebar active="settings" t={tStr}/>

        <div className="library-content">
          <header className="lib-topbar">
            <div className="lib-title-row">
              <h1 className="lib-title display">Settings</h1>
              <span className="lib-count">{user.username}</span>
            </div>
            <div className="lib-actions">
              <div className="lang-pill compact">
                <button className={user.preferred_lang === "EN" ? "active" : ""}
                        onClick={() => onUserChange("preferred_lang", "EN")}>EN</button>
                <span/>
                <button className={user.preferred_lang === "AR" ? "active" : ""}
                        onClick={() => onUserChange("preferred_lang", "AR")}>AR</button>
              </div>
            </div>
          </header>

          <div className="settings-layout">
            <SettingsNav active={active} setActive={setActive} tier={user.tier}/>

            <div className="settings-content">
              {active === "account" && (
                <AccountSection user={user}
                                onChange={onUserChange}
                                onSave={onSaveAccount}
                                status={accountStatus}/>
              )}
              {active === "preferences" && (
                <PrefsSection prefs={prefs}
                              onChange={onPrefsChange}
                              onSave={onSavePrefs}
                              status={prefsStatus}/>
              )}
              {active === "premium" && (
                <PremiumSection tier={user.tier}
                                onUpgrade={onUpgrade}
                                onCancel={onCancelSub}/>
              )}
              {active === "danger" && (
                <DangerSection onExport={onExport}
                               onDelete={() => setDeleteOpen(true)}/>
              )}
            </div>
          </div>
        </div>

        <DeleteAccountConfirm open={deleteOpen}
                              onCancel={() => setDeleteOpen(false)}
                              onConfirm={onDeleteConfirm}/>

        {cancelOpen && (
          <div className="journal-overlay-back" onClick={() => setCancelOpen(false)}>
            <div className="journal-confirm glass" onClick={(e) => e.stopPropagation()}>
              <h3 className="display">Cancel Premium?</h3>
              <p>You'll keep Premium features until the end of the current billing period. After that, your account returns to the free plan. You can re-subscribe any time.</p>
              <div className="journal-confirm-actions">
                <button className="btn btn-ghost" onClick={() => setCancelOpen(false)}>Keep Premium</button>
                <button className="btn btn-danger" onClick={confirmCancelSub}>Cancel subscription</button>
              </div>
            </div>
          </div>
        )}

        <div className={`reader-toast${toast ? " visible" : ""}`}><span>{toast}</span></div>
      </div>

      <TweaksPanel>
        <TweakSection label="Mood"/>
        <TweakColor label="Palette"
                    value={t.palette}
                    options={[
                      ["#3F2A4A", "#C66B3D", "#F2B36A"],
                      ["#2E3A2E", "#8A7A3F", "#D9B86A"],
                      ["#1F140C", "#9C4F1E", "#F2C77A"],
                      ["#2A1830", "#B8466A", "#F0A6A0"]
                    ]}
                    onChange={(v) => setTweak("palette", v)}/>
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<SettingsApp/>);
