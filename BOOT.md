# Booting Rukn on XAMPP

This guide assumes XAMPP is installed at `C:\xampp1\`. If yours is at `C:\xampp\`, substitute accordingly.

---

## New folder layout

```
Group02_RUKN_finalproject/
├── backend/              ← PHP API only. Returns JSON.
│   ├── db.php            ← PDO connection to MySQL
│   ├── auth.php          ← /me, /register, /login, /logout
│   └── api.php           ← /dashboard, /library, /journal_list,
│                            /save_entry, /delete_entry,
│                            /settings_get, /update_preference,
│                            /upgrade, /downgrade, /export,
│                            /delete_account, /advance_progress
│
├── frontend/             ← Static HTML/CSS/JS. Calls the backend via fetch().
│   ├── index.html        ← Login / Register
│   ├── dashboard.html    ← Home — greeting, continue reading, journal composer, stats, ambient
│   ├── library.html      ← Book grid with filters + search + "+1 page" CRUD action
│   ├── journal.html      ← Two-pane: entries list (left) + selected entry (right) + delete
│   ├── settings.html     ← Account, preferences, plan upgrade/downgrade, export, delete
│   ├── assets/
│   │   └── styles.css    ← All design tokens (Desert Dusk theme, glass cards)
│   └── js/
│       └── app.js        ← Shared helpers: api(), requireAuth(), toast()
│
├── database/
│   └── schema.sql        ← MySQL schema + seed data (Layla user, 3 books)
│
├── src/                  ← Original starter (kept for reference, not used)
├── prototype/            ← Original JSX prototype (kept for reference)
├── docs/                 ← Assignment 2 & 3 reports
└── BOOT.md               ← (this file)
```

The split is intentional:
- **backend** owns the database and the rules (validation, session checks, SQL).
  It never returns HTML. Every response is JSON.
- **frontend** owns the UI. It never touches the database. It calls
  `../backend/auth.php` or `../backend/api.php` over `fetch()` with session cookies.

Apache serves both folders. The browser opens a frontend page; the page's
JavaScript talks to the backend over HTTP on the same origin.

---

## Boot procedure

### 1. Start XAMPP services

Open the XAMPP Control Panel and click **Start** on both:
- **Apache**  (serves the frontend HTML + backend PHP)
- **MySQL**   (serves the `rukn` database)

If either won't start, check that ports 80 and 3306 aren't already taken
(Skype, IIS, MAMP can grab them).

### 2. Copy the project into htdocs

Copy the **entire** `Group02_RUKN_finalproject` folder (or at minimum, `backend/`
and `frontend/`) into Apache's web root:

```
From:  D:\Last Semester\CMPE 372\Group02_RUKN_finalproject\Group02_RUKN_finalproject\
Into:  C:\xampp1\htdocs\rukn\
```

After copying, you should have:
```
C:\xampp1\htdocs\rukn\backend\
C:\xampp1\htdocs\rukn\frontend\
C:\xampp1\htdocs\rukn\database\
```

> **Tip — don't want to copy?** You can edit `C:\xampp1\apache\conf\extra\httpd-vhosts.conf`
> to point a virtual host at `D:\...\Group02_RUKN_finalproject\` instead. For
> the demo, copying is simpler.

### 3. Create the database

1. Open phpMyAdmin: <http://localhost/phpmyadmin>
2. Click **Import** in the top tab bar.
3. Choose file → `C:\xampp1\htdocs\rukn\database\schema.sql`
4. Scroll down → **Import**.

phpMyAdmin will create the `rukn` database, all 14 tables, and seed three books,
one user, two journals, four tags, and two journal entries.

### 4. Open the app

Open the **frontend** in your browser:

```
http://localhost/rukn/frontend/index.html
```

The page will check for an existing session, find none, and show the login form.

### 5. Log in

You have two options:

**A. Use the seeded account**
- Email: `layla@example.com`
- Password: `rukn12345`

**B. Register a fresh account**
- Click **Create account**
- Username: 3–20 lowercase letters/numbers/underscore
- Password: 8+ characters
- On submit, you're auto-logged in and redirected to the dashboard.

### 6. The flow

Once logged in:

| Page | URL | What works |
|---|---|---|
| Dashboard | `/rukn/frontend/dashboard.html` | Greeting, continue reading, **save journal entry** (writes to DB), theme & ambient sound (saved to DB), live stats |
| Library | `/rukn/frontend/library.html` | Browse books, search, filter, **"+1 page"** advances reading progress in DB |
| Journal | `/rukn/frontend/journal.html` | All entries with tag filter + search, click to view full, **delete** |
| Settings | `/rukn/frontend/settings.html` | View account info, **change preferences**, **upgrade to Premium** (moves row from `free_users` to `paid_users`), **export JSON**, **delete account** |

The sidebar moves you between pages. The "Log out" button in the top-right
clears the PHP session.

---

## Demo script (the flows you'll show to your professor)

These are the three+ end-to-end CRUD flows the rubric requires:

**Flow 1 — Register → Login → Dashboard (CREATE user, READ user)**
1. Open `index.html` → click Create account
2. Fill form → submit (POST `/backend/auth.php?action=register`)
3. Auto-redirect to dashboard, greeting uses your username
4. Check phpMyAdmin → new row in `users`, `free_users`, `user_preferences`, `journals`

**Flow 2 — Save journal entry → see it appear (CREATE journal_entry + tags)**
1. On dashboard, type "Read three pages of Midaq Alley today" in the composer
2. Pick a mood chip → type a tag → Enter
3. Click **Save entry** (POST `/backend/api.php?action=save_entry`)
4. The entry appears in Recent immediately
5. Reload — still there
6. Check `journal_entries` and `journal_entry_tags` in phpMyAdmin

**Flow 3 — Upgrade to Premium (CREATE paid_users, DELETE free_users)**
1. Go to Settings
2. Click **Start Premium** (POST `/backend/api.php?action=upgrade`)
3. The tier pill flips to Premium
4. Check phpMyAdmin → row moved from `free_users` to `paid_users`

**Flow 4 — Read book → +1 page (UPDATE reading_progress)**
1. Go to Library
2. Click **+1 page** on "Pride and Prejudice"
3. Reload, see the progress bar moved
4. Check `reading_progress` — `current_page` incremented, `total_seconds_read` added

**Flow 5 — Delete journal entry (DELETE journal_entry, cascades to junction)**
1. Go to Journal
2. Click an entry on the left
3. Click **Delete entry** → confirm
4. Entry disappears, count drops
5. Check phpMyAdmin — entry gone, junction rows gone (FK ON DELETE CASCADE)

---

## Architecture notes (for the report)

**Async fetch flow** — exactly the diagram in your sample report:

```
[ user clicks Save ]
       ↓
