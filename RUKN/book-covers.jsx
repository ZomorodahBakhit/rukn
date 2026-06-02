// book-covers.jsx
// Hand-drawn SVG covers for the Rukn library. Each cover is its own component,
// 220×320 viewBox (rendered at whatever size the card needs).

// ── The Prophet — Khalil Gibran ──────────────────────────────────────────────
function CoverProphet() {
  return (
    <svg viewBox="0 0 220 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="cv-prophet-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7A2E1C"/>
          <stop offset="1" stopColor="#5C1F12"/>
        </linearGradient>
        <radialGradient id="cv-prophet-sun" cx="0.5" cy="0.6" r="0.5">
          <stop offset="0" stopColor="#F2C77A" stopOpacity="0.9"/>
          <stop offset="0.6" stopColor="#E89A4A" stopOpacity="0.3"/>
          <stop offset="1" stopColor="#E89A4A" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="220" height="320" fill="url(#cv-prophet-bg)"/>
      {/* Decorative gold border */}
      <rect x="14" y="14" width="192" height="292" fill="none"
            stroke="#E8B265" strokeWidth="0.6" opacity="0.7"/>
      <rect x="20" y="20" width="180" height="280" fill="none"
            stroke="#E8B265" strokeWidth="0.4" opacity="0.45"/>
      {/* Sun + horizon */}
      <ellipse cx="110" cy="195" rx="80" ry="80" fill="url(#cv-prophet-sun)"/>
      <circle cx="110" cy="195" r="22" fill="#F2C77A" opacity="0.85"/>
      {/* Distant mountains */}
      <path d="M 14 240 L 60 200 L 95 215 L 130 195 L 165 220 L 206 200 L 206 306 L 14 306 Z"
            fill="#3A1810" opacity="0.7"/>
      <path d="M 14 270 L 50 250 L 90 260 L 130 245 L 170 258 L 206 248 L 206 306 L 14 306 Z"
            fill="#2A0E08"/>
      {/* Title text */}
      <text x="110" y="78" textAnchor="middle" fill="#F2C77A"
            fontFamily="Cormorant Garamond, serif" fontStyle="italic"
            fontSize="22" letterSpacing="2">The</text>
      <text x="110" y="115" textAnchor="middle" fill="#F4E9D4"
            fontFamily="Cormorant Garamond, serif" fontWeight="500"
            fontSize="34" letterSpacing="3">PROPHET</text>
      <line x1="60" y1="135" x2="160" y2="135" stroke="#E8B265" strokeWidth="0.5" opacity="0.7"/>
      <text x="110" y="293" textAnchor="middle" fill="#E8B265"
            fontFamily="Manrope, sans-serif" fontSize="8" letterSpacing="4">KHALIL GIBRAN</text>
    </svg>
  );
}

// ── Pride and Prejudice — Jane Austen ────────────────────────────────────────
function CoverPride() {
  return (
    <svg viewBox="0 0 220 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="cv-pride-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E8D9BD"/>
          <stop offset="1" stopColor="#D9B89A"/>
        </linearGradient>
      </defs>
      <rect width="220" height="320" fill="url(#cv-pride-bg)"/>
      <rect x="0" y="0" width="220" height="48" fill="#5C2A3A"/>
      <rect x="0" y="272" width="220" height="48" fill="#5C2A3A"/>
      {/* Regency house silhouette */}
      <g fill="#5C2A3A" opacity="0.85">
        <rect x="50" y="220" width="120" height="40"/>
        <polygon points="50,220 110,180 170,220"/>
        {/* Columns */}
        <rect x="70" y="232" width="6" height="28" fill="#E8D9BD"/>
        <rect x="92" y="232" width="6" height="28" fill="#E8D9BD"/>
        <rect x="122" y="232" width="6" height="28" fill="#E8D9BD"/>
        <rect x="144" y="232" width="6" height="28" fill="#E8D9BD"/>
        {/* Door */}
        <rect x="104" y="240" width="12" height="20" fill="#E8D9BD"/>
      </g>
      {/* Decorative flourish */}
      <g fill="#5C2A3A" opacity="0.6">
        <circle cx="40" cy="195" r="2"/>
        <circle cx="180" cy="195" r="2"/>
        <path d="M 45 195 q 65 -8, 130 0" stroke="#5C2A3A" strokeWidth="0.6" fill="none"/>
      </g>
      {/* Title */}
      <text x="110" y="98" textAnchor="middle" fill="#5C2A3A"
            fontFamily="Cormorant Garamond, serif" fontWeight="500"
            fontSize="26" letterSpacing="1">PRIDE</text>
      <text x="110" y="125" textAnchor="middle" fill="#5C2A3A"
            fontFamily="Cormorant Garamond, serif" fontStyle="italic"
            fontSize="14">&amp; prejudice</text>
      <line x1="80" y1="142" x2="140" y2="142" stroke="#5C2A3A" strokeWidth="0.6"/>
      <text x="110" y="160" textAnchor="middle" fill="#5C2A3A"
            fontFamily="Manrope, sans-serif" fontSize="8" letterSpacing="3"
            opacity="0.75">JANE AUSTEN</text>
    </svg>
  );
}

