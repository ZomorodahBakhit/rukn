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
        <BookCover id={book.id} title={book.title} author={book.author}/>
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
        <BookCover id={book.id} title={book.title} author={book.author}/>
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
function UploadModal({ open, onClose, onUploaded }) {
  const [file, setFile]     = React.useState(null);
  const [title, setTitle]   = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [pages, setPages]   = React.useState("");
  const [busy, setBusy]     = React.useState(false);
  const [err, setErr]       = React.useState("");
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Reset state every time the modal opens.
  React.useEffect(() => {
    if (open) {
      setFile(null); setTitle(""); setAuthor(""); setPages("");
      setBusy(false); setErr(""); setDragOver(false);
    }
  }, [open]);

  const accept = (f) => {
    if (!f) return;
    const ext = (f.name.split(".").pop() || "").toLowerCase();
    if (!["pdf", "epub"].includes(ext)) {
      setErr("Only PDF and EPUB files are accepted.");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setErr("File is larger than 20 MB.");
      return;
    }
    setErr("");
    setFile(f);
    // Auto-fill title from filename if user hasn't typed one yet.
    if (!title) {
      const guessed = f.name.replace(/\.[^.]+$/, "").replace(/[_\-]+/g, " ").trim();
      setTitle(guessed);
    }
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    accept(e.dataTransfer.files && e.dataTransfer.files[0]);
  };

  const submit = async () => {
    if (!file || busy) return;
    setBusy(true); setErr("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", title.trim());
    fd.append("author", author.trim());
    if (pages) fd.append("pages", String(parseInt(pages, 10) || 0));
    try {
      const res = await fetch("api/upload.php", {
        method: "POST", body: fd, credentials: "same-origin",
      });
      const data = await res.json();
      if (data.ok) {
        onUploaded && onUploaded(data.book);
        onClose();
      } else {
        setErr(data.error || "Upload failed.");
      }
    } catch (e) {
      setErr(String(e && e.message || e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`overlay${open ? " open" : ""}`} onClick={onClose}>
      <div className="upload-modal" onClick={(e) => e.stopPropagation()}
           style={{ maxWidth: 460, padding: 28 }}>
        <button className="window-close" aria-label="Close" onClick={onClose}>
          <IClose size={14}/>
        </button>

        {!file ? (
          <div className={"upload-modal-drop" + (dragOver ? " dragging" : "")}
               onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
               onDragLeave={() => setDragOver(false)}
               onDrop={onDrop}
               onClick={() => inputRef.current && inputRef.current.click()}
               style={{ cursor: "pointer" }}>
            <div className="upload-modal-icon"><IUpload size={36}/></div>
            <h3 className="display">Drag your book here</h3>
            <p>PDF or EPUB · up to 20 MB</p>
            <span className="upload-or">or</span>
            <button className="btn btn-primary btn-sm"
                    onClick={(e) => { e.stopPropagation(); inputRef.current && inputRef.current.click(); }}>
              Browse files
            </button>
            <input ref={inputRef} type="file" accept=".pdf,.epub"
                   style={{ display: "none" }}
                   onChange={(e) => accept(e.target.files && e.target.files[0])}/>
            {err ? (
              <div className="field-error" style={{
                  marginTop: 14, padding: "8px 12px",
                  background: "rgba(220,100,80,0.10)",
                  border: "1px solid rgba(220,100,80,0.40)",
                  borderRadius: "var(--r-md)"}}>{err}</div>
            ) : null}
          </div>
        ) : (
          <div style={{ padding: "8px 0" }}>
            <h3 className="display" style={{ margin: "0 0 4px" }}>About this book</h3>
            <p style={{ fontSize: 12.5, color: "var(--on-glass-soft)", margin: "0 0 18px" }}>
              <strong style={{ color: "var(--on-glass)" }}>{file.name}</strong>{" "}
              · {(file.size / 1024 / 1024).toFixed(1)} MB
            </p>

            <div className="field" style={{ marginBottom: 12 }}>
              <label>Title</label>
              <div className="field-control">
                <input type="text" value={title}
                       onChange={(e) => setTitle(e.target.value)}
                       placeholder="The Prophet"/>
              </div>
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label>Author</label>
              <div className="field-control">
                <input type="text" value={author}
                       onChange={(e) => setAuthor(e.target.value)}
                       placeholder="Khalil Gibran"/>
              </div>
            </div>
            <div className="field" style={{ marginBottom: 16 }}>
              <label>Pages (optional)</label>
              <div className="field-control">
                <input type="number" min="1" value={pages}
                       onChange={(e) => setPages(e.target.value)}
                       placeholder="96"/>
              </div>
            </div>

            {err ? (
              <div className="field-error" style={{
                  marginBottom: 12, padding: "8px 12px",
                  background: "rgba(220,100,80,0.10)",
                  border: "1px solid rgba(220,100,80,0.40)",
                  borderRadius: "var(--r-md)"}}>{err}</div>
            ) : null}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setFile(null)} disabled={busy}>
                Pick a different file
              </button>
              <button className="btn btn-primary" onClick={submit} disabled={busy || !title.trim()}>
                {busy ? "Uploading…" : "Add to library"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Library top bar ──────────────────────────────────────────────────────────
function LibraryTopBar({ search, setSearch, filter, setFilter, sort, setSort }) {
  const [filterOpen, setFilterOpen] = React.useState(false);

  return (
    <header className="lib-topbar">
      <div className="lib-title-row">
        <h1 className="lib-title display">My library</h1>
        <span className="lib-count">7 books</span>
      </div>

      <div className="lib-actions">
        <div className="lib-search">
          <ISearch size={15}/>
          <input type="text" placeholder="Search books, authors…"
                 value={search} onChange={(e) => setSearch(e.target.value)}/>
        </div>

        <div className="lib-dropdown">
          <button className="lib-pill" onClick={() => setFilterOpen(o => !o)}>
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

        <LangPill/>
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
  const [uploadOpen, setUploadOpen] = React.useState(false);

  // Real book data loaded from /api/api.php?action=library.
  // Falls back to the mock arrays at the top of this file if the API isn't reachable.
  const [myBooks, setMyBooks]   = React.useState(MY_BOOKS);
  const [pdBooks, setPdBooks]   = React.useState(PD_BOOKS);
  const [loading, setLoading]   = React.useState(true);

  React.useEffect(() => {
    if (!window.RuknAPI) { setLoading(false); return; }
    (async () => {
      const r = await window.RuknAPI.call("library");
      if (r.data.ok && Array.isArray(r.data.books)) {
        const mapped = r.data.books.map(b => {
          // Match the title against the hand-drawn cover set; fall through to
          // the procedural cover (CoverAuto) for anything we haven't designed.
          const coverKey = (typeof coverKeyFromTitle === "function")
            ? coverKeyFromTitle(b.title)
            : null;
          return {
            id:          coverKey || ("book_" + b.book_id),
            book_id:     b.book_id,
            title:       b.title,
            author:      b.author || "Unknown",
            format:      b.format,
            progress:    (b.percent_complete || 0) / 100,
            lang:        /[؀-ۿ]/.test(b.title || "") ? "ar" : "en",
            openable:    true,
            isPublic:    !!b.is_public_domain,
            hasProgress: !!b.current_page && b.current_page > 0,
          };
        });
        // Mine = books the user has progress in OR uploaded themselves
        setMyBooks(mapped.filter(b => b.hasProgress));
        // Public Domain = public books from the catalog
        setPdBooks(mapped.filter(b => b.isPublic));
      }
      setLoading(false);
    })();
  }, []);

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
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }
    return out;
  };

  const openBook = (book) => {
    // Pass the book_id so the Reader knows which content to load.
    const id = (book && (book.book_id || book.id)) || "";
    window.location.href = "Reader.html" + (id ? "?book=" + encodeURIComponent(id) : "");
  };

  const counts = {
    mine: myBooks.length,
    pd:   pdBooks.length,
    coll: COLLECTIONS.length
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
                         sort={sort} setSort={setSort}/>

          <LibraryTabs tab={tab} setTab={setTab} counts={counts}/>

          {/* My Books */}
          {tab === "mine" && (
            <div className="book-grid">
              {filtered(myBooks).map(book => (
                <BookCard key={book.book_id || book.id} book={book} onOpen={openBook}/>
              ))}
              <UploadCard onClick={() => setUploadOpen(true)}/>
            </div>
          )}

          {/* Public Domain */}
          {tab === "pd" && (
            <div className="book-grid">
              {filtered(pdBooks).map(book => (
                <PDCard key={(book.book_id || book.id) + "-pd"} book={book} onOpen={openBook}/>
              ))}
            </div>
          )}

          {/* Collections */}
          {tab === "coll" && (
            <div className="collection-grid">
              {COLLECTIONS.map(col => (
                <CollectionCard key={col.id} col={col}/>
              ))}
              <button className="upload-card collection-new"
                      onClick={() => {}}>
                <div className="upload-icon"><IPlus size={26}/></div>
                <div className="upload-title">New collection</div>
              </button>
            </div>
          )}
        </div>

        <UploadModal open={uploadOpen}
                     onClose={() => setUploadOpen(false)}
                     onUploaded={(book) => {
                       // Prepend the newly-uploaded book to "My books" so it appears immediately.
                       const coverKey = (typeof coverKeyFromTitle === "function")
                         ? coverKeyFromTitle(book.title) : null;
                       const fresh = {
                         id:        coverKey || ("book_" + book.book_id),
                         book_id:   book.book_id,
                         title:     book.title,
                         author:    book.author,
                         format:    book.format,
                         progress:  0,
                         lang:      "en",
                         openable:  true,
                         isPublic:  false,
                         hasProgress: true,
                       };
                       setMyBooks(prev => [fresh, ...prev]);
                     }}/>
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
