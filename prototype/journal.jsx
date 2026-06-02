// journal.jsx
// Rukn — Journal (Screen 6). All journal entries: passage-linked reflections,
// freeform thoughts, filtered and searchable, with a detail panel.
// Layout mirrors Library: sidebar + content area over a softened scene.

const JOURNAL_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#3F2A4A", "#C66B3D", "#F2B36A"]
}/*EDITMODE-END*/;

// ── Entries ───────────────────────────────────────────────────────────────────
const ENTRIES = [
  {
    id: "e1",
    date: "Tue, May 14",
    mood: "🌙",
    title: "On surrender",
    book: { id: "prophet", title: "The Prophet", author: "Khalil Gibran" },
    page: 47, chapter: "Chapter 3 — On Love",
    color: "amber",
    quote: "When love beckons to you, follow him, though his ways are hard and steep.",
    body: "The image of yielding to a winged thing that may wound you. There is no soft love that does not also cost something. Gibran does not allow love to be a transaction. I am writing this from the window seat at midnight, the rain hasn't stopped since Friday, and I keep returning to the line about wings that hide swords.",
    tags: ["surrender", "wisdom", "rain"]
  },
  {
    id: "e2",
    date: "Mon, May 13",
    mood: "☕",
    title: "Late night thoughts",
    book: null,
    body: "Couldn't sleep so I read a few pages of nothing in particular, just turned the lamp on low and listened to the kettle. The week has been heavy. Sometimes a journal entry is just an alibi for being awake.",
    tags: ["reflection", "insomnia"]
  },
  {
    id: "e3",
    date: "Sun, May 12",
    mood: "✨",
    title: "On pride, and its quieter sibling",
    book: { id: "pride", title: "Pride and Prejudice", author: "Jane Austen" },
    page: 84, chapter: "Volume I, Ch. 11",
    color: "rose",
    quote: "Vanity and pride are different things, though the words are often used synonymously.",
    body: "Mary Bennet has the line and nobody listens to her — that is the joke. But she is also right, and the rightness is what makes the joke land. Pride is what we think of ourselves. Vanity is what we want others to think.",
    tags: ["classic", "growth"]
  },
  {
    id: "e4",
    date: "Sat, May 11",
    mood: "🌧️",
    title: "زقاق المدق — مساء",
    book: { id: "midaq", title: "Midaq Alley", author: "Naguib Mahfouz" },
    page: 132, chapter: "الفصل الثاني عشر",
    color: "olive",
    quote: "كان الزقاق يلفّه الهدوء كأنه ينام بعد يوم طويل من الضجيج.",
    body: "محفوظ يعرف كيف يجعل المكان شخصية. الزقاق ليس خلفية للأحداث — هو من يحرّكها. قرأت ثلاث صفحات اليوم وكأني جلست في مقهى كرشة بنفسي.",
    tags: ["arabic-lit", "place", "mahfouz"],
    rtl: true
  },
  {
    id: "e5",
    date: "Thu, May 9",
    mood: "🍂",
    title: "What I learned today",
    book: null,
    body: "Three things: (1) I read better in the evenings than I think I do — my morning attempts to read are mostly performance. (2) Notes I write while reading are not for re-reading. They are for paying attention. (3) Streaks are not the point but they are not nothing either.",
    tags: ["meta", "habits"]
  },
  {
    id: "e6",
    date: "Wed, May 8",
    mood: "🌙",
    title: "Marcus, again",
    book: { id: "meditations", title: "Meditations", author: "Marcus Aurelius" },
    page: 22, chapter: "Book II",
    color: "amber",
    quote: "Begin the morning by saying to thyself, I shall meet with the busybody, the ungrateful, the arrogant.",
    body: "He sounds tired. That is what I love about him. He is not pretending. The advice that follows — that none of these are evil, only ignorant — is what stoicism has to offer when it works.",
    tags: ["stoicism", "morning"]
  }
];

