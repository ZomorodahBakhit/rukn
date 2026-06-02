// scenes.jsx
// Three SVG scenes for the Rukn homepage. Geometric-flat with subtle gradients,
// designed to read clearly behind floating glass widgets.
//
// Scene 1: "Maghrib Window"  — view through Moorish arch at dusk, minaret silhouettes,
//                              palm + windowsill plant + brass lantern glow.
// Scene 2: "Olive Grove"     — rolling hills, olive trees, distant village, warm dusk.
// Scene 3: "Library Hour"    — interior of a study, bookshelves, lamp, curtain, window.

// ── Scene 1: Maghrib Window ───────────────────────────────────────────────────
function SceneMaghrib({ variant = "full" }) {
  // variant "full" = full background; "thumb" = thumbnail (cropped, simpler)
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
         xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mg-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="var(--sky-top)"/>
          <stop offset="55%" stopColor="var(--sky-mid)"/>
          <stop offset="100%" stopColor="var(--sky-low)"/>
        </linearGradient>
        <radialGradient id="mg-sun" cx="0.66" cy="0.72" r="0.32">
          <stop offset="0%"  stopColor="var(--sky-sun)" stopOpacity="0.95"/>
          <stop offset="40%" stopColor="var(--sky-sun)" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="var(--sky-sun)" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="mg-lamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%"  stopColor="#FFD699" stopOpacity="0.9"/>
          <stop offset="60%" stopColor="#E89A4A" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#E89A4A" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="mg-arch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A0F09"/>
          <stop offset="100%" stopColor="#2B1A12"/>
        </linearGradient>

        {/* Moorish arch mask — sky shows through this only */}
        <clipPath id="mg-arch-clip">
          {/* Horseshoe arch path */}
          <path d="
            M 220 740
            L 220 420
            C 220 240, 420 160, 580 160
            L 860 160
            C 1020 160, 1220 240, 1220 420
            L 1220 740
            Z
          "/>
        </clipPath>
      </defs>

      {/* Wall (interior, surrounding the arch) — subtle gradient for warmth */}
      <defs>
        <linearGradient id="mg-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#100804"/>
          <stop offset="60%" stopColor="#160C08"/>
          <stop offset="100%" stopColor="#2A1810"/>
        </linearGradient>
        <radialGradient id="mg-floor-glow" cx="0.5" cy="1" r="0.6">
          <stop offset="0%" stopColor="#6B3A22" stopOpacity="0.30"/>
          <stop offset="100%" stopColor="#6B3A22" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="1440" height="900" fill="url(#mg-wall)"/>
      <rect x="0" y="500" width="1440" height="400" fill="url(#mg-floor-glow)"/>

      {/* Sky + sun visible only through arch */}
      <g clipPath="url(#mg-arch-clip)">
        <rect x="0" y="0" width="1440" height="900" fill="url(#mg-sky)"/>
        <rect x="0" y="0" width="1440" height="900" fill="url(#mg-sun)"/>

        {/* Sun disc */}
        <circle cx="950" cy="640" r="62" fill="var(--sky-sun)" opacity="0.92"/>
        <circle cx="950" cy="640" r="92" fill="var(--sky-sun)" opacity="0.18"/>

        {/* Far layer — distant dunes */}
        <path d="M 0 720 Q 240 660, 480 700 T 960 690 T 1440 720 L 1440 900 L 0 900 Z"
              fill="#5C2E2A" opacity="0.55"/>

        {/* Mid layer — city silhouette (minarets + domes) */}
        <g fill="#2C1612" opacity="0.85">
          {/* Distant block */}
          <rect x="280" y="640" width="120" height="80"/>
          <rect x="400" y="620" width="60" height="100"/>
          {/* Dome */}
          <path d="M 460 620 Q 490 580, 520 620 L 520 720 L 460 720 Z"/>
          {/* Minaret tall */}
          <rect x="540" y="500" width="14" height="220"/>
          <polygon points="540,500 547,478 554,500"/>
          <rect x="535" y="540" width="24" height="6"/>
          {/* Block */}
          <rect x="580" y="630" width="90" height="90"/>
          <path d="M 580 630 L 625 600 L 670 630 Z"/>
          {/* Dome 2 */}
          <path d="M 700 615 Q 740 570, 780 615 L 780 720 L 700 720 Z"/>
          <rect x="738" y="555" width="4" height="18"/>
          {/* Block group */}
          <rect x="800" y="650" width="120" height="70"/>
          <rect x="830" y="610" width="50" height="110"/>
          {/* Minaret skinny */}
          <rect x="1010" y="520" width="10" height="200"/>
          <polygon points="1010,520 1015,500 1020,520"/>
          <rect x="1006" y="552" width="18" height="5"/>
          {/* Far block */}
          <rect x="1050" y="660" width="160" height="60"/>
          <path d="M 1210 660 Q 1240 620, 1270 660 L 1270 720 Z"/>
        </g>

        {/* Stars */}
        <g fill="#F4E9D4" opacity="0.7">
          <circle cx="380" cy="220" r="1.2"/>
          <circle cx="540" cy="260" r="0.9"/>
          <circle cx="720" cy="200" r="1.4"/>
          <circle cx="900" cy="240" r="0.8"/>
          <circle cx="1080" cy="220" r="1.1"/>
          <circle cx="430" cy="320" r="0.7"/>
          <circle cx="820" cy="300" r="1"/>
        </g>
      </g>

      {/* Arch frame — ornamental band around the arch (decorative pattern hint) */}
      <g fill="none" stroke="#3A1E14" strokeWidth="3" opacity="0.9">
        <path d="
          M 200 760
          L 200 420
          C 200 224, 408 140, 580 140
          L 860 140
          C 1032 140, 1240 224, 1240 420
          L 1240 760
        "/>
        <path d="
          M 218 760
          L 218 420
          C 218 240, 422 158, 580 158
          L 860 158
          C 1018 158, 1222 240, 1222 420
          L 1222 760
        " stroke="#6B3A22" strokeWidth="1.5" opacity="0.6"/>
      </g>

      {/* Windowsill */}
      <rect x="160" y="740" width="1120" height="22" fill="#3A1E14"/>
      <rect x="180" y="762" width="1080" height="6" fill="#1A0D08"/>

      {/* Brass lantern hanging from top (inside the arch view) */}
      <g transform="translate(420 0)">
        <line x1="0" y1="0" x2="0" y2="240" stroke="#3A1E14" strokeWidth="2"/>
        <ellipse cx="0" cy="310" rx="110" ry="110" fill="url(#mg-lamp)"/>
        <g transform="translate(-22 240)">
          <path d="M 0 0 L 44 0 L 38 56 L 6 56 Z" fill="#C49156"/>
          <rect x="8" y="56" width="28" height="4" fill="#8E6432"/>
          <rect x="14" y="-4" width="16" height="6" fill="#8E6432"/>
          <rect x="18" y="60" width="8" height="22" fill="#FFD699" opacity="0.9"/>
          {/* tiny ornamental scallops */}
          <path d="M 4 14 L 18 14 L 22 22 L 26 14 L 40 14" stroke="#8E6432" strokeWidth="1" fill="none" opacity="0.6"/>
        </g>
      </g>

      {/* Floor edge shadow at bottom for grounding */}
      <rect x="0" y="768" width="1440" height="132" fill="#0A0604"/>
      <rect x="0" y="768" width="1440" height="2" fill="#1F100A"/>
    </svg>
  );
}

