// widgets.jsx
// Rukn homepage — compact widget windows + bottom dock.
// Use React.* directly to avoid global-scope name collisions with other Babel scripts

// ── i18n strings (EN only for v2 — AR toggle removed) ────────────────────────
const STRINGS = {
  en: {
    sounds: "Ambient",
    soundChips: [
      { id: "rain",     label: "Rain"      },
      { id: "fire",     label: "Fire" },
      { id: "cafe",     label: "Café"      },
      { id: "lofi",     label: "Lo-fi"     },
      { id: "forest",   label: "Forest"    }
    ],
    focus: "Focus",
    scenes: "Scene",
    sceneMaghrib: "Maghrib",
    sceneOlive: "Olive",
    sceneLibrary: "Library",
    logIn: "Log in",
    getStarted: "Begin",
    overlayTitle: "Pull up a chair.",
    overlayBody: "Create a free account to keep reading — your highlights, notes, and ambience all save automatically.",
    overlayCreate: "Create account",
    overlayLogin: "I already have one",
    rukn: "Rukn",
    ruknAr: "رُكن",
    dockSounds: "Ambient",
    dockTimer: "Focus",
    dockScenes: "Scene"
  }
};

// ── Sound chips ───────────────────────────────────────────────────────────────
function SoundIcon({ id, ...p }) {
  switch (id) {
    case "rain":   return <IRain {...p}/>;
    case "fire":   return <IFire {...p}/>;
    case "cafe":   return <ICafe {...p}/>;
    case "lofi":   return <ILofi {...p}/>;
    case "forest": return <IForest {...p}/>;
    default: return null;
  }
}

