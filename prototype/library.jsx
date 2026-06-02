// library.jsx
// Rukn — Library (Screen 4). Personal book collection with cozy covers,
// tabs (My Books / Public Domain / Collections), search + filter,
// and an upload affordance.

const LIB_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#3F2A4A", "#C66B3D", "#F2B36A"]
}/*EDITMODE-END*/;

// ── User's book collection ───────────────────────────────────────────────────
const MY_BOOKS = [
  { id: "prophet",     title: "The Prophet",        author: "Khalil Gibran",         format: "EPUB", progress: 1.00, lang: "en", openable: true },
  { id: "pride",       title: "Pride and Prejudice", author: "Jane Austen",          format: "EPUB", progress: 0.23, lang: "en" },
  { id: "midaq",       title: "Midaq Alley",        author: "Naguib Mahfouz",        format: "PDF",  progress: 0.67, lang: "ar" },
  { id: "meditations", title: "Meditations",        author: "Marcus Aurelius",       format: "EPUB", progress: 0.12, lang: "en" },
  { id: "littleprince",title: "The Little Prince",  author: "Antoine de Saint-Exupéry", format: "EPUB", progress: 0.89, lang: "en" },
  { id: "kalila",      title: "Kalila wa Dimna",    author: "Ibn al-Muqaffaʿ",       format: "PDF",  progress: 0.04, lang: "ar" },
  { id: "cs101",       title: "CS 101 — Lecture Notes", author: "Prof. M. Svensson", format: "PDF",  progress: 0.45, lang: "en" }
];

// Public domain library (browse)
const PD_BOOKS = [
  { id: "prophet",     title: "The Prophet",         author: "Khalil Gibran",  format: "EPUB", progress: 0, lang: "en", owned: true },
  { id: "pride",       title: "Pride and Prejudice", author: "Jane Austen",    format: "EPUB", progress: 0, lang: "en", owned: true },
  { id: "meditations", title: "Meditations",         author: "Marcus Aurelius",format: "EPUB", progress: 0, lang: "en", owned: true },
  { id: "kalila",      title: "Kalila wa Dimna",     author: "Ibn al-Muqaffaʿ",format: "PDF",  progress: 0, lang: "ar", owned: true },
  { id: "midaq",       title: "Midaq Alley",         author: "Naguib Mahfouz", format: "PDF",  progress: 0, lang: "ar", owned: true },
  { id: "littleprince",title: "The Little Prince",   author: "Saint-Exupéry",  format: "EPUB", progress: 0, lang: "en", owned: true }
];

// Collections — named folders
const COLLECTIONS = [
  { id: "now",      name: "Currently Reading",  count: 4, ids: ["pride", "midaq", "meditations", "cs101"] },
  { id: "ar-lit",   name: "Arabic Literature",  count: 2, ids: ["midaq", "kalila"] },
  { id: "class",    name: "For Class",          count: 1, ids: ["cs101"] },
  { id: "finished", name: "Finished",           count: 1, ids: ["prophet"] }
];

// ── Icon set: filter, search, sort, upload ──────────────────────────────────
const ISearch = (p) => (
  <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></Icon>
);
const IFilter = (p) => (
  <Icon {...p}><path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/></Icon>
);
const ISort = (p) => (
  <Icon {...p}><path d="M3 6h18"/><path d="M6 12h12"/><path d="M9 18h6"/></Icon>
);
const IPlus = (p) => (
  <Icon {...p}><path d="M12 5v14"/><path d="M5 12h14"/></Icon>
);
const IUpload = (p) => (
  <Icon {...p}><path d="M12 17V3"/><path d="M6 9l6-6 6 6"/><path d="M5 21h14"/></Icon>
);
const IChevron = (p) => (
  <Icon {...p}><path d="m6 9 6 6 6-6"/></Icon>
);
const IFolder = (p) => (
  <Icon {...p}>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  </Icon>
);

Object.assign(window, { ISearch, IFilter, ISort, IPlus, IUpload, IChevron, IFolder });

