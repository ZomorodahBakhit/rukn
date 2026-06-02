// dashboard-widgets.jsx
// Rukn — Dashboard widgets: Continue Reading, Today's Journal, Reading Stats,
// Customization (locked), Audiobooks (locked), Try Premium pill, Upgrade Modal,
// Sidebar, Dashboard Top Bar.

// ── Dashboard-only icons ─────────────────────────────────────────────────────
const IHome = (p) => (
  <Icon {...p}>
    <path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>
  </Icon>
);
const ILibrary = (p) => (
  <Icon {...p}>
    <rect x="3" y="4" width="4" height="16" rx="1"/>
    <rect x="9" y="4" width="4" height="16" rx="1"/>
    <path d="M14.5 5l4.5 1-3.5 15-4-1z"/>
  </Icon>
);
const IUser = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>
  </Icon>
);
const ILock = (p) => (
  <Icon {...p}>
    <rect x="5" y="11" width="14" height="10" rx="2"/>
    <path d="M8 11V8a4 4 0 0 1 8 0v3"/>
  </Icon>
);
const IHeadphones = (p) => (
  <Icon {...p}>
    <path d="M4 14v-1a8 8 0 1 1 16 0v1"/>
    <rect x="3" y="14" width="5" height="7" rx="1"/>
    <rect x="16" y="14" width="5" height="7" rx="1"/>
  </Icon>
);
const ILayers = (p) => (
  <Icon {...p}>
    <path d="M12 3l9 5-9 5-9-5z"/>
    <path d="M3 13l9 5 9-5"/>
    <path d="M3 17l9 5 9-5"/>
  </Icon>
);
const IFlame = (p) => (
  <Icon {...p}>
    <path d="M12 3c0 4 4 4 4 8a4 4 0 1 1-8 0c0-2 1-3 2-4-1 3 2 3 2 5a2 2 0 0 0 2-2c0-3-2-4-2-7z"/>
  </Icon>
);
const ICheck = (p) => (
  <Icon {...p}>
    <path d="M5 12l5 5L20 7"/>
  </Icon>
);
const IShuffle = (p) => (
  <Icon {...p}>
    <path d="M16 3h5v5"/><path d="M4 20l17-17"/>
    <path d="M21 16v5h-5"/><path d="M15 15l6 6"/>
    <path d="M4 4l5 5"/>
  </Icon>
);

Object.assign(window, { IHome, ILibrary, IUser, ILock, IHeadphones, ILayers, IFlame, ICheck, IShuffle });

// ── i18n: dashboard strings (EN) ─────────────────────────────────────────────
const DASH_STRINGS = {
  greeting: "Good evening,",
  userFirst: "Layla",
  navHome: "Home",
  navLibrary: "Library",
  navJournal: "Journal",
  navProfile: "Profile",

  continueReading: "Continue reading",
  bookTitle: "The Prophet",
  bookAuthor: "Khalil Gibran",
  chapter: "Chapter 3 · On Love",
  pages: "47 / 96",
  resume: "Resume reading",

  journalTitle: "Today's journal",
  journalPlaceholder: "What's on your mind?",
  moodLabel: "Mood",
  tagsLabel: "Tags",
  save: "Save entry",
  saved: "Saved ✓",

  statsTitle: "This week",
  streak: "day streak",
  pagesRead: "pages read",
  minutes: "minutes reading",

  customTitle: "Customization",
  customSub: "Every background, every theme",
  audioTitle: "Audiobooks",
  audioSub: "Listen instead of read",
  unlock: "Unlock with Premium",

  tryPremium: "Try Premium",

  // Upgrade modal
  upgradeTitle: "Make Rukn fully yours.",
  upgradeSub: "Unlock the full cozy experience.",
  feat1: "Audiobooks", feat1Sub: "Listen on the go",
  feat2: "Full customization", feat2Sub: "Every background, every theme",
  feat3: "Offline downloads", feat3Sub: "Read anywhere, anytime",
  feat4: "Ad-free", feat4Sub: "Pure focus, always",
  planMonthly: "Monthly", planYearly: "Yearly",
  priceMonthly: "$5.99/mo",
  priceYearly: "$49/yr",
  yearlyHint: "Save 32%",
  startPremium: "Start Premium",
  maybeLater: "Maybe later",
  fineprint: "Cancel anytime."
};

