// reader.jsx
// Rukn — Reader View (Screen 5). The signature passage-linked annotation flow.
// Sample content: The Prophet — Khalil Gibran, Chapter 3, "On Love".

const READER_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "sepia",
  "fontSize": 19,
  "font": "serif"
}/*EDITMODE-END*/;

// ── The Prophet — public domain excerpts ───────────────────────────────────
// Each paragraph carries a `chapter` label so the reader can paginate by
// chapter (3 chapters available: On Love, On Marriage, On Children).
const CHAPTERS = ["On Love", "On Marriage", "On Children"];
const PASSAGE = [
  {
    id: "p1",
    text: `Then said Almitra, "Speak to us of Love." And he raised his head and looked upon the people, and there fell a stillness upon them. And with a great voice he said:`
  },
  {
    id: "p2",
    text: `When love beckons to you, follow him, though his ways are hard and steep. And when his wings enfold you yield to him, though the sword hidden among his pinions may wound you.`,
    highlights: [
      { id: "h1", start: 0, end: 113, color: "amber",
        note: { title: "On surrender", body: "The image of yielding to a winged thing that may wound you. There is no soft love that does not also cost something.", tags: ["surrender", "wisdom"] }
      }
    ]
  },
  {
    id: "p3",
    text: `And when he speaks to you believe in him, though his voice may shatter your dreams as the north wind lays waste the garden. For even as love crowns you so shall he crucify you. Even as he is for your growth so is he for your pruning.`,
    highlights: [
      { id: "h2", start: 117, end: 173, color: "rose",
        note: null // no note attached — just a highlight
      }
    ]
  },
  {
    id: "p4",
    text: `Even as he ascends to your height and caresses your tenderest branches that quiver in the sun, so shall he descend to your roots and shake them in their clinging to the earth.`
  },
  {
    id: "p5",
    text: `Like sheaves of corn he gathers you unto himself. He threshes you to make you naked. He sifts you to free you from your husks. He grinds you to whiteness. He kneads you until you are pliant; and then he assigns you to his sacred fire, that you may become sacred bread for God's sacred feast.`
  },
  {
    id: "p6",
    text: `All these things shall love do unto you that you may know the secrets of your heart, and in that knowing become a fragment of Life's heart.`
  },
  // Then Almitra spoke again and said, "And what of Marriage, master?" — chapter 4
  {
    id: "p7",
    text: `Then Almitra spoke again and said, "And what of Marriage, master?" And he answered saying: You were born together, and together you shall be forevermore.`
  },
  {
    id: "p8",
    text: `You shall be together when the white wings of death scatter your days. Aye, you shall be together even in the silent memory of God. But let there be spaces in your togetherness, and let the winds of the heavens dance between you.`
  },
  {
    id: "p9",
    text: `Love one another, but make not a bond of love: Let it rather be a moving sea between the shores of your souls. Fill each other's cup but drink not from one cup. Give one another of your bread but eat not from the same loaf.`
  },
  {
    id: "p10",
    text: `Sing and dance together and be joyous, but let each one of you be alone, even as the strings of a lute are alone though they quiver with the same music. Give your hearts, but not into each other's keeping. For only the hand of Life can contain your hearts.`
  },
  {
    id: "p11",
    text: `And stand together yet not too near together: For the pillars of the temple stand apart, and the oak tree and the cypress grow not in each other's shadow.`
  },
  // And a woman who held a babe against her bosom said, "Speak to us of Children."
  {
    id: "p12",
    text: `And a woman who held a babe against her bosom said, "Speak to us of Children." And he said: Your children are not your children. They are the sons and daughters of Life's longing for itself. They come through you but not from you, and though they are with you yet they belong not to you.`
  },
  {
    id: "p13",
    text: `You may give them your love but not your thoughts, for they have their own thoughts. You may house their bodies but not their souls, for their souls dwell in the house of tomorrow, which you cannot visit, not even in your dreams.`
  },
  {
    id: "p14",
    text: `You may strive to be like them, but seek not to make them like you. For life goes not backward nor tarries with yesterday. You are the bows from which your children as living arrows are sent forth.`
  }
];

