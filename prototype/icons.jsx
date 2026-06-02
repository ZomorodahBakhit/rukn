// icons.jsx
// Fine-line icon set for Rukn. 1.5px stroke, rounded caps. Cozy/literary feel.

const Icon = ({ size = 22, children, fill = "none", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
       stroke="currentColor" strokeWidth="1.5"
       strokeLinecap="round" strokeLinejoin="round" style={style}>
    {children}
  </svg>
);

const IRain = (p) => (
  <Icon {...p}>
    <path d="M16 13a4 4 0 0 0-3-7 5 5 0 0 0-9 2 4 4 0 0 0 1 8"/>
    <path d="M8 17l-1 3"/>
    <path d="M12 17l-1 3"/>
    <path d="M16 17l-1 3"/>
  </Icon>
);
const IFire = (p) => (
  <Icon {...p}>
    <path d="M12 3c0 4 4 4 4 8a4 4 0 1 1-8 0c0-2 1-3 2-4-1 3 2 3 2 5a2 2 0 0 0 2-2c0-3-2-4-2-7z"/>
  </Icon>
);
const ICafe = (p) => (
  <Icon {...p}>
    <path d="M5 9h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9z"/>
    <path d="M16 11h2a2 2 0 1 1 0 4h-2"/>
    <path d="M8 3v3M11 3v3"/>
  </Icon>
);
const ILofi = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9"/>
    <circle cx="12" cy="12" r="2.5"/>
    <path d="M12 3a9 9 0 0 1 7.5 4M4.5 7A9 9 0 0 1 12 3"/>
  </Icon>
);
const IForest = (p) => (
  <Icon {...p}>
    <path d="M12 3l5 7h-3l4 6h-4l3 5H7l3-5H6l4-6H7z"/>
    <path d="M12 21v-3"/>
  </Icon>
);

const IPlay = (p) => (
  <Icon {...p}>
    <path d="M7 5l12 7-12 7z" fill="currentColor"/>
  </Icon>
);
const IPause = (p) => (
  <Icon {...p}>
    <rect x="6" y="5" width="4" height="14" fill="currentColor" stroke="none"/>
    <rect x="14" y="5" width="4" height="14" fill="currentColor" stroke="none"/>
  </Icon>
);
const IReset = (p) => (
  <Icon {...p}>
    <path d="M3 12a9 9 0 1 0 3-6.7"/>
    <path d="M3 4v5h5"/>
  </Icon>
);
const ISkip = (p) => (
  <Icon {...p}>
    <path d="M5 5l10 7L5 19z" fill="currentColor"/>
    <line x1="17" y1="5" x2="17" y2="19"/>
  </Icon>
);

const IBook = (p) => (
  <Icon {...p}>
    <path d="M4 4h6a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H4z"/>
    <path d="M20 4h-6a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H20z"/>
  </Icon>
);
const IFeather = (p) => (
  <Icon {...p}>
    <path d="M20 4c-3 0-12 1-15 8-1 2 0 6 3 7 7-3 12-8 12-15z"/>
    <path d="M9 13l-5 7"/>
    <path d="M14 9l-7 6"/>
  </Icon>
);
const IPalette = (p) => (
  <Icon {...p}>
    <path d="M12 3a9 9 0 0 0 0 18 2 2 0 0 0 2-2v-1a2 2 0 0 1 2-2h2a3 3 0 0 0 3-3 9 9 0 0 0-9-10z"/>
    <circle cx="7.5" cy="11" r="1" fill="currentColor"/>
    <circle cx="10" cy="7" r="1" fill="currentColor"/>
    <circle cx="14" cy="7" r="1" fill="currentColor"/>
    <circle cx="17" cy="10" r="1" fill="currentColor"/>
  </Icon>
);
const IGlobe = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9"/>
    <path d="M3 12h18"/>
    <path d="M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>
  </Icon>
);

const IArrow = (p) => (
  <Icon {...p}>
    <path d="M5 12h14"/>
    <path d="M13 6l6 6-6 6"/>
  </Icon>
);
const IClose = (p) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6L6 18"/>
  </Icon>
);

const IClock = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 7v5l3 2"/>
  </Icon>
);
const ISparkle = (p) => (
  <Icon {...p}>
    <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/>
  </Icon>
);

Object.assign(window, {
  IRain, IFire, ICafe, ILofi, IForest,
  IPlay, IPause, IReset, ISkip,
  IBook, IFeather, IPalette, IGlobe,
  IArrow, IClose, IClock, ISparkle
});
