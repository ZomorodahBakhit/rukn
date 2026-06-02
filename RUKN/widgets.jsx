// widgets.jsx
// Rukn homepage — compact widget windows + bottom dock.
// Use React.* directly to avoid global-scope name collisions with other Babel scripts

// ── i18n strings (EN + AR) ───────────────────────────────────────────────────
const STRINGS = {
  en: {
    sounds: "Ambient",
    soundChips: [
      { id: "rain",     label: "Rain"      },
      { id: "fire",     label: "Fire"      },
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
  },
  ar: {
    sounds: "محيط",
    soundChips: [
      { id: "rain",     label: "مطر"   },
      { id: "fire",     label: "نار"   },
      { id: "cafe",     label: "مقهى"  },
      { id: "lofi",     label: "لوفاي" },
      { id: "forest",   label: "غابة"  }
    ],
    focus: "تركيز",
    scenes: "مشهد",
    sceneMaghrib: "مغرب",
    sceneOlive: "زيتون",
    sceneLibrary: "مكتبة",
    logIn: "تسجيل الدخول",
    getStarted: "ابدأ",
    overlayTitle: "اِسحب كرسيًا.",
    overlayBody: "أنشئ حسابًا مجانيًا لمتابعة القراءة — كل ملاحظاتك ومحيطك يُحفظ تلقائيًا.",
    overlayCreate: "أنشئ حساباً",
    overlayLogin: "لديّ حساب بالفعل",
    rukn: "Rukn",
    ruknAr: "رُكن",
    dockSounds: "محيط",
    dockTimer: "تركيز",
    dockScenes: "مشهد"
  }
};

// ── Tiny global language helper ──────────────────────────────────────────────
// Pages call window.Rukn.lang() to get the active language code, and
// window.Rukn.setLang(code) to flip it. The choice is persisted on the
// backend via update_preference (preferred_lang) and survives reloads.
(function () {
  if (!window.Rukn) window.Rukn = {};
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
    // Persist on the user's account if the API is reachable.
    if (window.RuknAPI) {
      window.RuknAPI.call("update_preference", { preferred_lang: cur === "ar" ? "AR" : "EN" });
    }
    // Notify subscribers (page-level components) so they can re-render.
    window.dispatchEvent(new CustomEvent("rukn:lang", { detail: cur }));
    return cur;
  };
  apply(cur);
})();

// React hook that re-renders the component when window.Rukn.setLang fires.
function useRuknLang() {
  const [lang, set] = React.useState(() => (window.Rukn && window.Rukn.lang()) || "en");
  React.useEffect(() => {
    const handler = (e) => set(e.detail || "en");
    window.addEventListener("rukn:lang", handler);
    return () => window.removeEventListener("rukn:lang", handler);
  }, []);
  return lang;
}