// ── Midaq Alley — Naguib Mahfouz ─────────────────────────────────────────────
function CoverMidaq() {
  return (
    <svg viewBox="0 0 220 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="cv-midaq-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A2616"/>
          <stop offset="1" stopColor="#1F1610"/>
        </linearGradient>
      </defs>
      <rect width="220" height="320" fill="url(#cv-midaq-bg)"/>
      {/* Warm arch reveal */}
      <path d="M 60 280 L 60 130 C 60 90, 90 70, 110 70 C 130 70, 160 90, 160 130 L 160 280 Z"
            fill="#C66B3D"/>
      <path d="M 70 280 L 70 134 C 70 100, 92 82, 110 82 C 128 82, 150 100, 150 134 L 150 280 Z"
            fill="#7A2E1C" opacity="0.8"/>
      {/* Lantern silhouette inside */}
      <circle cx="110" cy="180" r="30" fill="#F2C77A" opacity="0.5"/>
      <g transform="translate(102 160)">
        <rect x="0" y="0" width="16" height="22" fill="#1F1610"/>
        <rect x="4" y="-4" width="8" height="4" fill="#1F1610"/>
      </g>
      {/* Arabic title */}
      <text x="110" y="36" textAnchor="middle" fill="#F2C77A"
            fontFamily="Amiri, serif" fontSize="22">زقاق المدق</text>
      {/* English title */}
      <text x="110" y="304" textAnchor="middle" fill="#F4E9D4"
            fontFamily="Cormorant Garamond, serif" fontStyle="italic"
            fontSize="18">Midaq Alley</text>
      <line x1="80" y1="50" x2="140" y2="50" stroke="#F2C77A" strokeWidth="0.5" opacity="0.6"/>
    </svg>
  );
}

// ── Meditations — Marcus Aurelius ────────────────────────────────────────────
function CoverMeditations() {
  return (
    <svg viewBox="0 0 220 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <rect width="220" height="320" fill="#1A2F3A"/>
      {/* Greek key border pattern (top) */}
      <g stroke="#D9B86A" strokeWidth="1.2" fill="none">
        <path d="M 16 30 h 8 v -8 h -4 v 4 h 4 M 30 30 h 8 v -8 h -4 v 4 h 4 M 44 30 h 8 v -8 h -4 v 4 h 4 M 58 30 h 8 v -8 h -4 v 4 h 4 M 72 30 h 8 v -8 h -4 v 4 h 4 M 86 30 h 8 v -8 h -4 v 4 h 4 M 100 30 h 8 v -8 h -4 v 4 h 4 M 114 30 h 8 v -8 h -4 v 4 h 4 M 128 30 h 8 v -8 h -4 v 4 h 4 M 142 30 h 8 v -8 h -4 v 4 h 4 M 156 30 h 8 v -8 h -4 v 4 h 4 M 170 30 h 8 v -8 h -4 v 4 h 4 M 184 30 h 8 v -8 h -4 v 4 h 4"/>
      </g>
      {/* Greek key (bottom) */}
      <g stroke="#D9B86A" strokeWidth="1.2" fill="none">
        <path d="M 16 298 h 8 v 8 h -4 v -4 h 4 M 30 298 h 8 v 8 h -4 v -4 h 4 M 44 298 h 8 v 8 h -4 v -4 h 4 M 58 298 h 8 v 8 h -4 v -4 h 4 M 72 298 h 8 v 8 h -4 v -4 h 4 M 86 298 h 8 v 8 h -4 v -4 h 4 M 100 298 h 8 v 8 h -4 v -4 h 4 M 114 298 h 8 v 8 h -4 v -4 h 4 M 128 298 h 8 v 8 h -4 v -4 h 4 M 142 298 h 8 v 8 h -4 v -4 h 4 M 156 298 h 8 v 8 h -4 v -4 h 4 M 170 298 h 8 v 8 h -4 v -4 h 4 M 184 298 h 8 v 8 h -4 v -4 h 4"/>
      </g>
      {/* Marble column */}
      <g fill="#D9B86A" opacity="0.18">
        <rect x="86" y="80" width="48" height="160"/>
        <rect x="80" y="80" width="60" height="10"/>
        <rect x="80" y="230" width="60" height="10"/>
      </g>
      <line x1="98" y1="90" x2="98" y2="230" stroke="#D9B86A" strokeWidth="0.4" opacity="0.5"/>
      <line x1="110" y1="90" x2="110" y2="230" stroke="#D9B86A" strokeWidth="0.4" opacity="0.5"/>
      <line x1="122" y1="90" x2="122" y2="230" stroke="#D9B86A" strokeWidth="0.4" opacity="0.5"/>
      {/* Title */}
      <text x="110" y="148" textAnchor="middle" fill="#D9B86A"
            fontFamily="Cormorant Garamond, serif" fontWeight="500"
            fontSize="28" letterSpacing="3">MEDI-</text>
      <text x="110" y="178" textAnchor="middle" fill="#D9B86A"
            fontFamily="Cormorant Garamond, serif" fontWeight="500"
            fontSize="28" letterSpacing="3">TATIONS</text>
      <text x="110" y="262" textAnchor="middle" fill="#D9B86A"
            fontFamily="Manrope, sans-serif" fontSize="7" letterSpacing="3"
            opacity="0.85">MARCUS AURELIUS</text>
    </svg>
  );
}