// ── Icons used by Journal (additions on top of the global set) ───────────────
// Local definitions of icons that library.jsx also defines — kept here so the
// Journal screen is self-contained and doesn't need to load library.jsx.
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
const IChevron = (p) => (
  <Icon {...p}><path d="m6 9 6 6 6-6"/></Icon>
);

const IPen = (p) => (
  <Icon {...p}>
    <path d="M14 4l6 6-9 9-6-6z"/>
    <path d="M3 21l3-3"/>
  </Icon>
);
const ITrash = (p) => (
  <Icon {...p}>
    <path d="M4 7h16"/>
    <path d="M9 7V4h6v3"/>
    <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/>
    <path d="M10 11v7M14 11v7"/>
  </Icon>
);
const IShareNet = (p) => (
  <Icon {...p}>
    <circle cx="6" cy="12" r="2.5"/>
    <circle cx="18" cy="6" r="2.5"/>
    <circle cx="18" cy="18" r="2.5"/>
    <path d="M8.2 11l7.6-4M8.2 13l7.6 4"/>
  </Icon>
);
const IBookLink = (p) => (
  <Icon {...p}>
    <path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/>
    <path d="M4 17a3 3 0 0 1 3-3h12"/>
  </Icon>
);
const IArrowRight = (p) => (
  <Icon {...p}>
    <path d="M5 12h14"/>
    <path d="M13 5l7 7-7 7"/>
  </Icon>
);
const ICloseX = (p) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6L6 18"/>
  </Icon>
);