// ── Language pill (EN / AR) — drop this anywhere; it self-syncs ─────────────
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
  // Only one ambient track can play at a time. `active` tracks which chips
  // are visually highlighted and the per-chip volume. The actual playback
  // uses window.RuknAudio (api/audio.js).
  const [active, setActive] = React.useState({});

  // Persist preference + control real playback.
  const persistAndPlay = (id, vol) => {
    if (window.RuknAudio) {
      if (id) { window.RuknAudio.play(id); window.RuknAudio.setVolume(vol); }
      else    { window.RuknAudio.stop(); }
    }
    if (window.RuknAPI) {
      window.RuknAPI.call("update_preference", {
        ambient_sound: id || "",
        sound_volume:  vol,
      });
    }
  };

  const toggle = (id) => {
    setActive(prev => {
      const next = {};                    // exclusive selection
      if (!(id in prev)) {
        next[id] = prev[id] ?? 0.6;
        persistAndPlay(id, next[id]);
      } else {
        persistAndPlay("", 0);
      }
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
      if (window.RuknAudio) window.RuknAudio.setVolume(pct);
    };
    move(e.clientX);
    let pending = null;
    const onMove = (ev) => { move(ev.clientX); pending = ev.clientX; };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      // Persist final volume.
      if (window.RuknAPI) {
        const rect2 = track.getBoundingClientRect();
        const finalPct = Math.max(0, Math.min(1, ((pending ?? rect2.right) - rect2.left) / rect2.width));
        window.RuknAPI.call("update_preference", {
          ambient_sound: id,
          sound_volume:  finalPct,
        });
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  // On mount, hydrate from the user's saved preference (if any).
  React.useEffect(() => {
    if (!window.RuknAPI) return;
    (async () => {
      const r = await window.RuknAPI.call("settings_get");
      if (r.data.ok && r.data.preferences) {
        const sound = r.data.preferences.ambient_sound;
        const vol   = parseFloat(r.data.preferences.sound_volume) || 0.4;
        if (sound) {
          setActive({ [sound]: vol });
          if (window.RuknAudio) { window.RuknAudio.setVolume(vol); window.RuknAudio.play(sound); }
        }
      }
    })();
  }, []);

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
                 onClick={(e) => {
                   // Don't toggle the chip when the click came from inside the volume bar.
                   // The chip stays "on"; only the slider value changed.
                   if (e.target.closest(".vol")) return;
                   toggle(c.id);
                 }}>
              <div className="viz"><span/><span/><span/></div>
              <SoundIcon id={c.id} size={16}/>
              <span>{c.label}</span>
              <div className="vol"
                   onClick={(e) => e.stopPropagation()}
                   onPointerDown={(e) => { e.stopPropagation(); isActive && onVolDrag(c.id, e); }}>
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
const TIMER_PRESETS = [10, 25, 50, 60];  // minutes

function TimerWidget({ t }) {
  const [preset, setPreset]       = React.useState(25);
  const total = preset * 60;
  const [remaining, setRemaining] = React.useState(total);
  const [running, setRunning]     = React.useState(false);

  // When the preset changes, reset the clock (unless the timer is running —
  // we don't want to clobber a session-in-progress).
  React.useEffect(() => {
    if (!running) setRemaining(total);
  }, [preset]);

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { setRunning(false); return total; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, total]);

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const fmt = (n) => String(n).padStart(2, "0");
  const pct = 1 - remaining / total;

  return (
    <>
      <div className="w-eyebrow">{t.focus}</div>

      {/* Preset row */}
      <div style={{
          display: "flex", gap: 4, justifyContent: "center",
          margin: "4px 0 10px", flexWrap: "wrap"
        }}>
        {TIMER_PRESETS.map(p => (
          <button key={p}
                  onClick={() => setPreset(p)}
                  disabled={running && p !== preset}
                  style={{
                    background: preset === p ? "rgba(244,233,212,0.16)" : "rgba(247,239,224,0.04)",
                    border: "1px solid " + (preset === p ? "rgba(244,233,212,0.45)" : "var(--glass-stroke)"),
                    color: preset === p ? "var(--sky-sun)" : "var(--on-glass-dim)",
                    padding: "4px 10px",
                    borderRadius: "var(--r-pill)",
                    font: "600 10px var(--f-sans)",
                    letterSpacing: "0.08em",
                    cursor: running && p !== preset ? "not-allowed" : "pointer",
                    opacity: running && p !== preset ? 0.4 : 1,
                  }}>
            {p}m
          </button>
        ))}
      </div>

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
                onClick={() => { setRunning(false); setRemaining(total); }}>
          <IReset size={13}/>
        </button>
        <button className="t-btn primary" title={running ? "Pause" : "Start"}
                onClick={() => setRunning(r => !r)}>
          {running ? <IPause size={13}/> : <IPlay size={13}/>}
        </button>
        <button className="t-btn" title="Skip"
                onClick={() => { setRemaining(total); setRunning(false); }}>
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