// ── Scene 2: Olive Grove ──────────────────────────────────────────────────────
function SceneOliveGrove() {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
         xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="og-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="var(--sky-top)"/>
          <stop offset="50%" stopColor="var(--sky-mid)"/>
          <stop offset="100%" stopColor="var(--sky-low)"/>
        </linearGradient>
        <radialGradient id="og-sun" cx="0.35" cy="0.68" r="0.4">
          <stop offset="0%"  stopColor="var(--sky-sun)" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="var(--sky-sun)" stopOpacity="0"/>
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="1440" height="900" fill="url(#og-sky)"/>
      <rect x="0" y="0" width="1440" height="900" fill="url(#og-sun)"/>

      {/* Sun */}
      <circle cx="500" cy="600" r="58" fill="var(--sky-sun)" opacity="0.9"/>

      {/* Clouds — thin warm streaks */}
      <g fill="#F2B36A" opacity="0.18">
        <ellipse cx="900" cy="280" rx="140" ry="6"/>
        <ellipse cx="1100" cy="340" rx="110" ry="4"/>
        <ellipse cx="300" cy="320" rx="120" ry="5"/>
      </g>

      {/* Furthest hills */}
      <path d="M 0 660 Q 240 580, 480 620 T 960 600 T 1440 640 L 1440 900 L 0 900 Z"
            fill="#3A2A3A" opacity="0.85"/>

      {/* Distant village (white cubes) */}
      <g fill="#E8D9BD" opacity="0.6">
        <rect x="820" y="582" width="18" height="22"/>
        <rect x="838" y="588" width="22" height="16"/>
        <rect x="860" y="580" width="14" height="24"/>
        <rect x="876" y="586" width="18" height="18"/>
        <rect x="894" y="582" width="14" height="22"/>
      </g>

      {/* Mid hills */}
      <path d="M 0 720 Q 200 660, 400 700 T 800 680 T 1200 720 T 1440 700 L 1440 900 L 0 900 Z"
            fill="#4A5232" opacity="0.9"/>

      {/* Front hills (olive-rich) */}
      <path d="M 0 800 Q 260 740, 520 780 T 1040 760 T 1440 790 L 1440 900 L 0 900 Z"
            fill="#3A4226"/>

      {/* Olive trees scattered — stylized geometric clusters */}
      <g>
        {[
          [120, 770, 0.9], [220, 790, 0.7], [340, 760, 1.0],
          [620, 790, 0.85], [720, 770, 0.95], [820, 800, 0.7],
          [1000, 780, 0.9], [1120, 770, 0.8], [1240, 790, 0.75],
          [180, 820, 0.6], [460, 820, 0.55], [880, 825, 0.6],
          [1330, 820, 0.5]
        ].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <rect x="-3" y="-10" width="6" height="40" fill="#1A0F09"/>
            <circle cx="-12" cy="-20" r="18" fill="#5C7D3F"/>
            <circle cx="10" cy="-22" r="16" fill="#6B7449"/>
            <circle cx="-2" cy="-32" r="20" fill="#4A5232"/>
            <circle cx="14" cy="-10" r="14" fill="#5C7D3F"/>
            <circle cx="-16" cy="-6" r="12" fill="#4A5232"/>
          </g>
        ))}
      </g>

      {/* Foreground silhouette: low stone wall */}
      <g fill="#1A0F09">
        <rect x="0" y="860" width="1440" height="40"/>
        <path d="M 0 860 L 120 858 L 240 862 L 360 858 L 480 860 L 600 858 L 720 862 L 840 858 L 960 860 L 1080 858 L 1200 862 L 1320 858 L 1440 860"
              stroke="#2C1612" strokeWidth="2" fill="none"/>
      </g>
    </svg>
  );
}