// ── Continue Reading widget ──────────────────────────────────────────────────
// `data` is optional. When provided (from /api?action=dashboard) the widget
// renders the user's actual current book + progress. Otherwise it falls back
// to the t.* strings the prototype already had.
function ContinueReadingWidget({ t, onResume, data }) {
  const title    = data ? data.title  : t.bookTitle;
  const author   = data ? data.author : t.bookAuthor;
  const cur      = data ? +data.current_page : 47;
  const total    = data ? +data.total_pages  : 96;
  const pct      = total ? Math.max(0, Math.min(1, cur / total)) : 0;

  // Empty state — no active book yet.
  if (data === null) {
    return (
      <>
        <div className="w-eyebrow">{t.continueReading}</div>
        <p style={{ color: "var(--on-glass-soft)", fontSize: 13, margin: "6px 0 14px",
                    fontFamily: "var(--f-display)", fontStyle: "italic" }}>
          No active book yet. Pick one from your library to begin.
        </p>
        <a href="Library.html" className="btn btn-primary btn-block btn-sm"
           style={{ display: "block", textDecoration: "none", textAlign: "center" }}>
          Open library
        </a>
      </>
    );
  }

  // Deterministic warm-palette swatch derived from the book title.
  const hash = (() => {
    let h = 0;
    for (let i = 0; i < (title || "").length; i++) h = (h * 31 + title.charCodeAt(i)) & 0x7fffffff;
    return h;
  })();
  const palette = [
    ["#8C3F23", "#F2C77A"],   // sienna · amber  (Prophet)
    ["#5C2A3A", "#E8D9BD"],   // wine · cream    (Pride)
    ["#4A5232", "#D9B86A"],   // olive · brass   (Midaq)
    ["#3F2A4A", "#F2B36A"],   // plum · sun
    ["#1F140C", "#F2C77A"],   // candle
  ];
  const [bg, fg] = palette[hash % palette.length];
  const initial = (title || "?").trim().charAt(0).toUpperCase();
  const authorShort = (author || "").split(" ").pop().toUpperCase();

  return (
    <>
      <div className="w-eyebrow">{t.continueReading}</div>
      <div className="cr-row">
        <div className="cr-cover">
          <svg viewBox="0 0 80 110" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <rect width="80" height="110" fill={bg}/>
            <rect x="6" y="10" width="68" height="90" fill="none" stroke={fg} strokeWidth="0.8" opacity="0.6"/>
            <text x="40" y="68" textAnchor="middle" fill="#F4E9D4"
                  fontFamily="Cormorant Garamond, serif" fontWeight="500"
                  fontSize="46" letterSpacing="-1">{initial}</text>
            <line x1="20" y1="80" x2="60" y2="80" stroke={fg} strokeWidth="0.6" opacity="0.7"/>
            <text x="40" y="93" textAnchor="middle" fill={fg}
                  fontFamily="Manrope, sans-serif" fontSize="5" letterSpacing="1.5">
              {authorShort.slice(0, 12)}
            </text>
          </svg>
        </div>
        <div className="cr-meta">
          <div className="cr-title display">{title}</div>
          <div className="cr-author">{author}</div>
          <div className="cr-chapter">Page {cur} of {total}</div>
          <div className="cr-progress">
            <div className="cr-progress-bar">
              <div className="cr-progress-fill" style={{ width: `${pct * 100}%` }}/>
            </div>
            <div className="cr-progress-text">{Math.round(pct * 100)}%</div>
          </div>
        </div>
      </div>
      <button className="btn btn-primary btn-block btn-sm" onClick={onResume}>
        {t.resume}
      </button>
    </>
  );
}

// ── Today's Journal widget ───────────────────────────────────────────────────
const MOODS = [
  { id: "moon",  glyph: "🌙" },
  { id: "tea",   glyph: "☕" },
  { id: "rain",  glyph: "🌧" },
  { id: "spark", glyph: "✨" },
  { id: "leaf",  glyph: "🍂" }
];
const SUGGESTED_TAGS = ["reflection", "gratitude", "questions"];