// ── The Little Prince ────────────────────────────────────────────────────────
function CoverLittlePrince() {
  return (
    <svg viewBox="0 0 220 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <radialGradient id="cv-lp-bg" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0" stopColor="#3F4F6B"/>
          <stop offset="1" stopColor="#1A2030"/>
        </radialGradient>
      </defs>
      <rect width="220" height="320" fill="url(#cv-lp-bg)"/>
      {/* Stars */}
      <g fill="#F4E9D4">
        <circle cx="40" cy="50" r="1"/>
        <circle cx="180" cy="80" r="1.2"/>
        <circle cx="60" cy="120" r="0.8"/>
        <circle cx="170" cy="160" r="1.1"/>
        <circle cx="30" cy="200" r="0.9"/>
        <circle cx="190" cy="250" r="1"/>
        {/* Sparkle */}
        <path d="M 100 60 l 1.5 -4 l 1.5 4 l 4 1.5 l -4 1.5 l -1.5 4 l -1.5 -4 l -4 -1.5 z" fill="#F2C77A"/>
      </g>
      {/* Tiny planet */}
      <circle cx="110" cy="210" r="36" fill="#E89A4A"/>
      <ellipse cx="110" cy="210" rx="42" ry="6" fill="none" stroke="#F2C77A" strokeWidth="0.6" opacity="0.7"/>
      {/* Volcanoes */}
      <path d="M 90 200 L 96 184 L 102 200 Z" fill="#7A2E1C"/>
      <path d="M 110 196 L 118 180 L 126 196 Z" fill="#7A2E1C"/>
      {/* Little figure on top */}
      <g transform="translate(110 178)">
        <circle cx="0" cy="-6" r="3.5" fill="#F4E9D4"/>
        <path d="M -4 -2 L 4 -2 L 3 6 L -3 6 Z" fill="#F2C77A"/>
        <rect x="-1" y="-12" width="2" height="4" fill="#F4E9D4"/>
      </g>
      {/* Title */}
      <text x="110" y="80" textAnchor="middle" fill="#F4E9D4"
            fontFamily="Cormorant Garamond, serif" fontStyle="italic"
            fontSize="20">The Little</text>
      <text x="110" y="120" textAnchor="middle" fill="#F2C77A"
            fontFamily="Cormorant Garamond, serif" fontWeight="500"
            fontSize="36" letterSpacing="2">Prince</text>
      <text x="110" y="290" textAnchor="middle" fill="#F4E9D4"
            fontFamily="Manrope, sans-serif" fontSize="7" letterSpacing="3"
            opacity="0.7">SAINT-EXUPÉRY</text>
    </svg>
  );
}