[ frontend JS: fetch('../backend/api.php?action=save_entry', {body: JSON}) ]
       ↓
[ backend/api.php: session check → validate → PDO INSERT → COMMIT ]
       ↓
[ JSON response: { ok: true, entry: {...} } ]
       ↓
[ frontend JS: prepend to list, show toast, reset form ]
```

**Why this layout maps cleanly to the rubric:**

| Rubric item | Where it lives |
|---|---|
| Structured navigation | `frontend/` sidebar in every page; same items across all four screens |
| Validated forms | `index.html` (live JS rules) + `backend/auth.php` (server-side regex/length checks) |
| Responsive layout | `assets/styles.css` uses CSS Grid for the widget canvas; media queries at 1100px and 720px |
| 3+ core user flows | The five flows above, each mapped 1:1 to CRUD in `api.php` |
| ER diagram + relational schema | `database/schema.sql` (14 tables, 3NF) |
| Async API interactions | `js/app.js` `api()` wrapper + `await fetch()` in every page |

---

## Troubleshooting

**"Database connection failed: SQLSTATE[HY000] [1049] Unknown database 'rukn'"**
- You skipped step 3. Import `database/schema.sql` via phpMyAdmin.

**"Not logged in" loop / `index.html` keeps redirecting back to itself**
- Your browser is blocking session cookies (third-party cookie policy).
  Make sure you opened the app via `http://localhost/...`, not `file://...`.

**Login as `layla@example.com` fails with "incorrect password"**
- The seed hash in `schema.sql` is now real (`rukn12345` → bcrypt). If you imported an older copy, re-import with the updated `schema.sql`.

**"Access denied for user 'root'@'localhost'"**
- Your XAMPP MySQL root user has a password set. Edit `backend/db.php` line 13 (`$pass = '';`) and put your password there.

**Pages load but show "Could not load dashboard"**
- Open DevTools → Network → click on the failed `api.php` request → look at
  the response. The error message will be in the JSON body (we deliberately
  surface PDO errors in JSON, not silenced).

**Port 80 is taken / Apache won't start**
- XAMPP Control Panel → Apache → Config → `httpd.conf` → change `Listen 80`
  to `Listen 8080`. Then access the app at `http://localhost:8080/rukn/frontend/index.html`.

---

## What I haven't built

- **Reader page** — text rendering + highlight selection is complex enough
  that the existing JSX prototype in `prototype/Reader.html` is the better
  artifact to show for the "high-fidelity prototype" rubric item. It's
  standalone (Babel via CDN) and opens directly in any browser.
- **Web Audio engine** — the procedural ambience generator lives in
  `src/dashboard_backend.js` (751 lines). If you want it back, copy that file
  to `frontend/js/`, add `<script src="js/dashboard_backend.js"></script>` to
  `dashboard.html`, and wire the sound chips to call `SoundEngine.toggle()`.
  Functionally, the preference is already being saved to the DB — only the
  audio playback itself is missing.