function TodayJournalWidget({ t, onSave }) {
  const [body, setBody] = React.useState("");
  const [mood, setMood] = React.useState("moon");
  const [tags, setTags] = React.useState(["reflection"]);
  const [saved, setSaved] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");

  const toggleTag = (tag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(x => x !== tag) : [...prev, tag]);
  };

  // Map mood id (moon/tea/rain/spark/leaf) → emoji glyph for the backend.
  const moodGlyph = (id) => (MOODS.find(m => m.id === id) || MOODS[0]).glyph;

  const submit = async () => {
    if (!body.trim() || busy) return;
    setBusy(true);
    setErr("");
    try {
      if (window.RuknAPI) {
        const r = await window.RuknAPI.call("save_entry", {
          content: body.trim(),
          mood:    moodGlyph(mood),
          tags:    tags,
        });
        if (!r.data.ok) {
          setErr(r.data.error || "Save failed");
          setBusy(false);
          return;
        }
      }
      setSaved(true);
      setBody("");
      if (onSave) setTimeout(onSave, 600);
    } catch (e) {
      setErr(String(e && e.message || e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="w-eyebrow">{t.journalTitle}</div>
      <textarea className="j-input"
                rows="2"
                placeholder={t.journalPlaceholder}
                value={body}
                onChange={(e) => { setBody(e.target.value); setSaved(false); }}/>
      <div className="j-row">
        <div className="j-moods" role="radiogroup" aria-label="Mood">
          {MOODS.map(m => (
            <button key={m.id}
                    className={`j-mood${mood === m.id ? " active" : ""}`}
                    onClick={() => setMood(m.id)}
                    aria-label={m.id}>
              {m.glyph}
            </button>
          ))}
        </div>
      </div>
      <div className="j-tags">
        {SUGGESTED_TAGS.map(tag => (
          <button key={tag}
                  className={`tag-chip${tags.includes(tag) ? " active" : ""}`}
                  onClick={() => toggleTag(tag)}>
            <span className="tag-chip-hash">#</span>{tag}
          </button>
        ))}
        <button className="tag-chip add" title="Add tag">+</button>
      </div>
      {err ? (
        <div style={{fontSize: 11.5, color: "#DC8E80", marginBottom: 8}}>
          {err}
        </div>
      ) : null}
      <button className="btn btn-primary btn-block btn-sm"
              onClick={submit}
              disabled={!body.trim() || busy}>
        {busy ? "Saving…" : saved ? t.saved : t.save}
      </button>
    </>
  );
}

// ── Reading Stats widget ─────────────────────────────────────────────────────
// `stats` is optional. When passed in (from /api?action=dashboard) it shows
// the user's real numbers. The 7-day bar is still a derived visualization —
// we map total pages to a daily bar proportional to the user's pages_read
// so a freshly-registered account doesn't show fake activity.
function ReadingStatsWidget({ t, stats }) {
  const streak  = stats ? stats.streak_days    : 7;
  const pages   = stats ? stats.pages_read     : 142;
  // Convert hours back to minutes for the third tile (label already says "minutes")
  const minutes = stats ? Math.round(+stats.hours_read * 60) : 86;

  // Render a calm weekly visualization. With real stats: scale around the
  // total pages so the bars feel proportional. With no stats: keep the
  // hand-tuned shape from the prototype.
  const bars = stats
    ? (() => {
        const total = Math.max(1, +stats.pages_read || 0);
        // Distribute total into 7 buckets with a sinusoidal pacing so it
        // doesn't look uniform. Deterministic seed = total so it's stable.
        const out = [];
        for (let i = 0; i < 7; i++) {
          const wobble = 0.5 + 0.5 * Math.sin(i * 0.9 + (total % 7));
          out.push(Math.max(1, Math.round((total / 7) * (0.4 + wobble))));
        }
        return out;
      })()
    : [3, 5, 2, 6, 4, 7, 3];

  // Normalize bar heights to fit the widget visually.
  const maxBar = Math.max(...bars);
  const barH = (v) => Math.max(8, Math.round((v / maxBar) * 84));

  return (
    <>
      <div className="w-eyebrow">{t.statsTitle}</div>
      <div className="stats-grid">
        <div className="stat">
          <div className="stat-num">
            <span className="stat-flame"><IFlame size={14}/></span>
            {streak}
          </div>
          <div className="stat-label">{t.streak}</div>
        </div>
        <div className="stat">
          <div className="stat-num">{pages}</div>
          <div className="stat-label">{t.pagesRead}</div>
        </div>
        <div className="stat">
          <div className="stat-num">{minutes}</div>
          <div className="stat-label">{t.minutes}</div>
        </div>
      </div>
      <div className="stats-bar">
        {bars.map((v, i) => (
          <div key={i} className="stats-bar-day">
            <div className="stats-bar-fill" style={{ height: `${barH(v)}%` }}/>
            <div className="stats-bar-dot">{"MTWTFSS"[i]}</div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Locked widgets ───────────────────────────────────────────────────────────
function LockedCustomizationWidget({ t, onUpgrade }) {
  return (
    <button className="locked-widget" onClick={onUpgrade}>
      <div className="locked-icon"><ILock size={14}/></div>
      <div className="w-eyebrow" style={{ marginBottom: 8, paddingRight: 0 }}>{t.customTitle}</div>
      <div className="locked-grid">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="locked-thumb" style={{
            background: `linear-gradient(${135 + i * 30}deg, #3A2616, #5A3D1F)`
          }}/>
        ))}
      </div>
      <div className="locked-cta">
        <ILock size={11}/> {t.unlock}
      </div>
    </button>
  );
}

function LockedAudiobookWidget({ t, onUpgrade }) {
  return (
    <button className="locked-widget" onClick={onUpgrade}>
      <div className="locked-icon"><ILock size={14}/></div>
      <div className="w-eyebrow" style={{ marginBottom: 10, paddingRight: 0 }}>{t.audioTitle}</div>
      <div className="audio-preview">
        <div className="audio-play"><IPlay size={14}/></div>
        <div>
          <div className="audio-title">{t.audioSub}</div>
          <div className="audio-wave">
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} style={{ height: `${20 + Math.sin(i * 0.7) * 18 + Math.cos(i) * 8}%` }}/>
            ))}
          </div>
        </div>
      </div>
      <div className="locked-cta">
        <ILock size={11}/> {t.unlock}
      </div>
    </button>
  );
}

// ── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ active = "home", t }) {
  const items = [
    { id: "home",    label: t.navHome,    icon: IHome,    href: "Dashboard.html" },
    { id: "library", label: t.navLibrary, icon: ILibrary, href: "Library.html"   },
    { id: "journal", label: t.navJournal, icon: IFeather, href: "Journal.html"   },
    { id: "settings", label: t.navProfile, icon: IUser,    href: "Settings.html"  }
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="dot"/>
        <span className="sidebar-mark">R</span>
        <span className="sidebar-full">
          <span className="mark">Rukn</span>
          <span className="mark-ar">رُكن</span>
        </span>
      </div>
      <nav className="sidebar-nav">
        {items.map(it => {
          const Ico = it.icon;
          return (
            <a key={it.id} href={it.href}
               className={`sidebar-item${active === it.id ? " active" : ""}`}>
              <span className="sidebar-icon"><Ico size={20}/></span>
              <span className="sidebar-label">{it.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

// ── Dashboard Top Bar ────────────────────────────────────────────────────────
function DashboardTopBar({ t, scene, setScene, onRearrange, onPremium, premium = false, user }) {
  // Derive a display name. Username takes priority; we surface only the first
  // word/segment so "layla_amin" becomes "Layla" — capitalized for the greeting.
  const rawName = (user && (user.username || user.email)) || t.userFirst || "";
  const niceFirst = (() => {
    const head = String(rawName).split(/[_.\s@]/)[0] || "";
    return head ? head.charAt(0).toUpperCase() + head.slice(1) : "";
  })();
  const avatarLetter = niceFirst.charAt(0).toUpperCase() || "?";
  const scenes = [
    { id: "maghrib", label: t.sceneMaghrib || "Maghrib" },
    { id: "olive",   label: t.sceneOlive   || "Olive"   },
    { id: "library", label: t.sceneLibrary || "Library" }
  ];

  return (
    <header className="dash-topbar">
      <div className="dash-greeting">
        <span className="dash-greet-soft">{t.greeting}</span>
        <span className="dash-greet-name display">{niceFirst}.</span>
      </div>

      <div className="dash-topbar-right">
        <div className="topbar-scenes" title="Quick scene switch">
          {scenes.map(s => (
            <button key={s.id}
                    className={`topbar-scene${scene === s.id ? " active" : ""}`}
                    onClick={() => setScene(s.id)}
                    aria-label={s.label}>
              <SceneThumb id={s.id}/>
            </button>
          ))}
        </div>

        <button className="dash-icon-btn" title="Rearrange layout" onClick={onRearrange}>
          <IShuffle size={15}/>
        </button>

        <LangPill/>

        <button className="avatar" title={niceFirst}>
          <span>{avatarLetter}</span>
          {premium && <span className="avatar-badge"><ISparkle size={9}/></span>}
        </button>
      </div>
    </header>
  );
}

// ── Try Premium pill ─────────────────────────────────────────────────────────
function TryPremiumPill({ t, onClick }) {
  return (
    <button className="premium-pill" onClick={onClick}>
      <ISparkle size={13}/>
      <span>{t.tryPremium}</span>
    </button>
  );
}

// ── Upgrade modal ────────────────────────────────────────────────────────────
function UpgradeModal({ open, t, onClose, onStart }) {
  const [plan, setPlan] = React.useState("yearly");

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className={`overlay${open ? " open" : ""}`} onClick={onClose}>
      <div className="upgrade-card" onClick={(e) => e.stopPropagation()}>
        {/* Hero illustration */}
        <div className="upgrade-hero">
          <svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg"
               preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="up-glow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#FFE4B0" stopOpacity="0.7"/>
                <stop offset="60%" stopColor="#E89A4A" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="#E89A4A" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <rect width="320" height="120" fill="#1F140C"/>
            {/* Distant cityscape silhouette */}
            <g fill="#0F0805">
              <rect x="0" y="86" width="320" height="34"/>
              <rect x="40" y="68" width="14" height="20"/>
              <polygon points="40,68 47,58 54,68"/>
              <rect x="78" y="74" width="24" height="14"/>
              <path d="M 78 74 Q 90 60 102 74 Z"/>
              <rect x="130" y="70" width="10" height="18"/>
              <polygon points="130,70 135,62 140,70"/>
              <rect x="160" y="60" width="28" height="28"/>
              <path d="M 160 60 Q 174 46 188 60 Z"/>
              <rect x="216" y="74" width="10" height="14"/>
              <rect x="240" y="68" width="22" height="20"/>
              <rect x="280" y="74" width="10" height="14"/>
            </g>
            <ellipse cx="180" cy="92" rx="120" ry="40" fill="url(#up-glow)"/>
            {/* Stars */}
            <g fill="#F4E9D4" opacity="0.65">
              <circle cx="48"  cy="28" r="1"/>
              <circle cx="92"  cy="14" r="1.2"/>
              <circle cx="160" cy="32" r="0.9"/>
              <circle cx="232" cy="22" r="1.1"/>
              <circle cx="284" cy="40" r="0.8"/>
              {/* Sparkle */}
              <path d="M 80 50 l 1.5 -4.5 l 1.5 4.5 l 4.5 1.5 l -4.5 1.5 l -1.5 4.5 l -1.5 -4.5 l -4.5 -1.5 z" fill="#F2C77A"/>
              <path d="M 244 56 l 1 -3 l 1 3 l 3 1 l -3 1 l -1 3 l -1 -3 l -3 -1 z" fill="#F2C77A"/>
            </g>
          </svg>
        </div>

        <h2 className="upgrade-title display">{t.upgradeTitle}</h2>
        <p className="upgrade-sub">{t.upgradeSub}</p>

        <ul className="upgrade-feats">
          <li><span className="up-feat-icon"><IHeadphones size={14}/></span>
            <div><b>{t.feat1}</b><span>{t.feat1Sub}</span></div>
          </li>
          <li><span className="up-feat-icon"><IPalette size={14}/></span>
            <div><b>{t.feat2}</b><span>{t.feat2Sub}</span></div>
          </li>
          <li><span className="up-feat-icon"><ILayers size={14}/></span>
            <div><b>{t.feat3}</b><span>{t.feat3Sub}</span></div>
          </li>
          <li><span className="up-feat-icon"><ISparkle size={14}/></span>
            <div><b>{t.feat4}</b><span>{t.feat4Sub}</span></div>
          </li>
        </ul>

        <div className="upgrade-plans">
          <button className={`upgrade-plan${plan === "monthly" ? " active" : ""}`}
                  onClick={() => setPlan("monthly")}>
            <span className="up-plan-name">{t.planMonthly}</span>
            <span className="up-plan-price">{t.priceMonthly}</span>
          </button>
          <button className={`upgrade-plan${plan === "yearly" ? " active" : ""}`}
                  onClick={() => setPlan("yearly")}>
            <span className="up-plan-badge">{t.yearlyHint}</span>
            <span className="up-plan-name">{t.planYearly}</span>
            <span className="up-plan-price">{t.priceYearly}</span>
          </button>
        </div>

        <div className="upgrade-actions">
          <button className="btn btn-ghost" onClick={onClose}>{t.maybeLater}</button>
          <button className="btn btn-primary" onClick={() => onStart && onStart(plan)}>
            <ISparkle size={12}/> {t.startPremium}
          </button>
        </div>
        <div className="upgrade-fine">{t.fineprint}</div>
      </div>
    </div>
  );
}

// Export everything to window so dashboard.jsx can use it
Object.assign(window, {
  DASH_STRINGS, MOODS,
  ContinueReadingWidget, TodayJournalWidget, ReadingStatsWidget,
  LockedCustomizationWidget, LockedAudiobookWidget,
  Sidebar, DashboardTopBar, TryPremiumPill, UpgradeModal
});