// ── Kalila wa Dimna ──────────────────────────────────────────────────────────
function CoverKalila() {
  return (
    <svg viewBox="0 0 220 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="cv-kalila-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D9B86A"/>
          <stop offset="1" stopColor="#8A7A3F"/>
        </linearGradient>
      </defs>
      <rect width="220" height="320" fill="url(#cv-kalila-bg)"/>
      {/* Decorative geometric border */}
      <g fill="none" stroke="#2A1810" strokeWidth="0.8" opacity="0.7">
        <rect x="14" y="14" width="192" height="292"/>
        <rect x="20" y="20" width="180" height="280"/>
      </g>
      {/* Octagonal medallion */}
      <g transform="translate(110 200)">
        <polygon points="0,-60 42,-42 60,0 42,42 0,60 -42,42 -60,0 -42,-42"
                 fill="#2A1810" opacity="0.85"/>
        <polygon points="0,-52 36,-36 52,0 36,36 0,52 -36,36 -52,0 -36,-36"
                 fill="none" stroke="#D9B86A" strokeWidth="0.8"/>
        {/* Jackal silhouette in profile */}
        <g fill="#D9B86A" transform="translate(-22 -16)">
          <path d="M 0 20 L 6 6 L 12 0 L 18 -6 L 26 -8 L 30 -4 L 28 4 L 34 10 L 38 18 L 38 26 L 32 28 L 24 24 L 18 26 L 10 26 L 4 24 Z"/>
          <path d="M 22 -10 L 24 -16 L 28 -14 Z" fill="#D9B86A"/>
          <circle cx="22" cy="0" r="1" fill="#2A1810"/>
        </g>
      </g>
      {/* Arabic title */}
      <text x="110" y="60" textAnchor="middle" fill="#2A1810"
            fontFamily="Amiri, serif" fontWeight="700" fontSize="28">كليلة ودمنة</text>
      {/* English subtitle */}
      <text x="110" y="295" textAnchor="middle" fill="#2A1810"
            fontFamily="Manrope, sans-serif" fontSize="8" letterSpacing="3">KALĪLA WA DIMNA</text>
    </svg>
  );
}

// ── CS 101 — Lecture Notes (textbook) ────────────────────────────────────────
function CoverCS101() {
  return (
    <svg viewBox="0 0 220 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <rect width="220" height="320" fill="#F4E9D4"/>
      {/* Red header strip */}
      <rect x="0" y="0" width="220" height="80" fill="#B45A36"/>
      <rect x="0" y="80" width="220" height="3" fill="#8C3F23"/>
      {/* Code-like lines */}
      <g fill="#5A3D1F" opacity="0.4" fontFamily="JetBrains Mono, monospace" fontSize="6">
        {[120, 134, 148, 162, 176, 190, 204, 218].map((y, i) => (
          <g key={i}>
            <rect x="24" y={y - 5} width="6" height="6" rx="1" fill="#5A3D1F" opacity="0.35"/>
            <rect x="36" y={y - 3} width={50 + (i * 7) % 80} height="2" fill="#5A3D1F" opacity="0.45"/>
            <rect x="36" y={y + 1} width={30 + (i * 9) % 70} height="2" fill="#5A3D1F" opacity="0.3"/>
          </g>
        ))}
      </g>
      {/* Header text */}
      <text x="22" y="38" fill="#F4E9D4"
            fontFamily="Manrope, sans-serif" fontWeight="700"
            fontSize="11" letterSpacing="3">CS 101</text>
      <text x="22" y="58" fill="#F4E9D4"
            fontFamily="Cormorant Garamond, serif" fontStyle="italic"
            fontSize="22">Lecture Notes</text>
      {/* Footer */}
      <text x="22" y="286" fill="#3A2616"
            fontFamily="Manrope, sans-serif" fontSize="8" letterSpacing="2"
            opacity="0.7">DEPT. OF COMPUTER SCIENCE</text>
      <text x="22" y="300" fill="#3A2616"
            fontFamily="Manrope, sans-serif" fontSize="6" letterSpacing="2"
            opacity="0.5">PROF. MAREK SVENSSON · FALL TERM</text>
    </svg>
  );
}

