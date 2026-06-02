// app.jsx
// Rukn — Homepage v2. Click-to-open windows from a bottom dock.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#3F2A4A", "#C66B3D", "#F2B36A"],
  "scene": "maghrib"
} /*EDITMODE-END*/;

const PALETTE_OPTIONS = [
{ id: "dusk", label: "Desert Dusk", colors: ["#3F2A4A", "#C66B3D", "#F2B36A"] },
{ id: "olive", label: "Olive Grove", colors: ["#2E3A2E", "#8A7A3F", "#D9B86A"] },
{ id: "candlelight", label: "Candlelight", colors: ["#1F140C", "#9C4F1E", "#F2C77A"] },
{ id: "rose", label: "Rose Maghrib", colors: ["#2A1830", "#B8466A", "#F0A6A0"] }];


const SCENE_OPTIONS = ["maghrib", "olive", "library"];

const paletteIdFor = (arr) => {
  if (!Array.isArray(arr)) return "dusk";
  const match = PALETTE_OPTIONS.find((p) => p.colors[0] === arr[0]);
  return match ? match.id : "dusk";
};

// Default positions for each window — each has a "home" on the canvas so
// when one or many are open the composition still reads thoughtfully.
const WINDOW_POSITIONS = {
  sounds: { x: 80, y: "50%", width: 280, anchor: "left-middle" },
  timer: { x: "auto", y: "50%", width: 196, anchor: "right-middle" },
  scenes: { x: "50%", y: "auto", width: 260, anchor: "bottom-center" }
};

// ── Drifting motes ───────────────────────────────────────────────────────────
function Motes({ n = 22 }) {
  const motes = React.useMemo(() => Array.from({ length: n }).map(() => ({
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 40}s`,
    duration: `${22 + Math.random() * 22}s`,
    scale: 0.5 + Math.random() * 1.3,
    opacity: 0.3 + Math.random() * 0.6
  })), [n]);
  return (
    <div className="motes" aria-hidden="true">
      {motes.map((m, i) =>
      <span key={i} className="mote" style={{
        left: m.left,
        animationDelay: m.delay,
        animationDuration: m.duration,
        transform: `scale(${m.scale})`,
        opacity: m.opacity
      }} />
      )}
    </div>);

}

// ── Scene layer (crossfade) ───────────────────────────────────────────────────
function SceneLayer({ scene }) {
  return (
    <>
      <div className="scene-layer" style={{ opacity: scene === "maghrib" ? 1 : 0 }}>
        <SceneMaghrib />
      </div>
      <div className="scene-layer" style={{ opacity: scene === "olive" ? 1 : 0 }}>
        <SceneOliveGrove />
      </div>
      <div className="scene-layer" style={{ opacity: scene === "library" ? 1 : 0 }}>
        <SceneLibrary />
      </div>
    </>);

}

// ── Floating window with thoughtful default position ─────────────────────────
function Window({ id, onClose, children }) {
  const pos = WINDOW_POSITIONS[id];
  const outerStyle = { width: pos.width };
  if (pos.anchor === "left-middle") {
    outerStyle.left = pos.x;
    outerStyle.top = pos.y;
    outerStyle.transform = "translateY(-50%)";
  } else if (pos.anchor === "right-middle") {
    outerStyle.right = 80;
    outerStyle.top = pos.y;
    outerStyle.transform = "translateY(-50%)";
  } else if (pos.anchor === "bottom-center") {
    outerStyle.left = "50%";
    outerStyle.bottom = 100;
    outerStyle.transform = "translateX(-50%)";
  }

  return (
    <div className="window" data-window={id} style={outerStyle}>
      <div className="window-inner glass">
        <button className="window-close" aria-label="Close" onClick={onClose}>
          <IClose size={12} />
        </button>
        {children}
      </div>
    </div>);

}

// ── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [open, setOpen] = React.useState(() => new Set(["scenes"])); // start with scenes peeking
  const [overlay, setOverlay] = React.useState(null);
  const strings = STRINGS.en;

  // Palette → root attr
  const paletteId = paletteIdFor(t.palette);
  React.useEffect(() => {
    document.documentElement.setAttribute("data-palette", paletteId);
  }, [paletteId]);

  // Force LTR (AR removed for v2)
  React.useEffect(() => {
    document.documentElement.dir = "ltr";
    document.documentElement.lang = "en";
  }, []);

  const toggle = React.useCallback((id) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);else
      next.add(id);
      return next;
    });
  }, []);

  // "Begin" → Create account tab; "Log in" → Log in tab.
  // The auth screen reads window.location.hash on mount to pick the initial tab.
  const onSignup = () => { window.location.href = "Login.html#register"; };
  const onLogin  = () => { window.location.href = "Login.html"; };

  return (
    <>
      <div id="stage">
        <SceneLayer scene={t.scene} />
        <Motes />
        <div className="grain" />
        <div className="vignette" />

        <TopBar t={strings} onSignup={onSignup} onLogin={onLogin} />

        <div className="windows">
          {open.has("sounds") &&
          <Window id="sounds" onClose={() => toggle("sounds")}>
              <SoundsWidget t={strings} />
            </Window>
          }
          {open.has("timer") &&
          <Window id="timer" onClose={() => toggle("timer")}>
              <TimerWidget t={strings} />
            </Window>
          }
          {open.has("scenes") &&
          <Window id="scenes" onClose={() => toggle("scenes")}>
              <ScenesWidget t={strings}
            scene={t.scene}
            setScene={(s) => setTweak("scene", s)} />
            </Window>
          }
        </div>

        <Dock open={open} toggle={toggle} t={strings} />

        <SignupOverlay open={!!overlay} t={strings}
        onClose={() => setOverlay(null)}
        onSignup={() => { window.location.href = "Login.html#register"; }}
        onLogin={() => { window.location.href = "Login.html"; }} />
      </div>

      <TweaksPanel>
        <TweakSection label="Mood" />
        <TweakColor label="Palette"
        value={t.palette}
        options={PALETTE_OPTIONS.map((p) => p.colors)}
        onChange={(v) => setTweak("palette", v)} />

        <TweakSection label="Scene" />
        <TweakRadio label="Background"
        value={t.scene}
        options={SCENE_OPTIONS}
        onChange={(v) => setTweak("scene", v)} />
      </TweaksPanel>
    </>);

}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);