// Existing notes shown in the right panel by default — older notes from
// earlier in the chapter.
const EXISTING_NOTES = [
  {
    id: "n0",
    page: 45,
    color: "amber",
    excerpt: "Love possesses not nor would it be possessed; for love is sufficient unto love.",
    title: "On the self-sufficiency of love",
    body: "Gibran does not allow love to be a transaction. The line keeps returning to me.",
    tags: ["wisdom"]
  },
  {
    id: "n1",
    page: 46,
    color: "olive",
    excerpt: "Think not you can direct the course of love, for love, if it finds you worthy, directs your course.",
    title: "On not directing it",
    body: "I have spent years trying. Reading this at thirty feels different than reading it at twenty.",
    tags: ["empathy", "reflection"]
  }
];

// ── Icons specific to the reader ─────────────────────────────────────────────
const IHighlight = (p) => (
  <Icon {...p}>
    <path d="M14 4l6 6-9 9-6-6z"/>
    <path d="M5 13l6 6"/>
    <path d="M3 21l3-3"/>
  </Icon>
);
const INote = (p) => (
  <Icon {...p}>
    <path d="M14 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9"/>
    <path d="M14 3v6h6"/>
    <line x1="8" y1="13" x2="14" y2="13"/>
    <line x1="8" y1="17" x2="12" y2="17"/>
  </Icon>
);
const IBookmark = (p) => (
  <Icon {...p}>
    <path d="M6 4h12a1 1 0 0 1 1 1v16l-7-4-7 4V5a1 1 0 0 1 1-1z"/>
  </Icon>
);
const IBookmarkFill = (p) => (
  <Icon {...p}>
    <path d="M6 4h12a1 1 0 0 1 1 1v16l-7-4-7 4V5a1 1 0 0 1 1-1z" fill="currentColor"/>
  </Icon>
);
const ICog = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </Icon>
);
const IMusic = (p) => (
  <Icon {...p}>
    <path d="M9 18V5l12-2v13"/>
    <circle cx="6" cy="18" r="3"/>
    <circle cx="18" cy="16" r="3"/>
  </Icon>
);
const IChevronLeft = (p) => (
  <Icon {...p}><path d="m15 18-6-6 6-6"/></Icon>
);
const IChevronRight = (p) => (
  <Icon {...p}><path d="m9 18 6-6-6-6"/></Icon>
);

Object.assign(window, { IHighlight, INote, IBookmark, IBookmarkFill, ICog, IMusic, IChevronLeft, IChevronRight });