// ── Procedural fallback cover for books without a hand-drawn one ─────────────
// Deterministic gradient based on title hash so the same book always gets the
// same cover. Stays in the warm Desert Dusk family — never clashes visually.
const COVER_PALETTES = [
  ["#3F2A4A", "#7A3F4E", "#C66B3D"],   // plum → terracotta
  ["#2E3A2E", "#6B7449", "#D9B86A"],   // olive grove
  ["#1F140C", "#9C4F1E", "#F2C77A"],   // candlelight
  ["#5C1F12", "#8C3F23", "#E8B265"],   // sienna
  ["#2A1830", "#6E2E5A", "#B8466A"],   // rose maghrib
  ["#1A2A3A", "#3F4F6B", "#8E9EBE"],   // night sky
];
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0x7fffffff;
  return h;
}
function CoverAuto({ title, author }) {
  const t = String(title || "Untitled");
  const a = String(author || "");
  const h = hashStr(t);
  const [c1, c2, c3] = COVER_PALETTES[h % COVER_PALETTES.length];
  const initial = t.charAt(0).toUpperCase();
  const gid = "auto-bg-" + h;
  const sid = "auto-sun-" + h;
  return (
    <svg viewBox="0 0 220 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c1}/>
          <stop offset="0.6" stopColor={c2}/>
          <stop offset="1" stopColor={c3}/>
        </linearGradient>
        <radialGradient id={sid} cx="0.5" cy="0.65" r="0.45">
          <stop offset="0"   stopColor={c3} stopOpacity="0.6"/>
          <stop offset="0.7" stopColor={c3} stopOpacity="0.15"/>
          <stop offset="1"   stopColor={c3} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="220" height="320" fill={`url(#${gid})`}/>
      {/* Decorative inset border */}
      <rect x="14" y="14" width="192" height="292" fill="none"
            stroke={c3} strokeWidth="0.6" opacity="0.55"/>
      <rect x="20" y="20" width="180" height="280" fill="none"
            stroke={c3} strokeWidth="0.4" opacity="0.30"/>
      {/* Soft glow disk */}
      <ellipse cx="110" cy="200" rx="80" ry="80" fill={`url(#${sid})`}/>
      {/* Large initial */}
      <text x="110" y="200" textAnchor="middle" fill="#F4E9D4"
            fontFamily="Cormorant Garamond, serif" fontWeight="500"
            fontSize="120" letterSpacing="-4" opacity="0.92">
        {initial}
      </text>
      {/* Title bar */}
      <line x1="50" y1="240" x2="170" y2="240" stroke={c3} strokeWidth="0.5" opacity="0.7"/>
      <text x="110" y="260" textAnchor="middle" fill="#F4E9D4"
            fontFamily="Cormorant Garamond, serif" fontWeight="500"
            fontSize="14" letterSpacing="1">
        {t.length > 22 ? t.slice(0, 20) + "…" : t}
      </text>
      {/* Author footer */}
      <text x="110" y="293" textAnchor="middle" fill={c3}
            fontFamily="Manrope, sans-serif" fontSize="8" letterSpacing="3.5">
        {(a || "").toUpperCase().slice(0, 28)}
      </text>
    </svg>
  );
}

// ── Cover map ────────────────────────────────────────────────────────────────
// Maps either a known prototype cover id, or falls through to a procedural
// auto-cover using the book's title + author. Accepts title/author so backend
// books that don't match a known id still get a proper-looking cover.
function BookCover({ id, title, author }) {
  switch (id) {
    case "prophet":     return <CoverProphet/>;
    case "pride":       return <CoverPride/>;
    case "midaq":       return <CoverMidaq/>;
    case "meditations": return <CoverMeditations/>;
    case "littleprince":return <CoverLittlePrince/>;
    case "kalila":      return <CoverKalila/>;
    case "cs101":       return <CoverCS101/>;
    default:            return <CoverAuto title={title} author={author}/>;
  }
}

// Title heuristic — picks a hand-drawn cover when a backend book's title
// matches one we've designed. Used by library.jsx when mapping API rows.
function coverKeyFromTitle(title) {
  const t = String(title || "").toLowerCase();
  if (t.includes("prophet"))                       return "prophet";
  if (t.includes("pride") && t.includes("prejudice")) return "pride";
  if (t.includes("midaq"))                         return "midaq";
  if (t.includes("meditation"))                    return "meditations";
  if (t.includes("little prince") || t.includes("le petit prince")) return "littleprince";
  if (t.includes("kalila") || t.includes("dimna")) return "kalila";
  if (t.includes("cs 101") || t.includes("lecture notes")) return "cs101";
  return null;
}

Object.assign(window, { BookCover, CoverAuto, coverKeyFromTitle });
