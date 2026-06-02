# Rukn (رُكن)

> *Your cozy bilingual reading & journaling corner.*

A bilingual web application that unites three usually-separate activities — reading e-books, writing reflective notes linked to passages, and shaping an ambient workspace — into one quiet space. Final project for **CMPE 372 — User Interface Design**, Section 02 (Computer Engineering), Spring 2026, at İstanbul Aydın University.

**Live repo:** <https://github.com/ZomorodahBakhit/rukn>

---

## Features

- **Full account flow** — sign up, sign in, forgot-password (with one-hour reset tokens), sign out, account export, account deletion.
- **High-fidelity glassmorphic UI** — 3,300-line design system, Desert Dusk palette, four selectable color themes, animated SVG scenes (Maghrib, Olive Grove, Library Hour), drifting dust motes, film-grain overlay.
- **Journal** with passage-linked + freeform entries, hashtag filtering, mood glyphs. Tags auto-clean when their last entry is deleted.
- **Library** with hand-drawn book covers (7 designs) + procedural fallback covers, search, format filter.
- **Reader** showing Khalil Gibran's *The Prophet*, Chapter 3 — "On Love". Drag-select any passage → color popover → highlight saved to MySQL. Add a note → cross-links to a Journal entry.
- **Ambient audio** — procedural Web Audio synthesis for rain, fireplace, café, forest, lofi. Drop your own MP3 files into `RUKN/audio/` to override any sound with a real recording.
- **Focus timer** with 10 / 25 / 50 / 60-minute presets.
- **Settings** — palette, sound, volume, font, font-size, plan upgrade/downgrade, full JSON data export, account deletion.
- **Full-stack persistence** — every action above is backed by a 15-table 3NF MySQL schema, accessed via PDO prepared statements.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Babel-standalone, no build step), vanilla JSX, Web Audio API |
| Backend | PHP 8 + PDO + MySQL / MariaDB, server-side sessions |
| Local dev | XAMPP (PHP's built-in server is enough; Apache optional) |
| Auth | bcrypt password hashes, SHA-256 one-time reset tokens |

---

## Quick start

Got XAMPP installed? Double-click **`start.bat`**. That's it.

For step-by-step instructions *and* an alternative classic Apache-htdocs setup, see **[`SETUP.md`](SETUP.md)**.

Demo credentials: `layla@example.com` / `rukn12345`.

---

## Project structure

```
Group02_RUKN_CMPE372_CE_Final_Project/
├── start.bat / stop.bat            ← one-click launcher
├── README.md / SETUP.md            ← project overview & boot guide
├── RUKN/                            ← the running prototype
│   ├── *.html *.jsx *.css           ← UI
│   ├── api/                         ← PHP+MySQL backend (JSON API)
│   ├── audio/                       ← drop MP3s here (optional)
│   └── uploads/                     ← runtime user content (gitignored)
├── database/schema.sql              ← 15-table 3NF schema + seed
├── docs/                            ← assignment reports
├── figma/                           ← Figma file URL
├── screenshots/                     ← high-res screen renders
├── Group02_CMPE_FinalProject.md     ← final-submission report
└── RUKN_Presentation.pptx           ← demo slides
```

Detailed map of which JSX renders which screen, and which PHP endpoint handles each UI action, is in [`RUKN/STRUCTURE.md`](RUKN/STRUCTURE.md).

---

## Database schema (high-level)

```
users ── free_users / paid_users           (ISA specialization)
   │  ── user_preferences                  (1:1)
   │  ── password_resets                   (1:N, expiring tokens)
   │  ── journals ── journal_entries
   │       └── journal_entry_tags ── tags  (M:N)
   │  ── reading_progress ─┐
   │  ── highlights ───────┼── books
   │  ── bookmarks ────────┘
   └  ── collections ── collection_books ── books  (M:N)
```

Full DDL with constraints, indexes, and seed inserts: [`database/schema.sql`](database/schema.sql).

---

## Group 02 (CMPE)

| Name | Student ID | Department |
| :--- | :--- | :--- |
| Zomorodah Bakhit | 122200145 | Computer Engineering |
| Omar Othman | 122200162 | Computer Engineering |
| Rewan Afifi | 122200013 | Computer Engineering |
| Reem Khalil | 122200137 | Computer Engineering |
| Faysal Dabbagh | 122200015 | Computer Engineering |
| Omar Anouti | 121200031 | Computer Engineering |