// ── PDF viewer (uses PDF.js loaded from a CDN by the HTML wrapper) ──────────
// Renders the canvas + a text layer so the browser's native selection works
// — which means our document-level mouseup listener still picks up selections
// and the highlight popover appears exactly the same way as for plain text.
function PdfViewer({ book }) {
  const containerRef = React.useRef(null);
  const [pageNum, setPageNum]   = React.useState(1);
  const [pageCount, setPageCount] = React.useState(book ? book.total_pages : 1);
  const [error, setError] = React.useState("");
  const [scale, setScale] = React.useState(1.35);
  const pdfDocRef = React.useRef(null);

  // Load the PDF once.
  React.useEffect(() => {
    if (!book || !book.file_path) return;
    if (!window.pdfjsLib) {
      setError("PDF renderer unavailable — refresh the page.");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs";
        const task = window.pdfjsLib.getDocument(book.file_path);
        const doc  = await task.promise;
        if (cancelled) return;
        pdfDocRef.current = doc;
        setPageCount(doc.numPages);
      } catch (e) {
        if (!cancelled) setError("Could not load PDF: " + (e && e.message || e));
      }
    })();
    return () => { cancelled = true; };
  }, [book && book.file_path]);

  // Render the current page whenever pageNum / scale changes.
  React.useEffect(() => {
    const doc = pdfDocRef.current;
    const host = containerRef.current;
    if (!doc || !host) return;
    let cancelled = false;
    (async () => {
      const page = await doc.getPage(pageNum);
      if (cancelled) return;
      const viewport = page.getViewport({ scale });

      // Clear previous render.
      host.innerHTML = "";
      host.style.position = "relative";
      host.style.width  = viewport.width + "px";
      host.style.height = viewport.height + "px";
      host.style.margin = "0 auto";

      // Canvas — the raster page.
      const canvas = document.createElement("canvas");
      canvas.width  = viewport.width;
      canvas.height = viewport.height;
      canvas.style.position = "absolute";
      canvas.style.left = "0";
      canvas.style.top = "0";
      host.appendChild(canvas);

      // Text layer — invisible but selectable, sits exactly on top of the canvas.
      const textLayerDiv = document.createElement("div");
      textLayerDiv.className = "pdf-text-layer";
      Object.assign(textLayerDiv.style, {
        position: "absolute", left: "0", top: "0",
        width: viewport.width + "px", height: viewport.height + "px",
        color: "transparent", lineHeight: "1.0",
        userSelect: "text", whiteSpace: "pre",
      });
      host.appendChild(textLayerDiv);

      const ctx = canvas.getContext("2d");
      await page.render({ canvasContext: ctx, viewport }).promise;
      if (cancelled) return;

      const textContent = await page.getTextContent();
      if (cancelled) return;
      // Lay out each text item at its PDF coords so the selection visually matches.
      textContent.items.forEach(item => {
        if (!item.str) return;
        const tx = window.pdfjsLib.Util.transform(viewport.transform, item.transform);
        const fontSize = Math.hypot(tx[2], tx[3]);
        const span = document.createElement("span");
        span.textContent = item.str + " ";
        Object.assign(span.style, {
          position: "absolute",
          left: tx[4] + "px",
          top:  (tx[5] - fontSize) + "px",
          fontSize: fontSize + "px",
          transformOrigin: "0% 0%",
          whiteSpace: "pre",
        });
        textLayerDiv.appendChild(span);
      });
    })();
    return () => { cancelled = true; };
  }, [pageNum, scale]);

  if (error) {
    return (
      <div style={{
          padding: 32, color: "var(--on-glass-soft)",
          fontFamily: "var(--f-display)", fontStyle: "italic",
          textAlign: "center" }}>
        {error}
      </div>
    );
  }

  return (
    <div>
      <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          gap: 16, padding: "12px 0 14px", color: "var(--on-glass-dim)",
          fontSize: 12, letterSpacing: "0.06em" }}>
        <button className="t-btn" onClick={() => setPageNum(p => Math.max(1, p - 1))}
                disabled={pageNum <= 1}>‹</button>
        <span>Page {pageNum} of {pageCount}</span>
        <button className="t-btn" onClick={() => setPageNum(p => Math.min(pageCount, p + 1))}
                disabled={pageNum >= pageCount}>›</button>
      </div>
      <div ref={containerRef} className="reader-page pdf-host" style={{ maxWidth: "100%" }}/>
    </div>
  );
}

// ── Highlight colors ─────────────────────────────────────────────────────────
const HIGHLIGHT_COLORS = [
  { id: "amber", color: "#F2C77A", soft: "rgba(242, 199, 122, 0.32)" },
  { id: "rose",  color: "#E89A9A", soft: "rgba(232, 154, 154, 0.30)" },
  { id: "olive", color: "#A8B070", soft: "rgba(168, 176, 112, 0.32)" },
  { id: "sky",   color: "#8AB0C4", soft: "rgba(138, 176, 196, 0.32)" }
];

// ── Render a paragraph that may contain inline highlights ───────────────────
function HighlightedParagraph({ para, onHighlightTap }) {
  if (!para.highlights || !para.highlights.length) {
    return <p>{para.text}</p>;
  }
  // Build segments: text, highlight, text, …
  const hs = [...para.highlights].sort((a, b) => a.start - b.start);
  const segs = [];
  let cursor = 0;
  hs.forEach(h => {
    if (h.start > cursor) {
      segs.push({ type: "text", text: para.text.slice(cursor, h.start) });
    }
    segs.push({ type: "hl", text: para.text.slice(h.start, h.end), h });
    cursor = h.end;
  });
  if (cursor < para.text.length) {
    segs.push({ type: "text", text: para.text.slice(cursor) });
  }
  return (
    <p>
      {segs.map((s, i) => s.type === "text"
        ? <React.Fragment key={i}>{s.text}</React.Fragment>
        : <mark key={i}
                className={`hl hl-${s.h.color}${s.h.note ? " has-note" : ""}`}
                onClick={(e) => { e.stopPropagation(); onHighlightTap && onHighlightTap(s.h, e.currentTarget); }}>
            {s.text}
          </mark>
      )}
    </p>
  );
}