// ── Scene 3: Library at Dusk (interior) ──────────────────────────────────────
function SceneLibrary() {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
         xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lib-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A1810"/>
          <stop offset="100%" stopColor="#160C07"/>
        </linearGradient>
        <linearGradient id="lib-window" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="var(--sky-mid)"/>
          <stop offset="100%" stopColor="var(--sky-low)"/>
        </linearGradient>
        <radialGradient id="lib-lamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%"  stopColor="#FFD699" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#E89A4A" stopOpacity="0"/>
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="1440" height="900" fill="url(#lib-wall)"/>

      {/* Floor */}
      <rect x="0" y="720" width="1440" height="180" fill="#0F0805"/>
      <rect x="0" y="720" width="1440" height="2" fill="#3A1E14"/>

      {/* Rug */}
      <ellipse cx="720" cy="850" rx="600" ry="50" fill="#5C2E2A" opacity="0.6"/>
      <ellipse cx="720" cy="850" rx="540" ry="40" fill="#8C3F23" opacity="0.4"/>

      {/* Left bookshelves */}
      <g>
        <rect x="40" y="120" width="280" height="600" fill="#241509"/>
        <rect x="40" y="120" width="280" height="6" fill="#3A1E14"/>
        <rect x="40" y="710" width="280" height="10" fill="#3A1E14"/>
        {/* Shelf rows + books */}
        {[180, 280, 380, 480, 580].map((y, ri) => (
          <g key={ri}>
            <rect x="46" y={y - 4} width="268" height="4" fill="#3A1E14"/>
            {/* books */}
            {Array.from({length: 18}).map((_, i) => {
              const colors = ['#8C3F23','#4A5232','#6B3A22','#C49156','#3A1E14','#5C2E2A','#4A5232','#8E6432'];
              const x = 50 + i * 15;
              const h = 60 + (((i + ri) * 7) % 22);
              const w = 12 + (((i * 3 + ri) % 4));
              return <rect key={i} x={x} y={y - h} width={w} height={h}
                           fill={colors[(i + ri) % colors.length]}/>;
            })}
          </g>
        ))}
      </g>

      {/* Center window (with dusk sky) */}
      <g transform="translate(540 100)">
        <rect x="-10" y="-10" width="380" height="520" fill="#3A1E14"/>
        <rect x="0" y="0" width="360" height="500" fill="url(#lib-window)"/>
        {/* Pane dividers */}
        <line x1="180" y1="0" x2="180" y2="500" stroke="#3A1E14" strokeWidth="6"/>
        <line x1="0" y1="250" x2="360" y2="250" stroke="#3A1E14" strokeWidth="6"/>
        {/* Distant minaret in window */}
        <g fill="#1A0F09" opacity="0.75">
          <rect x="80" y="320" width="60" height="180"/>
          <rect x="100" y="280" width="10" height="40"/>
          <polygon points="100,280 105,265 110,280"/>
          <path d="M 220 340 Q 250 295, 280 340 L 280 500 L 220 500 Z"/>
          <rect x="248" y="310" width="4" height="14"/>
        </g>
        {/* Sun glow inside window */}
        <circle cx="260" cy="380" r="32" fill="var(--sky-sun)" opacity="0.85"/>
      </g>

      {/* Right bookshelves */}
      <g>
        <rect x="1120" y="120" width="280" height="600" fill="#241509"/>
        <rect x="1120" y="120" width="280" height="6" fill="#3A1E14"/>
        <rect x="1120" y="710" width="280" height="10" fill="#3A1E14"/>
        {[180, 280, 380, 480, 580].map((y, ri) => (
          <g key={ri}>
            <rect x="1126" y={y - 4} width="268" height="4" fill="#3A1E14"/>
            {Array.from({length: 18}).map((_, i) => {
              const colors = ['#4A5232','#8C3F23','#C49156','#3A1E14','#5C2E2A','#6B3A22','#8E6432','#4A5232'];
              const x = 1130 + i * 15;
              const h = 58 + (((i * 5 + ri * 3) % 26));
              const w = 12 + (((i + ri) % 4));
              return <rect key={i} x={x} y={y - h} width={w} height={h}
                           fill={colors[(i + ri) % colors.length]}/>;
            })}
          </g>
        ))}
      </g>

      {/* Hanging brass lamp center-left */}
      <g transform="translate(380 0)">
        <line x1="0" y1="0" x2="0" y2="280" stroke="#3A1E14" strokeWidth="2"/>
        <ellipse cx="0" cy="360" rx="120" ry="120" fill="url(#lib-lamp)"/>
        <g transform="translate(-22 280)">
          <path d="M 0 0 L 44 0 L 38 50 L 6 50 Z" fill="#C49156"/>
          <rect x="10" y="50" width="24" height="3" fill="#8E6432"/>
          <rect x="14" y="-4" width="16" height="6" fill="#8E6432"/>
          <rect x="18" y="53" width="8" height="20" fill="#FFD699" opacity="0.9"/>
        </g>
      </g>

      {/* Curtain fringe at top */}
      <g fill="#5C2E2A">
        <path d="M 530 90 Q 540 130, 530 170 L 525 170 L 525 90 Z"/>
        <path d="M 905 90 Q 895 130, 905 170 L 910 170 L 910 90 Z"/>
      </g>
    </svg>
  );
}

