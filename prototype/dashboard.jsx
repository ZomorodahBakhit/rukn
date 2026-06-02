// dashboard.jsx
// Rukn — Dashboard (Free Registered User). Same widget engine as Homepage,
// loaded with the user's data + sidebar nav + locked widgets + Try Premium pill.

const DASH_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#3F2A4A", "#C66B3D", "#F2B36A"],
  "scene": "maghrib",
  "layout": "A"
}/*EDITMODE-END*/;

const D_PALETTE_OPTIONS = [
  { id: "dusk",        label: "Desert Dusk",  colors: ["#3F2A4A", "#C66B3D", "#F2B36A"] },
  { id: "olive",       label: "Olive Grove",  colors: ["#2E3A2E", "#8A7A3F", "#D9B86A"] },
  { id: "candlelight", label: "Candlelight",  colors: ["#1F140C", "#9C4F1E", "#F2C77A"] },
  { id: "rose",        label: "Rose Maghrib", colors: ["#2A1830", "#B8466A", "#F0A6A0"] }
];

const D_SCENE_OPTIONS = ["maghrib", "olive", "library"];

const dPaletteIdFor = (arr) => {
  if (!Array.isArray(arr)) return "dusk";
  const match = D_PALETTE_OPTIONS.find(p => p.colors[0] === arr[0]);
  return match ? match.id : "dusk";
};

// ── Window positions for the dashboard layout
// Layout A (calm asymmetric reading-desk arrangement)
// Layout B (mirrored / regrouped — same widgets, different positions)
const DASH_LAYOUTS = {
  A: {
    continue:  { left: 120,            top: 132,             width: 360, anchor: "tl" },
    journal:   { right: 64,            top: 132,             width: 340, anchor: "tr" },
    stats:     { left: 120,            bottom: 120,          width: 280, anchor: "bl" },
    sounds:    { left: "50%",          top: "50%",           width: 280, anchor: "center" },
    timer:     { right: 64,            top: "auto",          bottom: 140, width: 196, anchor: "br" },
    scenes:    { left: "50%",          bottom: 100,          width: 260, anchor: "bc" },
    custom:    { right: 64,            top: "50%",           width: 260, anchor: "right-middle" },
    audio:     { left: 120,            top: "50%",           width: 280, anchor: "left-middle" }
  },
  B: {
    continue:  { right: 64,            top: 132,             width: 360, anchor: "tr" },
    journal:   { left: 120,            top: 132,             width: 340, anchor: "tl" },
    stats:     { right: 64,            bottom: 120,          width: 280, anchor: "br" },
    sounds:    { left: 120,            bottom: 120,          width: 280, anchor: "bl" },
    timer:     { left: 120,            top: "auto",          bottom: 140, width: 196, anchor: "bl" },
    scenes:    { left: "50%",          bottom: 100,          width: 260, anchor: "bc" },
    custom:    { left: 120,            top: "50%",           width: 260, anchor: "left-middle" },
    audio:     { right: 64,            top: "50%",           width: 280, anchor: "right-middle" }
  }
};

// ── Floating window wrapper (positioned via layout map) ──────────────────────
function DashWindow({ id, layout, onClose, children }) {
  const pos = DASH_LAYOUTS[layout][id];
  const s = { width: pos.width };
  if (pos.left  != null) s.left  = pos.left;
  if (pos.right != null) s.right = pos.right;
  if (pos.top   != null) s.top   = pos.top;
  if (pos.bottom!= null) s.bottom= pos.bottom;
  if (pos.anchor === "center")        s.transform = "translate(-50%, -50%)";
  if (pos.anchor === "bc")            s.transform = "translateX(-50%)";
  if (pos.anchor === "left-middle"
   || pos.anchor === "right-middle")  s.transform = "translateY(-50%)";

  return (
    <div className="window" data-window={id} style={s}>
      <div className="window-inner glass">
        <button className="window-close" aria-label="Close" onClick={onClose}>
          <IClose size={12}/>
        </button>
        {children}
      </div>
    </div>
  );
}

// ── Scene + motes (re-used from Homepage) ────────────────────────────────────
function DashSceneLayer({ scene }) {
  return (
    <>
      <div className="scene-layer" style={{ opacity: scene === "maghrib" ? 1 : 0 }}><SceneMaghrib/></div>
      <div className="scene-layer" style={{ opacity: scene === "olive"   ? 1 : 0 }}><SceneOliveGrove/></div>
      <div className="scene-layer" style={{ opacity: scene === "library" ? 1 : 0 }}><SceneLibrary/></div>
    </>
  );
}