function SoundsWidget({ t }) {
  const [active, setActive] = React.useState({ rain: 0.65 });

  const toggle = (id) => {
    setActive(prev => {
      const next = { ...prev };
      if (id in next) delete next[id];
      else next[id] = 0.6;
      return next;
    });
  };

  const onVolDrag = (id, e) => {
    e.stopPropagation();
    const track = e.currentTarget;
    const rect = track.getBoundingClientRect();
    const move = (clientX) => {
      let pct = (clientX - rect.left) / rect.width;
      pct = Math.max(0, Math.min(1, pct));
      setActive(prev => ({ ...prev, [id]: pct }));
    };
    move(e.clientX);
    const onMove = (ev) => move(ev.clientX);
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <>
      <div className="w-eyebrow">{t.sounds}</div>
      <div className="sound-grid">
        {t.soundChips.map(c => {
          const isActive = c.id in active;
          const vol = active[c.id] ?? 0.6;
          return (
            <div key={c.id}
                 className={`sound-chip${isActive ? " active" : ""}`}
                 onClick={() => toggle(c.id)}>
              <div className="viz"><span/><span/><span/></div>
              <SoundIcon id={c.id} size={16}/>
              <span>{c.label}</span>
              <div className="vol"
                   onPointerDown={(e) => isActive && onVolDrag(c.id, e)}>
                <div className="vol-fill" style={{ width: `${vol * 100}%` }}/>
                <div className="vol-thumb" style={{ left: `${vol * 100}%` }}/>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── Focus Timer ───────────────────────────────────────────────────────────────
function TimerWidget({ t }) {
  const TOTAL = 25 * 60;
  const [remaining, setRemaining] = React.useState(TOTAL);
  const [running, setRunning] = React.useState(false);

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { setRunning(false); return TOTAL; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const fmt = (n) => String(n).padStart(2, "0");
  const pct = 1 - remaining / TOTAL;

  return (
    <>
      <div className="w-eyebrow">{t.focus}</div>
      <svg className="timer-arc" viewBox="0 0 140 14" width="100%" height="10"
           style={{ marginBottom: 0 }}>
        <line x1="6" y1="7" x2="134" y2="7" stroke="var(--glass-stroke)" strokeWidth="1.5"/>
        <line x1="6" y1="7" x2={6 + 128 * pct} y2="7"
              stroke="var(--sky-sun)" strokeWidth="2" strokeLinecap="round"/>
        <circle cx={6 + 128 * pct} cy="7" r="2.5" fill="var(--paper)"/>
      </svg>
      <div className={`timer-display${running ? " running" : ""}`}>
        {fmt(m)}:{fmt(s)}
      </div>
      <div className="timer-controls">
        <button className="t-btn" title="Reset"
                onClick={() => { setRunning(false); setRemaining(TOTAL); }}>
          <IReset size={13}/>
        </button>
        <button className="t-btn primary" title={running ? "Pause" : "Start"}
                onClick={() => setRunning(r => !r)}>
          {running ? <IPause size={13}/> : <IPlay size={13}/>}
        </button>
        <button className="t-btn" title="Skip"
                onClick={() => { setRemaining(TOTAL); setRunning(false); }}>
          <ISkip size={13}/>
        </button>
      </div>
    </>
  );
}

// ── Scene Selector ────────────────────────────────────────────────────────────
function ScenesWidget({ t, scene, setScene }) {
  const items = [
    { id: "maghrib", label: t.sceneMaghrib },
    { id: "olive",   label: t.sceneOlive },
    { id: "library", label: t.sceneLibrary }
  ];
  return (
    <>
      <div className="w-eyebrow">{t.scenes}</div>
      <div className="scene-row">
        {items.map(s => (
          <div key={s.id}
               className={`scene-thumb${scene === s.id ? " active" : ""}`}
               onClick={() => setScene(s.id)}
               title={s.label}>
            <SceneThumb id={s.id}/>
            <span className="label">{s.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Top bar ───────────────────────────────────────────────────────────────────
function TopBar({ t, onSignup, onLogin }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="dot"/>
        <span className="mark">{t.rukn}</span>
        <span className="mark-ar">{t.ruknAr}</span>
      </div>
      <div className="top-actions">
        <button className="btn btn-ghost" onClick={onLogin}>{t.logIn}</button>
        <button className="btn btn-primary" onClick={onSignup}>{t.getStarted}</button>
      </div>
    </header>
  );
}

// ── Window frame (wraps content with × close) ────────────────────────────────
function WindowFrame({ id, x, y, width, onClose, children }) {
  // x/y are CSS positioning values (string with px/%)
  return (
    <div className="window glass"
         data-window={id}
         style={{ left: x, top: y, width }}>
      <button className="window-close" aria-label="Close" onClick={onClose}>
        <IClose size={12}/>
      </button>
      {children}
    </div>
  );
}

// ── Dock ─────────────────────────────────────────────────────────────────────
function DockButton({ icon, label, active, onClick }) {
  return (
    <button className={`dock-btn${active ? " active" : ""}`}
            onClick={onClick}
            aria-label={label}>
      {icon}
      <span className="indicator"/>
      <span className="dock-label">{label}</span>
    </button>
  );
}

function Dock({ open, toggle, t }) {
  return (
    <div className="dock">
      <DockButton label={t.dockSounds}
                  icon={<IRain size={18}/>}
                  active={open.has("sounds")}
                  onClick={() => toggle("sounds")}/>
      <DockButton label={t.dockTimer}
                  icon={<IClock size={17}/>}
                  active={open.has("timer")}
                  onClick={() => toggle("timer")}/>
      <div className="dock-divider"/>
      <DockButton label={t.dockScenes}
                  icon={<IPalette size={18}/>}
                  active={open.has("scenes")}
                  onClick={() => toggle("scenes")}/>
    </div>
  );
}

// ── Signup Overlay ────────────────────────────────────────────────────────────
function SignupOverlay({ open, t, onClose, onSignup, onLogin }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className={`overlay${open ? " open" : ""}`} onClick={onClose}>
      <div className="overlay-card" onClick={(e) => e.stopPropagation()}>
        <h3>{t.overlayTitle}</h3>
        <p>{t.overlayBody}</p>
        <div className="actions">
          <button className="btn btn-ghost" onClick={onLogin}>{t.overlayLogin}</button>
          <button className="btn btn-primary" onClick={onSignup}>{t.overlayCreate}</button>
        </div>
      </div>
    </div>
  );
}

// Export
Object.assign(window, {
  STRINGS,
  SoundsWidget, TimerWidget, ScenesWidget,
  TopBar, SignupOverlay,
  Dock, WindowFrame
});