// ── Scene thumbnails (smaller versions for the selector) ──────────────────────
function SceneThumb({ id }) {
  if (id === "maghrib") {
    return (
      <svg viewBox="0 0 88 56" xmlns="http://www.w3.org/2000/svg">
        <rect width="88" height="56" fill="var(--sky-top)"/>
        <rect width="88" height="36" y="20" fill="var(--sky-low)"/>
        <path d="M0 38 Q22 32 44 36 T 88 38 L 88 56 L 0 56 Z" fill="#2C1612"/>
        <circle cx="58" cy="38" r="4" fill="var(--sky-sun)"/>
        <rect x="32" y="22" width="2" height="18" fill="#0F0805"/>
        <polygon points="32,22 33,20 34,22" fill="#0F0805"/>
        <path d="M 14 4 L 14 28 Q 14 18, 22 14 L 38 14 Q 46 18, 46 28 L 46 50 L 14 50 Z"
              fill="none" stroke="#3A1E14" strokeWidth="1.5"/>
      </svg>
    );
  }
  if (id === "olive") {
    return (
      <svg viewBox="0 0 88 56" xmlns="http://www.w3.org/2000/svg">
        <rect width="88" height="56" fill="var(--sky-mid)"/>
        <rect width="88" height="20" y="36" fill="var(--sky-low)"/>
        <circle cx="22" cy="38" r="5" fill="var(--sky-sun)"/>
        <path d="M0 42 Q22 38 44 40 T88 42 L88 56 L0 56 Z" fill="#4A5232"/>
        <g fill="#3A4226">
          <circle cx="20" cy="46" r="4"/>
          <circle cx="42" cy="44" r="4"/>
          <circle cx="64" cy="46" r="4"/>
        </g>
      </svg>
    );
  }
  // library
  return (
    <svg viewBox="0 0 88 56" xmlns="http://www.w3.org/2000/svg">
      <rect width="88" height="56" fill="#1F100A"/>
      <rect x="6" y="8" width="20" height="40" fill="#241509"/>
      <rect x="6" y="14" width="20" height="2" fill="#3A1E14"/>
      <rect x="6" y="22" width="20" height="2" fill="#3A1E14"/>
      <rect x="6" y="30" width="20" height="2" fill="#3A1E14"/>
      <rect x="6" y="38" width="20" height="2" fill="#3A1E14"/>
      <rect x="62" y="8" width="20" height="40" fill="#241509"/>
      <rect x="62" y="14" width="20" height="2" fill="#3A1E14"/>
      <rect x="62" y="22" width="20" height="2" fill="#3A1E14"/>
      <rect x="62" y="30" width="20" height="2" fill="#3A1E14"/>
      <rect x="62" y="38" width="20" height="2" fill="#3A1E14"/>
      <rect x="30" y="8" width="28" height="40" fill="var(--sky-low)"/>
      <line x1="44" y1="8" x2="44" y2="48" stroke="#3A1E14" strokeWidth="1"/>
      <line x1="30" y1="28" x2="58" y2="28" stroke="#3A1E14" strokeWidth="1"/>
      <circle cx="50" cy="34" r="3" fill="var(--sky-sun)"/>
    </svg>
  );
}

// Export to window so other Babel scripts can use them
Object.assign(window, { SceneMaghrib, SceneOliveGrove, SceneLibrary, SceneThumb });