function DashMotes({ n = 18 }) {
  const motes = React.useMemo(() => Array.from({ length: n }).map(() => ({
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 40}s`,
    duration: `${22 + Math.random() * 22}s`,
    scale: 0.5 + Math.random() * 1.2,
    opacity: 0.3 + Math.random() * 0.55
  })), [n]);
  return (
    <div className="motes" aria-hidden="true">
      {motes.map((m, i) =>
        <span key={i} className="mote" style={{
          left: m.left, animationDelay: m.delay, animationDuration: m.duration,
          transform: `scale(${m.scale})`, opacity: m.opacity
        }}/>
      )}
    </div>
  );
}

// ── Dock for the dashboard — extended with dashboard widgets ────────────────
function DashDock({ open, toggle, onLockedOpen, t }) {
  return (
    <div className="dock">
      <DockButton label="Continue" icon={<IBook size={17}/>}
                  active={open.has("continue")} onClick={() => toggle("continue")}/>
      <DockButton label="Journal" icon={<IFeather size={17}/>}
                  active={open.has("journal")} onClick={() => toggle("journal")}/>
      <DockButton label="Stats" icon={<IClock size={17}/>}
                  active={open.has("stats")} onClick={() => toggle("stats")}/>
      <div className="dock-divider"/>
      <DockButton label="Ambient" icon={<IRain size={17}/>}
                  active={open.has("sounds")} onClick={() => toggle("sounds")}/>
      <DockButton label="Focus" icon={<IClock size={17}/>}
                  active={open.has("timer")} onClick={() => toggle("timer")}/>
      <DockButton label="Scene" icon={<IPalette size={17}/>}
                  active={open.has("scenes")} onClick={() => toggle("scenes")}/>
      <div className="dock-divider"/>
      <DockButton label="Customization" icon={<ILayers size={17}/>}
                  active={false} onClick={onLockedOpen}/>
      <DockButton label="Audiobooks" icon={<IHeadphones size={17}/>}
                  active={false} onClick={onLockedOpen}/>
    </div>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
function DashboardApp() {
  const [t, setTweak] = useTweaks(DASH_TWEAK_DEFAULTS);
  const tStr = { ...STRINGS.en, ...DASH_STRINGS };

  // The widgets that appear when the page loads — Continue, Journal, Stats.
  // Customization and Audiobooks open via the upgrade modal, not as floating panes.
  const [open, setOpen] = React.useState(
    () => new Set(["continue", "journal", "stats"])
  );
  const [upgradeOpen, setUpgradeOpen] = React.useState(false);

  // Palette → root attr
  const paletteId = dPaletteIdFor(t.palette);
  React.useEffect(() => {
    document.documentElement.setAttribute("data-palette", paletteId);
  }, [paletteId]);

  React.useEffect(() => {
    document.documentElement.dir = "ltr";
    document.documentElement.lang = "en";
  }, []);

  const toggle = (id) => {
    setOpen(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const cycleLayout = () =>
    setTweak("layout", t.layout === "A" ? "B" : "A");

  const goLibrary = () => { window.location.href = "Library.html"; };
  const goReader  = () => { window.location.href = "Reader.html"; };
  const goJournal = () => { window.location.href = "Journal.html"; };

  return (
    <>
      <div id="stage" className="stage-dashboard" data-screen-label="03 Dashboard (Free)">
        <DashSceneLayer scene={t.scene}/>
        <DashMotes/>
        <div className="grain"/>
        <div className="vignette"/>

        <Sidebar active="home" t={tStr}/>

        <DashboardTopBar t={tStr}
                         scene={t.scene}
                         setScene={(s) => setTweak("scene", s)}
                         onRearrange={cycleLayout}/>

        <div className="windows">
          {open.has("continue") &&
            <DashWindow id="continue" layout={t.layout} onClose={() => toggle("continue")}>
              <ContinueReadingWidget t={tStr} onResume={goReader}/>
            </DashWindow>}
          {open.has("journal") &&
            <DashWindow id="journal" layout={t.layout} onClose={() => toggle("journal")}>
              <TodayJournalWidget t={tStr} onSave={goJournal}/>
            </DashWindow>}
          {open.has("stats") &&
            <DashWindow id="stats" layout={t.layout} onClose={() => toggle("stats")}>
              <ReadingStatsWidget t={tStr}/>
            </DashWindow>}
          {open.has("sounds") &&
            <DashWindow id="sounds" layout={t.layout} onClose={() => toggle("sounds")}>
              <SoundsWidget t={tStr}/>
            </DashWindow>}
          {open.has("timer") &&
            <DashWindow id="timer" layout={t.layout} onClose={() => toggle("timer")}>
              <TimerWidget t={tStr}/>
            </DashWindow>}
          {open.has("scenes") &&
            <DashWindow id="scenes" layout={t.layout} onClose={() => toggle("scenes")}>
              <ScenesWidget t={tStr}
                            scene={t.scene}
                            setScene={(s) => setTweak("scene", s)}/>
            </DashWindow>}
        </div>

        <DashDock open={open} toggle={toggle}
                  onLockedOpen={() => setUpgradeOpen(true)}
                  t={tStr}/>

        <TryPremiumPill t={tStr} onClick={() => setUpgradeOpen(true)}/>

        <UpgradeModal open={upgradeOpen}
                      t={tStr}
                      onClose={() => setUpgradeOpen(false)}
                      onStart={() => { setUpgradeOpen(false); /* would route to premium */ }}/>
      </div>

      <TweaksPanel>
        <TweakSection label="Mood"/>
        <TweakColor label="Palette"
                    value={t.palette}
                    options={D_PALETTE_OPTIONS.map(p => p.colors)}
                    onChange={(v) => setTweak("palette", v)}/>

        <TweakSection label="Scene"/>
        <TweakRadio label="Background"
                    value={t.scene}
                    options={D_SCENE_OPTIONS}
                    onChange={(v) => setTweak("scene", v)}/>

        <TweakSection label="Layout"/>
        <TweakRadio label="Arrangement"
                    value={t.layout}
                    options={["A", "B"]}
                    onChange={(v) => setTweak("layout", v)}/>
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<DashboardApp/>);