// ── Book Card ────────────────────────────────────────────────────────────────
function BookCard({ book, onOpen }) {
  return (
    <button className="book-card" onClick={() => onOpen && onOpen(book)}>
      <div className="book-cover" data-format={book.format}>
        <BookCover id={book.id}/>
        <span className="book-format">{book.format}</span>
        {book.lang === "ar" && <span className="book-ar-badge">AR</span>}
        <div className="book-hover">
          <span>Open</span>
        </div>
      </div>
      <div className="book-meta">
        <div className="book-title display">{book.title}</div>
        <div className="book-author">{book.author}</div>
      </div>
      {book.progress > 0 && (
        <div className="book-progress">
          <div className="book-progress-bar">
            <div className="book-progress-fill" style={{ width: `${book.progress * 100}%` }}/>
          </div>
          <div className="book-progress-text">
            {book.progress >= 1 ? "Read" : `${Math.round(book.progress * 100)}%`}
          </div>
        </div>
      )}
    </button>
  );
}

// ── Public-domain card ───────────────────────────────────────────────────────
function PDCard({ book, onOpen }) {
  return (
    <button className="book-card" onClick={() => onOpen && onOpen(book)}>
      <div className="book-cover" data-format={book.format}>
        <BookCover id={book.id}/>
        <span className="book-format">{book.format}</span>
        {book.lang === "ar" && <span className="book-ar-badge">AR</span>}
        <div className="book-hover">
          <span>Add to library</span>
        </div>
      </div>
      <div className="book-meta">
        <div className="book-title display">{book.title}</div>
        <div className="book-author">{book.author}</div>
      </div>
      <div className="book-pd-badge">
        {book.owned ? "In library" : "Free · Public domain"}
      </div>
    </button>
  );
}

// ── Upload affordance ────────────────────────────────────────────────────────
function UploadCard({ onClick }) {
  return (
    <button className="upload-card" onClick={onClick}>
      <div className="upload-icon"><IUpload size={26}/></div>
      <div className="upload-title">Upload a book</div>
      <div className="upload-sub">PDF or EPUB</div>
    </button>
  );
}

// ── Collection folder card ───────────────────────────────────────────────────
function CollectionCard({ col, onOpen }) {
  return (
    <button className="collection-card" onClick={() => onOpen && onOpen(col)}>
      <div className="collection-spines">
        {col.ids.slice(0, 3).map((bid, i) => (
          <div key={bid} className="collection-spine" style={{ "--i": i }}>
            <BookCover id={bid}/>
          </div>
        ))}
        {col.ids.length > 3 && (
          <div className="collection-more">+{col.ids.length - 3}</div>
        )}
      </div>
      <div className="collection-meta">
        <div className="collection-name display">{col.name}</div>
        <div className="collection-count">{col.count} {col.count === 1 ? "book" : "books"}</div>
      </div>
    </button>
  );
}

// ── Upload modal (visual only) ───────────────────────────────────────────────
function UploadModal({ open, onClose }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className={`overlay${open ? " open" : ""}`} onClick={onClose}>
      <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
        <button className="window-close" aria-label="Close" onClick={onClose}>
          <IClose size={14}/>
        </button>
        <div className="upload-modal-drop">
          <div className="upload-modal-icon"><IUpload size={36}/></div>
          <h3 className="display">Drag your book here</h3>
          <p>PDF or EPUB · up to 50&nbsp;MB</p>
          <span className="upload-or">or</span>
          <button className="btn btn-primary btn-sm">Browse files</button>
        </div>
      </div>
    </div>
  );
}

