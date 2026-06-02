# RUKN — file layout

What goes where, in plain English. Everything Babel-standalone needs to render
the prototype lives at the top of `RUKN/`. The PHP+MySQL backend, the audio
files, and the uploaded books each live in their own subfolder.

```
RUKN/
│
├── 🌅 Pages (open these in the browser)
│   ├── Homepage.html         ← public landing page (no login required)
│   ├── Login.html            ← log in / create account
│   ├── Forgot.html           ← request a password-reset link
│   ├── Reset.html            ← set a new password using the link
│   ├── Dashboard.html        ← signed-in home, ambience, journal composer
│   ├── Library.html          ← personal bookshelf, upload modal
│   ├── Journal.html          ← reflections list + detail
│   ├── Reader.html           ← passage view, selection-based highlights
│   └── Settings.html         ← account, preferences, plan, export, delete
│
├── 🎨 Visual design system
│   ├── styles.css            ← 3,300-line design system (Desert Dusk palette)
│   ├── journal.css           ← Journal-page specifics
│   └── settings.css          ← Settings-page specifics
│
├── 🧩 React components (JSX, served as-is, compiled by Babel in the browser)
│   ├── app.jsx               ← Homepage app
│   ├── auth.jsx              ← Login / Register / Forgot / Reset
│   ├── dashboard.jsx         ← Dashboard app shell
│   ├── dashboard-widgets.jsx ← Sidebar, TopBar, ContinueReading, Journal,
│   │                           ReadingStats, ambient and theme widgets
│   ├── widgets.jsx           ← SoundsWidget, TimerWidget, ScenesWidget,
│   │                           SignupOverlay, TopBar (guest)
│   ├── library.jsx           ← Library page (book grid, upload modal, tabs)
│   ├── journal.jsx           ← Journal page (list + detail + tag filter)
│   ├── settings.jsx          ← Settings page (account, prefs, plan, danger)
│   ├── reader.jsx            ← Reader page (passages + highlight popover)
│   ├── scenes.jsx            ← Maghrib, Olive Grove, Library SVG scenes
│   ├── icons.jsx             ← Shared SVG icon set
│   ├── book-covers.jsx       ← Hand-drawn covers + procedural CoverAuto
│   └── tweaks-panel.jsx      ← The dev edit-mode tweaks panel
│
├── 🛠️ api/                   ← All backend logic + frontend helpers
│   ├── db.php                ← PDO connection to MySQL
│   ├── auth.php              ← me / register / login / logout / forgot / reset
│   ├── api.php               ← dashboard / library / journal / save_entry /
│   │                           delete_entry / save_highlight / list_highlights /
│   │                           settings_get / update_preference / upgrade /
│   │                           downgrade / export / delete_account /
│   │                           advance_progress
│   ├── upload.php            ← multipart POST → stores PDF/EPUB + inserts books row
│   ├── client.js             ← tiny fetch wrapper, exposed as window.RuknAPI;
│   │                           also runs the auto auth-guard
│   └── audio.js              ← ambient audio engine: plays audio/*.mp3 if
│                               present, else procedural Web Audio synthesis
│
├── 🔊 audio/                  ← drop MP3 files here (see audio/README.md)
│   ├── README.md
│   ├── rain.mp3              (optional; otherwise synthesized)
│   ├── fireplace.mp3         (optional)
│   ├── cafe.mp3              (optional)
│   ├── forest.mp3            (optional)
│   └── lofi.mp3              (optional)
│
└── 📚 uploads/                ← user-uploaded PDFs and EPUBs land here
    └── <book_id>_<safe-name>.<pdf|epub>
```

## What you can safely change

| Want to … | Where |
|---|---|
| Add a new ambient sound | drop `<name>.mp3` in `audio/`. Then add the chip to `widgets.jsx` `t.soundChips` and add a starter function to `api/audio.js`. |
| Tweak the color palette | edit `:root { --sky-top: … }` near the top of `styles.css`. |
| Add a new API endpoint | drop a new `if ($action === 'something') {…}` block in `api/api.php`. |
| Add a new page | new `Foo.html` mirroring an existing wrapper's `<script>` tags, new `foo.jsx` for its app. |
| Add hand-drawn cover for a new book | add a `CoverWhatever()` SVG component to `book-covers.jsx`, then a new case in the `switch (id)` plus a heuristic in `coverKeyFromTitle()`. |

## What's gracefully degradable

- **MP3 audio** missing → procedural synth covers it
- **MySQL not running** → backend returns JSON 500s; the prototype still renders, just with empty data
- **Public-domain title** doesn't match a hand-drawn cover → `CoverAuto` fills in with the title's initial on a hashed palette