// ── Top bar (journal) ────────────────────────────────────────────────────────
function JournalTopBar({ search, setSearch, count, tagFilter, setTagFilter, allTags, lang, setLang }) {
  const [filterOpen, setFilterOpen] = React.useState(false);
  return (
    <header className="lib-topbar">
      <div className="lib-title-row">
        <h1 className="lib-title display">Journal</h1>
        <span className="lib-count">{count} entries</span>
      </div>

      <div className="lib-actions">
        <div className="lib-search">
          <ISearch size={15}/>
          <input type="text"
                 placeholder="Search entries, books, tags…"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}/>
        </div>

        <div className="lib-dropdown">
          <button className={`lib-pill${tagFilter ? " active" : ""}`}
                  aria-label="Filter by tag"
                  onClick={() => setFilterOpen(o => !o)}>
            <IFilter size={13}/>
            <span>{tagFilter ? `#${tagFilter}` : "Filter"}</span>
          </button>
          {filterOpen && (
            <div className="lib-menu" onMouseLeave={() => setFilterOpen(false)}>
              <button className={!tagFilter ? "active" : ""}
                      onClick={() => { setTagFilter(null); setFilterOpen(false); }}>
                All tags
              </button>
              {allTags.map(tag => (
                <button key={tag}
                        className={tagFilter === tag ? "active" : ""}
                        onClick={() => { setTagFilter(tag); setFilterOpen(false); }}>
                  #{tag}
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

// ── Tabs ─────────────────────────────────────────────────────────────────────
function JournalTabs({ tab, setTab, counts, sort, setSort }) {
  const tabs = [
    { id: "all",  label: "All entries", count: counts.all },
    { id: "book", label: "By book",     count: counts.book },
    { id: "free", label: "Freeform",    count: counts.free }
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
      <div style={{ flex: 1 }}/>
      <button className="lib-pill"
              onClick={() => setSort(sort === "new" ? "old" : "new")}>
        <ISort size={14}/>
        <span>{sort === "new" ? "Newest first" : "Oldest first"}</span>
      </button>
    </nav>
  );
}

// ── Entry card ───────────────────────────────────────────────────────────────
function EntryCard({ entry, selected, onClick }) {
  return (
    <button className={"journal-card" + (selected ? " selected" : "")}
            onClick={() => onClick(entry.id)}>
      <header className="journal-card-head">
        <span className="journal-card-date">{entry.date}</span>
        <span className="journal-card-mood">{entry.mood}</span>
      </header>
      <h3 className="journal-card-title display" dir={entry.rtl ? "rtl" : "ltr"}>
        {entry.title}
      </h3>
      {entry.book && (
        <div className="journal-card-book">
          <IBookLink size={12}/>
          <span className="journal-card-book-title">{entry.book.title}</span>
          <span className="journal-card-book-sep">·</span>
          <span className="journal-card-book-page">p.{entry.page}</span>
        </div>
      )}
      {!entry.book && (
        <div className="journal-card-book journal-card-freeform">
          <IPen size={11}/>
          <span>Freeform</span>
        </div>
      )}
      <p className="journal-card-excerpt" dir={entry.rtl ? "rtl" : "ltr"}>
        {entry.body.length > 130 ? entry.body.slice(0, 130) + "…" : entry.body}
      </p>
      <div className="journal-card-tags">
        {entry.tags.slice(0, 3).map(tag => (
          <span key={tag} className="tag-chip">
            <span className="tag-chip-hash">#</span>{tag}
          </span>
        ))}
      </div>
    </button>
  );
}

// ── Detail panel ─────────────────────────────────────────────────────────────
function EntryDetail({ entry, onOpenInBook, onDelete, onEdit, onShare }) {
  if (!entry) {
    return (
      <div className="journal-detail journal-detail-empty">
        <div className="journal-empty-mark">۞</div>
        <p>Pick an entry on the left to read it here.</p>
      </div>
    );
  }
  return (
    <article className="journal-detail" dir={entry.rtl ? "rtl" : "ltr"}>
      <header className="journal-detail-head">
        <div className="journal-detail-meta">
          <span className="journal-detail-date">{entry.date}</span>
          <span className="journal-detail-mood">{entry.mood}</span>
        </div>
        <div className="journal-detail-actions">
          <button className="reader-icon-btn" aria-label="Edit" onClick={onEdit}>
            <IPen size={14}/>
          </button>
          <button className="reader-icon-btn" aria-label="Share" onClick={onShare}>
            <IShareNet size={14}/>
          </button>
          <button className="reader-icon-btn" aria-label="Delete" onClick={onDelete}>
            <ITrash size={14}/>
          </button>
        </div>
      </header>

      {entry.book && entry.quote && (
        <div className={"journal-quote journal-quote-" + entry.color}>
          <div className="journal-quote-mark">"</div>
          <blockquote>{entry.quote}</blockquote>
          <div className="journal-quote-source">
            <span className="display">{entry.book.title}</span>
            <span className="journal-quote-sep">·</span>
            <span>{entry.chapter}</span>
            <span className="journal-quote-sep">·</span>
            <span>p.{entry.page}</span>
            <button className="journal-quote-link"
                    onClick={() => onOpenInBook(entry)}>
              <span>Open in book</span>
              <IArrowRight size={12}/>
            </button>
          </div>
        </div>
      )}

      <h1 className="journal-detail-title display">{entry.title}</h1>

      <div className={"journal-prose" + (entry.rtl ? " journal-prose-ar" : "")}>
        {entry.body.split("\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <footer className="journal-detail-foot">
        <div className="journal-detail-tags">
          {entry.tags.map(tag => (
            <span key={tag} className="tag-chip">
              <span className="tag-chip-hash">#</span>{tag}
            </span>
          ))}
        </div>
      </footer>
    </article>
  );
}

// ── New Entry overlay ────────────────────────────────────────────────────────
function NewEntryOverlay({ open, onClose, onSave, initial }) {
  const [title, setTitle] = React.useState("");
  const [body, setBody]   = React.useState("");
  const [mood, setMood]   = React.useState("🌙");
  const [tags, setTags]   = React.useState([]);
  const [tagDraft, setTagDraft] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setTitle(initial?.title || "");
    setBody(initial?.body || "");
    setMood(initial?.mood || "🌙");
    setTags(initial?.tags || []);
    setTagDraft("");
  }, [open, initial]);

  if (!open) return null;

  const addTag = () => {
    const v = tagDraft.trim().replace(/^#/, "");
    if (v && !tags.includes(v)) setTags([...tags, v]);
    setTagDraft("");
  };

  return (
    <div className="journal-overlay-back" onClick={onClose}>
      <div className="journal-overlay glass" onClick={(e) => e.stopPropagation()}>
        <header className="journal-overlay-head">
          <h2 className="display">{initial ? "Edit journal entry" : "New journal entry"}</h2>
          <button className="reader-icon-btn" onClick={onClose} aria-label="Close">
            <ICloseX size={14}/>
          </button>
        </header>

        <div className="journal-overlay-row">
          <label className="journal-field-lbl">Mood</label>
          <div className="journal-mood-row">
            {["🌙","☕","🌧️","✨","🍂"].map(m => (
              <button key={m}
                      className={"journal-mood-btn" + (mood === m ? " active" : "")}
                      onClick={() => setMood(m)}>{m}</button>
            ))}
          </div>
        </div>

        <div className="journal-overlay-row">
          <label className="journal-field-lbl">Title</label>
          <input className="journal-field-input"
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 placeholder="What's on your mind?"/>
        </div>

        <div className="journal-overlay-row">
          <label className="journal-field-lbl">Body</label>
          <div className="journal-rich-bar">
            <button className="journal-rich-btn"><b>B</b></button>
            <button className="journal-rich-btn"><i>I</i></button>
            <button className="journal-rich-btn"><u>U</u></button>
            <span className="journal-rich-div"/>
            <button className="journal-rich-btn">H1</button>
            <button className="journal-rich-btn">H2</button>
            <span className="journal-rich-div"/>
            <button className="journal-rich-btn">List</button>
            <button className="journal-rich-btn">Quote</button>
          </div>
          <textarea className="journal-field-textarea"
                    rows={6}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write freely. This is yours."/>
        </div>

        <div className="journal-overlay-row">
          <label className="journal-field-lbl">Tags</label>
          <div className="journal-tags-edit">
            {tags.map(tag => (
              <span key={tag} className="tag-chip tag-chip-removable">
                <span className="tag-chip-hash">#</span>{tag}
                <button onClick={() => setTags(tags.filter(t => t !== tag))}
                        aria-label="Remove tag">×</button>
              </span>
            ))}
            <input className="journal-tag-add"
                   value={tagDraft}
                   onChange={(e) => setTagDraft(e.target.value)}
                   onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                   placeholder="+ add tag"/>
          </div>
        </div>

        <footer className="journal-overlay-foot">
          <button className="btn btn-ghost" onClick={onClose}>Discard</button>
          <button className="btn btn-primary" onClick={() => onSave({ title, body, mood, tags })}>
            Save entry
          </button>
        </footer>
      </div>
    </div>
  );
}

// ── Delete confirmation ──────────────────────────────────────────────────────
function DeleteConfirm({ open, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="journal-overlay-back" onClick={onCancel}>
      <div className="journal-confirm glass" onClick={(e) => e.stopPropagation()}>
        <h3 className="display">Delete this entry?</h3>
        <p>This cannot be undone. If this entry is linked to a highlighted passage, the highlight will remain in the book.</p>
        <div className="journal-confirm-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
function JournalApp() {
  const [t, setTweak] = useTweaks(JOURNAL_TWEAK_DEFAULTS);
  const tStr = { ...STRINGS.en, ...DASH_STRINGS };

  const [tab, setTab]           = React.useState("all");
  const [search, setSearch]     = React.useState("");
  const [sort, setSort]         = React.useState("new");
  const [selectedId, setSelId]  = React.useState("e1");
  const [newOpen, setNewOpen]   = React.useState(false);
  const [editing, setEditing]   = React.useState(null);
  const [deleteOpen, setDelOpen]= React.useState(false);
  const [entries, setEntries]   = React.useState(ENTRIES);
  const [tagFilter, setTagFilter] = React.useState(null);
  const [lang, setLang]         = React.useState("en");
  const [toast, setToast]       = React.useState(null);
  const flashToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };
  const allTags = React.useMemo(() => {
    const s = new Set();
    entries.forEach(e => e.tags.forEach(t => s.add(t)));
    return [...s].sort();
  }, [entries]);

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

  const filtered = entries.filter(e => {
    if (tab === "book" && !e.book) return false;
    if (tab === "free" && e.book) return false;
    if (tagFilter && !e.tags.includes(tagFilter)) return false;
    if (lang === "ar" && !e.rtl) return false;
    if (search) {
      const q = search.toLowerCase();
      const hay = (e.title + " " + e.body + " " + e.tags.join(" ") +
                   (e.book ? " " + e.book.title : "")).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const sorted = sort === "new" ? filtered : [...filtered].reverse();
  const selected = sorted.find(e => e.id === selectedId) || sorted[0];

  const counts = {
    all:  entries.length,
    book: entries.filter(e => e.book).length,
    free: entries.filter(e => !e.book).length
  };

  const onSaveEntry = (data) => {
    if (editing) {
      setEntries(entries.map(e => e.id === editing.id
        ? { ...e, title: data.title || "Untitled", body: data.body || "",
            mood: data.mood, tags: data.tags }
        : e));
      setSelId(editing.id);
      setEditing(null);
      setNewOpen(false);
      flashToast("Entry updated");
      return;
    }
    const newEntry = {
      id: "e" + Date.now(),
      date: "Today",
      mood: data.mood,
      title: data.title || "Untitled",
      book: null,
      body: data.body || "",
      tags: data.tags
    };
    setEntries([newEntry, ...entries]);
    setSelId(newEntry.id);
    setNewOpen(false);
    flashToast("Entry saved");
  };
  const onEditEntry = () => {
    if (!selected) return;
    setEditing(selected);
    setNewOpen(true);
  };
  const onShareEntry = () => {
    if (!selected) return;
    try {
      navigator.clipboard?.writeText(`rukn://journal/${selected.id}`);
    } catch (e) {}
    flashToast("Link copied to clipboard");
  };

  const onDelete = () => {
    if (!selected) return;
    const idx = entries.findIndex(e => e.id === selected.id);
    const next = entries.filter(e => e.id !== selected.id);
    setEntries(next);
    const nextSel = next[Math.min(idx, next.length - 1)];
    if (nextSel) setSelId(nextSel.id);
    setDelOpen(false);
  };

  return (
    <>
      <div className="library-stage" data-screen-label="06 Journal">
        <div className="library-bg">
          <SceneMaghrib/>
        </div>
        <div className="library-tint"/>
        <div className="grain"/>

        <Sidebar active="journal" t={tStr}/>

        <div className="library-content">
          <JournalTopBar search={search} setSearch={setSearch}
                         count={sorted.length}
                         tagFilter={tagFilter} setTagFilter={setTagFilter}
                         allTags={allTags}
                         lang={lang} setLang={setLang}/>
          <JournalTabs tab={tab} setTab={setTab} counts={counts}
                       sort={sort} setSort={setSort}/>

          <div className="journal-body-row">
            <aside className="journal-list">
              {sorted.length === 0 && (
                <div className="journal-empty">
                  <p>No entries match.</p>
                </div>
              )}
              {sorted.map(e => (
                <EntryCard key={e.id} entry={e}
                           selected={selected && selected.id === e.id}
                           onClick={setSelId}/>
              ))}
            </aside>

            <section className="journal-detail-wrap">
              <EntryDetail entry={selected}
                           onOpenInBook={() => { window.location.href = "Reader.html"; }}
                           onEdit={onEditEntry}
                           onShare={onShareEntry}
                           onDelete={() => setDelOpen(true)}/>
            </section>
          </div>

          <button className="journal-fab"
                  onClick={() => setNewOpen(true)}>
            <IPlus size={18}/>
            <span>New entry</span>
          </button>
        </div>

        <NewEntryOverlay open={newOpen}
                         onClose={() => { setNewOpen(false); setEditing(null); }}
                         onSave={onSaveEntry}
                         initial={editing}/>

        <DeleteConfirm open={deleteOpen}
                       onConfirm={onDelete}
                       onCancel={() => setDelOpen(false)}/>

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
root.render(<JournalApp/>);