// ── New collection modal ─────────────────────────────────────────────────────
function NewCollectionModal({ open, onClose, onSave }) {
  const [name, setName] = React.useState("");
  React.useEffect(() => {
    if (!open) { setName(""); return; }
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  const trimmed = name.trim();
  return (
    <div className="overlay open" onClick={onClose}>
      <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
        <button className="window-close" aria-label="Close" onClick={onClose}>
          <IClose size={14}/>
        </button>
        <div className="upload-modal-drop">
          <div className="upload-modal-icon"><IFolder size={36}/></div>
          <h3 className="display">New collection</h3>
          <p>Group books however you like — “For class”, “Rainy days”, anything.</p>
          <input className="journal-field-input"
                 style={{ marginTop: 14, width: "100%", maxWidth: 320 }}
                 placeholder="Collection name"
                 value={name}
                 autoFocus
                 onChange={(e) => setName(e.target.value)}
                 onKeyDown={(e) => e.key === "Enter" && trimmed && onSave(trimmed)}/>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary btn-sm"
                    disabled={!trimmed}
                    onClick={() => onSave(trimmed)}>
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Library top bar ──────────────────────────────────────────────────────────
function LibraryTopBar({ search, setSearch, filter, setFilter, sort, setSort, lang, setLang, count }) {
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [sortOpen, setSortOpen] = React.useState(false);
  const SORTS = {
    recent: "Recently opened",
    title:  "Title A–Z",
    author: "Author A–Z",
    prog:   "Progress"
  };

  return (
    <header className="lib-topbar">
      <div className="lib-title-row">
        <h1 className="lib-title display">My library</h1>
        <span className="lib-count">{count} books</span>
      </div>

      <div className="lib-actions">
        <div className="lib-search">
          <ISearch size={15}/>
          <input type="text" placeholder="Search books, authors…"
                 value={search} onChange={(e) => setSearch(e.target.value)}/>
        </div>

        <div className="lib-dropdown">
          <button className="lib-pill" onClick={() => { setFilterOpen(o => !o); setSortOpen(false); }}>
            <IFilter size={13}/>
            <span>{filter === "all" ? "All formats" : filter}</span>
            <IChevron size={12}/>
          </button>
          {filterOpen && (
            <div className="lib-menu" onMouseLeave={() => setFilterOpen(false)}>
              {["all", "EPUB", "PDF"].map(opt => (
                <button key={opt}
                        className={filter === opt ? "active" : ""}
                        onClick={() => { setFilter(opt); setFilterOpen(false); }}>
                  {opt === "all" ? "All formats" : opt}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lib-dropdown">
          <button className="lib-pill" onClick={() => { setSortOpen(o => !o); setFilterOpen(false); }}>
            <ISort size={13}/>
            <span>{SORTS[sort]}</span>
            <IChevron size={12}/>
          </button>
          {sortOpen && (
            <div className="lib-menu" onMouseLeave={() => setSortOpen(false)}>
              {Object.entries(SORTS).map(([key, label]) => (
                <button key={key}
                        className={sort === key ? "active" : ""}
                        onClick={() => { setSort(key); setSortOpen(false); }}>
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lang-pill compact">
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
          <span/>
          <button className={lang === "ar" ? "active" : ""} onClick={() => setLang("ar")}>AR</button>
        </div>
      </div>
    </header>
  );
}

// ── Tabs (My Books / Public Domain / Collections) ───────────────────────────
function LibraryTabs({ tab, setTab, counts }) {
  const tabs = [
    { id: "mine",     label: "My books",      count: counts.mine },
    { id: "pd",       label: "Public domain", count: counts.pd },
    { id: "coll",     label: "Collections",   count: counts.coll }
  ];
  return (
    <nav className="lib-tabs">
      {tabs.map(tt => (
        <button key={tt.id}
                className={`lib-tab${tab === tt.id ? " active" : ""}`}
                onClick={() => setTab(tt.id)}>
          <span>{tt.label}</span>
          <span className="lib-tab-count">{tt.count}</span>
        </button>
      ))}
    </nav>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
function LibraryApp() {
  const [t, setTweak] = useTweaks(LIB_TWEAK_DEFAULTS);
  const tStr = { ...STRINGS.en, ...DASH_STRINGS };

  const [tab, setTab] = React.useState("mine");
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [sort, setSort] = React.useState("recent");
  const [lang, setLang] = React.useState("en");
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [newCollOpen, setNewCollOpen] = React.useState(false);
  const [collections, setCollections] = React.useState(COLLECTIONS);
  const [toast, setToast] = React.useState(null);
  const flashToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };
  const onAddCollection = (name) => {
    const id = "c" + Date.now();
    setCollections(cs => [...cs, { id, name, count: 0, ids: [] }]);
    setNewCollOpen(false);
    flashToast(`Created “${name}”`);
  };
  const onPdClick = (book) => {
    if (book.owned) flashToast(`“${book.title}” is already in your library`);
    else flashToast(`Added “${book.title}” to your library`);
  };
  const onCollectionOpen = (col) => {
    setTab("mine");
    flashToast(`Showing ${col.name}`);
  };

  // Palette → root
  const paletteId = (Array.isArray(t.palette) && t.palette[0] === "#3F2A4A") ? "dusk"
                  : (Array.isArray(t.palette) && t.palette[0] === "#2E3A2E") ? "olive"
                  : (Array.isArray(t.palette) && t.palette[0] === "#1F140C") ? "candlelight"
                  : "rose";
  React.useEffect(() => {
    document.documentElement.setAttribute("data-palette", paletteId);
  }, [paletteId]);

  React.useEffect(() => {
    document.documentElement.dir = "ltr";
    document.documentElement.lang = "en";
  }, []);

  const filtered = (list) => {
    let out = list;
    if (filter !== "all") out = out.filter(b => b.format === filter);
    if (lang === "ar") out = out.filter(b => b.lang === "ar");
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }
    const sorters = {
      recent: (a, b) => (b.progress || 0) - (a.progress || 0),
      title:  (a, b) => a.title.localeCompare(b.title),
      author: (a, b) => a.author.localeCompare(b.author),
      prog:   (a, b) => (b.progress || 0) - (a.progress || 0)
    };
    return [...out].sort(sorters[sort] || sorters.recent);
  };

  const openBook = () => { window.location.href = "Reader.html"; };

  const counts = {
    mine: MY_BOOKS.length,
    pd:   PD_BOOKS.length,
    coll: collections.length
  };

  return (
    <>
      <div className="library-stage" data-screen-label="04 Library">
        {/* Ambient backdrop — softened scene */}
        <div className="library-bg">
          <SceneMaghrib/>
        </div>
        <div className="library-tint"/>
        <div className="grain"/>

        <Sidebar active="library" t={tStr}/>

        <div className="library-content">
          <LibraryTopBar search={search} setSearch={setSearch}
                         filter={filter} setFilter={setFilter}
                         sort={sort} setSort={setSort}
                         lang={lang} setLang={setLang}
                         count={MY_BOOKS.length}/>

          <LibraryTabs tab={tab} setTab={setTab} counts={counts}/>

          {/* My Books */}
          {tab === "mine" && (
            <div className="book-grid">
              {filtered(MY_BOOKS).map(book => (
                <BookCard key={book.id} book={book} onOpen={openBook}/>
              ))}
              <UploadCard onClick={() => setUploadOpen(true)}/>
            </div>
          )}

          {/* Public Domain */}
          {tab === "pd" && (
            <div className="book-grid">
              {filtered(PD_BOOKS).map(book => (
                <PDCard key={book.id + "-pd"} book={book} onOpen={onPdClick}/>
              ))}
            </div>
          )}

          {/* Collections */}
          {tab === "coll" && (
            <div className="collection-grid">
              {collections.map(col => (
                <CollectionCard key={col.id} col={col} onOpen={onCollectionOpen}/>
              ))}
              <button className="upload-card collection-new"
                      onClick={() => setNewCollOpen(true)}>
                <div className="upload-icon"><IPlus size={26}/></div>
                <div className="upload-title">New collection</div>
              </button>
            </div>
          )}
        </div>

        <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)}/>
        <NewCollectionModal open={newCollOpen}
                            onClose={() => setNewCollOpen(false)}
                            onSave={onAddCollection}/>
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
root.render(<LibraryApp/>);