// ── Highlight popover (appears on simulated text selection) ─────────────────
function HighlightPopover({ open, position, onPick, onAddNote, onClose }) {
  if (!open) return null;
  return (
    <div className="hl-popover"
         style={{ left: position.x, top: position.y }}
         onClick={(e) => e.stopPropagation()}>
      <div className="hl-popover-row">
        {HIGHLIGHT_COLORS.map(c => (
          <button key={c.id}
                  className="hl-swatch"
                  style={{ background: c.color }}
                  onClick={() => onPick && onPick(c.id)}
                  aria-label={`Highlight ${c.id}`}/>
        ))}
        <span className="hl-divider"/>
        <button className="hl-action" onClick={onAddNote}>
          <INote size={13}/>
          <span>Add note</span>
        </button>
      </div>
    </div>
  );
}

// ── Add-note overlay ─────────────────────────────────────────────────────────
function AddNoteOverlay({ open, passage, color = "amber", onSave, onClose }) {
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [tags, setTags] = React.useState(["empathy"]);
  const [newTag, setNewTag] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setTitle(""); setBody(""); setTags(["empathy"]); setNewTag("");
    }
  }, [open]);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const toggleTag = (tag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };
  const addTag = () => {
    const t = newTag.trim().toLowerCase();
    if (!t || tags.includes(t)) return;
    setTags([...tags, t]);
    setNewTag("");
  };

  return (
    <div className={`overlay${open ? " open" : ""}`} onClick={onClose}>
      <div className="note-modal" onClick={(e) => e.stopPropagation()}>
        <button className="window-close" aria-label="Close" onClick={onClose}>
          <IClose size={14}/>
        </button>

        <div className="note-quote" data-color={color}>
          <span className="note-quote-bar"/>
          <em>"{passage}"</em>
        </div>

        <input className="note-title-input"
               placeholder="Title (optional)"
               value={title} onChange={(e) => setTitle(e.target.value)}/>

        <div className="note-toolbar">
          <button className="note-tool" title="Bold"><b>B</b></button>
          <button className="note-tool" title="Italic"><i>I</i></button>
          <button className="note-tool" title="Underline"><u>U</u></button>
          <span className="note-tool-div"/>
          <button className="note-tool" title="Heading">H1</button>
          <button className="note-tool" title="Subheading">H2</button>
          <span className="note-tool-div"/>
          <button className="note-tool" title="List">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>
          <button className="note-tool" title="Quote">"</button>
        </div>

        <textarea className="note-body"
                  rows="6"
                  placeholder="What did this passage stir in you?"
                  value={body} onChange={(e) => setBody(e.target.value)}/>

        <div className="note-tags">
          {tags.map(tag => (
            <button key={tag} className="tag-chip active" onClick={() => toggleTag(tag)}>
              <span className="tag-chip-hash">#</span>{tag}
              <span style={{ marginLeft: 4, opacity: 0.6 }}>×</span>
            </button>
          ))}
          <input className="note-tag-input"
                 placeholder="add tag…"
                 value={newTag}
                 onChange={(e) => setNewTag(e.target.value)}
                 onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}/>
        </div>

        <div className="note-actions">
          <button className="btn btn-ghost" onClick={onClose}>Discard</button>
          <button className="btn btn-primary"
                  onClick={() => onSave && onSave({ title, body, tags, color })}
                  disabled={!body.trim()}>
            Save note
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Display settings overlay (top-right anchored) ───────────────────────────
function DisplayPanel({ open, t, setTweak, onClose }) {
  if (!open) return null;
  return (
    <>
      <div className="display-scrim" onClick={onClose}/>
      <div className="display-panel">
        <div className="display-section">
          <div className="display-label">Theme</div>
          <div className="display-themes">
            {["light", "sepia", "dark"].map(k => (
              <button key={k}
                      className={`display-theme display-theme-${k}${t.theme === k ? " active" : ""}`}
                      onClick={() => setTweak("theme", k)}>
                <span/>
                <em>{k}</em>
              </button>
            ))}
          </div>
        </div>

        <div className="display-section">
          <div className="display-label">Text size</div>
          <div className="display-size">
            <button onClick={() => setTweak("fontSize", Math.max(14, t.fontSize - 1))}
                    className="display-step">A−</button>
            <div className="display-size-track">
              <div className="display-size-fill"
                   style={{ width: `${((t.fontSize - 14) / (28 - 14)) * 100}%` }}/>
            </div>
            <button onClick={() => setTweak("fontSize", Math.min(28, t.fontSize + 1))}
                    className="display-step">A+</button>
          </div>
        </div>

        <div className="display-section">
          <div className="display-label">Font</div>
          <div className="display-fonts">
            {[
              { id: "serif", label: "Garamond" },
              { id: "sans",  label: "Manrope" },
              { id: "mono",  label: "Mono" }
            ].map(f => (
              <button key={f.id}
                      className={`display-font display-font-${f.id}${t.font === f.id ? " active" : ""}`}
                      onClick={() => setTweak("font", f.id)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
function ReaderApp() {
  const [t, setTweak] = useTweaks(READER_TWEAK_DEFAULTS);

  const [bookmarked, setBookmarked] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const [notesOpen, setNotesOpen] = React.useState(true);   // right panel default open
  const [displayOpen, setDisplayOpen] = React.useState(false);
  const [popover, setPopover] = React.useState({ open: false, x: 0, y: 0, target: null });
  const [noteModal, setNoteModal] = React.useState({ open: false, passage: "", color: "amber" });
  const [savedNotes, setSavedNotes] = React.useState([]); // user-added in this session

  React.useEffect(() => {
    document.documentElement.dir = "ltr";
    document.documentElement.lang = "en";
    document.documentElement.setAttribute("data-palette", "dusk");
  }, []);

  // ── Real text selection → popover ────────────────────────────────
  // We listen at the document level so any selection inside the reader
  // page surfaces the highlight bubble at the end of the selection.
  React.useEffect(() => {
    const onMouseUp = () => {
      // Defer so the selection has settled.
      setTimeout(() => {
        const sel = window.getSelection && window.getSelection();
        if (!sel || sel.isCollapsed) return;
        const text = sel.toString().trim();
        if (!text || text.length < 2) return;

        // Only react when the selection is inside the reader page.
        let node = sel.anchorNode;
        while (node && node.nodeType !== 1) node = node.parentNode;
        if (!node || !node.closest || !node.closest(".reader-page, .reader-stage")) return;

        const range = sel.getRangeAt(0).getBoundingClientRect();
        setPopover({
          open: true,
          x: range.left + range.width / 2,
          y: Math.max(40, range.top - 14),
          target: "selection",
          passage: text,
        });
      }, 0);
    };
    document.addEventListener("mouseup", onMouseUp);
    return () => document.removeEventListener("mouseup", onMouseUp);
  }, []);

  // ── Book targeting ─────────────────────────────────────────────
  // Reader opens whatever ?book=<id> the caller asked for. Default is
  // 14 (the seeded The Prophet) so the bare /Reader.html still works.
  const urlBook = (() => {
    const p = new URLSearchParams(window.location.search);
    const v = parseInt(p.get("book") || "", 10);
    return Number.isFinite(v) && v > 0 ? v : 14;
  })();
  const [currentBookId] = React.useState(urlBook);

  // ── Pagination ─────────────────────────────────────────────────
  // Each "page" of the reader is one chapter (3 chapters from The Prophet).
  // For non-Prophet books we'll fall back to the PDF viewer below.
  const chapterOf = (pid) => {
    const n = parseInt(String(pid).replace(/^p/, ""), 10) || 0;
    if (n <= 6)  return 0;
    if (n <= 11) return 1;
    return 2;
  };
  const [chapterIdx, setChapterIdx] = React.useState(0);
  const chapterParagraphs = PASSAGE.filter(p => chapterOf(p.id) === chapterIdx);
  const currentPage = [47, 60, 78][chapterIdx]; // page numbers within the printed book

  // Persist progress when the chapter changes (so Continue Reading is up to date).
  React.useEffect(() => {
    if (!window.RuknAPI) return;
    window.RuknAPI.call("advance_progress", { book_id: currentBookId });
  }, [chapterIdx]);

  // Load existing highlights for this book on mount.
  const [savedHighlights, setSavedHighlights] = React.useState([]);
  React.useEffect(() => {
    if (!window.RuknAPI) return;
    (async () => {
      const r = await window.RuknAPI.call("list_highlights", null, { book_id: currentBookId });
      if (r.data.ok) setSavedHighlights(r.data.highlights || []);
    })();
  }, []);

  // ── Book metadata (for the topbar title + PDF fallback) ───────
  const [bookMeta, setBookMeta] = React.useState(null);
  React.useEffect(() => {
    if (!window.RuknAPI) return;
    (async () => {
      const r = await window.RuknAPI.call("library");
      if (r.data.ok) {
        const b = (r.data.books || []).find(x => x.book_id === currentBookId);
        if (b) setBookMeta(b);
      }
    })();
  }, []);

  const onHighlightTap = (h, el) => {
    if (h.note) {
      // Scroll to/highlight the corresponding note in the right panel
      setNotesOpen(true);
      const note = document.getElementById(`note-${h.id}`);
      if (note) {
        note.classList.add("flash");
        setTimeout(() => note.classList.remove("flash"), 1200);
      }
    } else {
      // Open popover above the highlight to attach a note
      const r = el.getBoundingClientRect();
      setPopover({
        open: true,
        x: r.left + r.width / 2,
        y: r.top - 12,
        target: h.id,
        passage: el.textContent
      });
    }
  };

  // Map the prototype's color palette (amber/rose/olive/sky) onto the four
  // colors the backend's CHECK constraint accepts.
  const COLOR_MAP = { amber: "yellow", rose: "pink", olive: "green", sky: "blue",
                      yellow: "yellow", pink: "pink", green: "green", blue: "blue" };

  const onPickColor = async (colorId) => {
    const passage = popover.passage;
    const color   = COLOR_MAP[colorId] || "yellow";
    setPopover(p => ({ ...p, open: false }));
    // Clear the live selection so the popover doesn't immediately re-open.
    if (window.getSelection) try { window.getSelection().removeAllRanges(); } catch (e) {}

    if (window.RuknAPI && passage) {
      const r = await window.RuknAPI.call("save_highlight", {
        book_id:       currentBookId,
        page_number:   currentPage,
        selected_text: passage,
        color,
      });
      if (r.data.ok) {
        setSavedHighlights(prev => [r.data.highlight, ...prev]);
        flashToast("Highlighted");
      } else {
        flashToast(r.data.error || "Could not save highlight");
      }
    } else {
      flashToast("Highlighted");
    }
  };
  const onAddNote = () => {
    setNoteModal({ open: true, passage: popover.passage, color: "amber" });
    setPopover(p => ({ ...p, open: false }));
    if (window.getSelection) try { window.getSelection().removeAllRanges(); } catch (e) {}
  };

  const onSaveNote = async (note) => {
    // Build a single content string: optional title + body + passage citation.
    const body = (note.title ? note.title + "\n\n" : "")
               + (note.body || "")
               + "\n\n— " + (noteModal.passage || "");

    if (window.RuknAPI) {
      // Save BOTH a highlight (so the passage stays coloured on re-open) and a
      // journal entry (so the reflection shows up in the Journal page).
      const colorBackend = COLOR_MAP[note.color] || "yellow";
      window.RuknAPI.call("save_highlight", {
        book_id:       currentBookId,
        page_number:   currentPage,
        selected_text: noteModal.passage || "",
        color:         colorBackend,
      });
      const r = await window.RuknAPI.call("save_entry", {
        content: body.trim(),
        mood:    "📖",
        tags:    note.tags || [],
      });
      if (!r.data.ok) {
        flashToast(r.data.error || "Could not save note");
        return;
      }
    }

    setSavedNotes(prev => [
      { id: `s${prev.length}`, page: currentPage, ...note,
        excerpt: noteModal.passage },
      ...prev
    ]);
    setNoteModal({ open: false, passage: "", color: "amber" });
    flashToast("Note saved");
    setNotesOpen(true);
  };

  const onBookmark = () => {
    setBookmarked(b => !b);
    flashToast(bookmarked ? "Bookmark removed" : "Bookmarked page 47");
  };

  const flashToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  // Compute reader theme tokens via data attr on stage
  const themeAttrs = {
    "data-reader-theme": t.theme,
    "data-reader-font": t.font,
    style: { "--reader-fz": `${t.fontSize}px` }
  };

  const allNotes = [...savedNotes, ...EXISTING_NOTES];

  return (
    <>
      <div className="reader-stage" data-screen-label="05 Reader View" {...themeAttrs}>

        {/* ── Top mini-bar ──────────────────────────────────────── */}
        <header className="reader-topbar">
          <a className="reader-icon-btn" href="Library.html" aria-label="Back to library">
            <IChevronLeft size={16}/>
          </a>
          <div className="reader-title">
            <span className="reader-book display">{bookMeta ? bookMeta.title : "The Prophet"}</span>
            <span className="reader-chapter">
              {bookMeta && bookMeta.format === "PDF" && !bookMeta.is_public_domain
                ? `PDF · ${bookMeta.total_pages} pages`
                : `Chapter ${chapterIdx + 3} · ${CHAPTERS[chapterIdx]}`}
            </span>
          </div>

          <div className="reader-top-right">
            <div className="reader-mini-timer">
              <IClock size={13}/>
              <span>14:22</span>
            </div>
            <button className={`reader-icon-btn${displayOpen ? " active" : ""}`}
                    onClick={() => setDisplayOpen(o => !o)}
                    aria-label="Display settings">
              <ICog size={15}/>
            </button>
            <a className="reader-icon-btn" href="Dashboard.html" aria-label="Close">
              <IClose size={15}/>
            </a>
          </div>
        </header>

        {/* ── Left vertical toolbar ─────────────────────────────── */}
        <aside className="reader-toolbar">
          <button className="reader-tool" title="Highlight"
                  onClick={simulateSelection}>
            <IHighlight size={17}/>
          </button>
          <button className="reader-tool" title="Add note"
                  onClick={simulateSelection}>
            <INote size={17}/>
          </button>
          <button className={`reader-tool${bookmarked ? " active" : ""}`}
                  title="Bookmark"
                  onClick={onBookmark}>
            {bookmarked ? <IBookmarkFill size={17}/> : <IBookmark size={17}/>}
          </button>
          <div className="reader-tool-div"/>
          <button className="reader-tool" title="Focus timer">
            <IClock size={17}/>
          </button>
          <button className="reader-tool" title="Ambient audio">
            <IMusic size={17}/>
          </button>
          <button className={`reader-tool${displayOpen ? " active" : ""}`}
                  title="Display"
                  onClick={() => setDisplayOpen(o => !o)}>
            <ICog size={17}/>
          </button>
        </aside>

        {/* ── Center content ────────────────────────────────────── */}
        <main className={`reader-main${notesOpen ? " has-panel" : ""}`}>
          <div className="reader-page">
            {bookMeta && bookMeta.format === "PDF" && !bookMeta.is_public_domain ? (
              <PdfViewer book={bookMeta}/>
            ) : (
              <>
                <header className="reader-page-head">
                  <span className="reader-page-chapter">Chapter {chapterIdx + 3}</span>
                  <h1 className="reader-page-title display">{CHAPTERS[chapterIdx]}</h1>
                  <div className="reader-rule"/>
                </header>

                <article className="reader-prose">
                  {chapterParagraphs.map(p => (
                    <HighlightedParagraph key={p.id} para={p}
                                          onHighlightTap={onHighlightTap}/>
                  ))}
                </article>

                <div className="reader-demo-hint">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6,
                                 fontSize: 11, color: "var(--on-glass-soft)",
                                 letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    <IHighlight size={11}/>
                    Drag-select any passage to highlight or annotate it
                  </span>
                </div>
              </>
            )}
          </div>
        </main>

        {/* ── Right notes panel ─────────────────────────────────── */}
        <aside className={`reader-panel${notesOpen ? " open" : ""}`}>
          <header className="reader-panel-head">
            <div>
              <div className="reader-panel-eyebrow">Notes & highlights</div>
              <div className="reader-panel-chapter display">On Love</div>
            </div>
            <button className="reader-icon-btn"
                    onClick={() => setNotesOpen(false)}
                    aria-label="Close panel">
              <IChevronRight size={16}/>
            </button>
          </header>
          <div className="reader-panel-list">
            {allNotes.length === 0 && (
              <div className="reader-panel-empty">
                <INote size={28}/>
                <p>Your highlights and notes will gather here as you read.</p>
              </div>
            )}
            {allNotes.map(n => (
              <article key={n.id} id={`note-${n.id}`}
                       className={`reader-note reader-note-${n.color}`}>
                <header>
                  <span className="reader-note-page">Page {n.page}</span>
                  <span className="reader-note-dot"/>
                </header>
                <blockquote>"{n.excerpt}"</blockquote>
                {n.title && <h4>{n.title}</h4>}
                {n.body && <p>{n.body}</p>}
                {n.tags && n.tags.length > 0 && (
                  <div className="reader-note-tags">
                    {n.tags.map(tag => (
                      <span key={tag} className="tag-chip">
                        <span className="tag-chip-hash">#</span>{tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </aside>

        {/* Tab to reopen panel when closed */}
        {!notesOpen && (
          <button className="reader-panel-tab"
                  onClick={() => setNotesOpen(true)}
                  aria-label="Open notes">
            <INote size={14}/>
            <span>{allNotes.length}</span>
          </button>
        )}

        {/* ── Bottom progress bar ───────────────────────────────── */}
        <footer className="reader-footer">
          <button className="reader-icon-btn" aria-label="Previous chapter"
                  onClick={() => setChapterIdx(i => Math.max(0, i - 1))}
                  disabled={chapterIdx === 0}>
            <IChevronLeft size={14}/>
          </button>
          <div className="reader-progress-block">
            <div className="reader-progress">
              <div className="reader-progress-fill"
                   style={{ width: `${((chapterIdx + 1) / CHAPTERS.length) * 100}%` }}/>
              <div className="reader-progress-thumb"
                   style={{ left: `${((chapterIdx + 1) / CHAPTERS.length) * 100}%` }}/>
            </div>
            <div className="reader-progress-meta">
              <span>Chapter {chapterIdx + 3} · {CHAPTERS[chapterIdx]}</span>
              <span>{chapterIdx + 1} / {CHAPTERS.length} chapters</span>
            </div>
          </div>
          <button className="reader-icon-btn" aria-label="Next chapter"
                  onClick={() => setChapterIdx(i => Math.min(CHAPTERS.length - 1, i + 1))}
                  disabled={chapterIdx === CHAPTERS.length - 1}>
            <IChevronRight size={14}/>
          </button>
        </footer>

        {/* ── Overlays ──────────────────────────────────────────── */}
        <HighlightPopover open={popover.open}
                          position={{ x: popover.x, y: popover.y }}
                          onPick={onPickColor}
                          onAddNote={onAddNote}
                          onClose={() => setPopover(p => ({ ...p, open: false }))}/>

        <AddNoteOverlay open={noteModal.open}
                        passage={noteModal.passage}
                        color={noteModal.color}
                        onSave={onSaveNote}
                        onClose={() => setNoteModal({ open: false, passage: "", color: "amber" })}/>

        <DisplayPanel open={displayOpen} t={t} setTweak={setTweak}
                      onClose={() => setDisplayOpen(false)}/>

        {/* Toast */}
        <div className={`reader-toast${toast ? " visible" : ""}`}>
          {toast === "Bookmarked page 47" && <IBookmarkFill size={13}/>}
          {toast === "Note saved" && <INote size={13}/>}
          {toast === "Highlighted" && <IHighlight size={13}/>}
          {toast === "Bookmark removed" && <IBookmark size={13}/>}
          <span>{toast}</span>
        </div>
      </div>

      <TweaksPanel>
        <TweakSection label="Reader"/>
        <TweakRadio label="Theme"
                    value={t.theme}
                    options={["light", "sepia", "dark"]}
                    onChange={(v) => setTweak("theme", v)}/>
        <TweakSlider label="Text size"
                     value={t.fontSize} min={14} max={28} step={1} unit="px"
                     onChange={(v) => setTweak("fontSize", v)}/>
        <TweakRadio label="Font"
                    value={t.font}
                    options={["serif", "sans", "mono"]}
                    onChange={(v) => setTweak("font", v)}/>
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ReaderApp/>);
