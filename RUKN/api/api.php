<?php
// ────────────────────────────────────────────────────────────────
// RUKN — api.php
// JSON CRUD endpoints. All responses: { ok: bool, ... }.
// Auth required (session cookie). 401 on missing session.
// ────────────────────────────────────────────────────────────────

header('Content-Type: application/json');
session_start();
require_once __DIR__ . '/db.php';

function respond($code, $payload) {
    http_response_code($code);
    echo json_encode($payload);
    exit();
}
function jsonInput() {
    $raw  = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

if (!isset($_SESSION['user_id'])) {
    respond(401, ['ok' => false, 'error' => 'Not logged in']);
}

$user_id = (int)$_SESSION['user_id'];
$action  = $_GET['action'] ?? '';

try {
    // ── DASHBOARD: greeting data, continue reading, recent entries, stats ──
    if ($action === 'dashboard') {
        $stmt = $pdo->prepare(
            "SELECT u.username, u.preferred_lang,
                    CASE WHEN p.user_id IS NOT NULL THEN 'paid' ELSE 'free' END AS tier
               FROM users u
               LEFT JOIN paid_users p ON u.user_id = p.user_id
              WHERE u.user_id = ?"
        );
        $stmt->execute([$user_id]);
        $u = $stmt->fetch();

        $stmt = $pdo->prepare("SELECT * FROM user_preferences WHERE user_id = ?");
        $stmt->execute([$user_id]);
        $pref = $stmt->fetch();

        $stmt = $pdo->prepare(
            "SELECT rp.*, b.title, b.author, b.cover_image, b.total_pages
               FROM reading_progress rp
               JOIN books b ON rp.book_id = b.book_id
              WHERE rp.user_id = ? AND rp.is_completed = FALSE
              ORDER BY rp.last_read_at DESC LIMIT 1"
        );
        $stmt->execute([$user_id]);
        $continueReading = $stmt->fetch();

        $stmt = $pdo->prepare(
            "SELECT je.entry_id, je.mood, je.content, je.created_at
               FROM journal_entries je
               JOIN journals j ON je.journal_id = j.journal_id
              WHERE j.user_id = ? AND j.type = 'freeform'
              ORDER BY je.created_at DESC LIMIT 5"
        );
        $stmt->execute([$user_id]);
        $entries = $stmt->fetchAll();

        if ($entries) {
            $ids = array_column($entries, 'entry_id');
            $ph  = implode(',', array_fill(0, count($ids), '?'));
            $stmt = $pdo->prepare(
                "SELECT jet.entry_id, t.name
                   FROM journal_entry_tags jet
                   JOIN tags t ON jet.tag_id = t.tag_id
                  WHERE jet.entry_id IN ($ph)"
            );
            $stmt->execute($ids);
            $by = [];
            foreach ($stmt->fetchAll() as $r) $by[$r['entry_id']][] = $r['name'];
            foreach ($entries as &$e) $e['tags'] = $by[$e['entry_id']] ?? [];
            unset($e);
        }

        $stmt = $pdo->prepare(
            "SELECT COALESCE(SUM(pages_read), 0) AS total_pages,
                    COALESCE(SUM(total_seconds_read), 0) AS total_seconds,
                    COUNT(*) AS books_started,
                    SUM(CASE WHEN is_completed = TRUE THEN 1 ELSE 0 END) AS books_finished
               FROM reading_progress WHERE user_id = ?"
        );
        $stmt->execute([$user_id]);
        $stats = $stmt->fetch();

        respond(200, [
            'ok'              => true,
            'user'            => $u,
            'preferences'     => $pref,
            'continueReading' => $continueReading ?: null,
            'recentEntries'   => $entries,
            'stats'           => [
                'pages_read'     => (int)$stats['total_pages'],
                'hours_read'     => round($stats['total_seconds'] / 3600, 1),
                'books_started'  => (int)$stats['books_started'],
                'books_finished' => (int)$stats['books_finished'],
                'streak_days'    => 7,
            ],
        ]);
    }

    // ── LIBRARY ────────────────────────────────────────────────────
    if ($action === 'library') {
        $stmt = $pdo->prepare(
            "SELECT b.book_id, b.title, b.author, b.format, b.cover_image, b.total_pages,
                    b.is_public_domain,
                    rp.current_page, rp.pages_read, rp.is_completed, rp.last_read_at,
                    CASE WHEN rp.book_id IS NULL THEN 0
                         ELSE ROUND((rp.pages_read / b.total_pages) * 100, 0)
                    END AS percent_complete
               FROM books b
               LEFT JOIN reading_progress rp
                 ON rp.book_id = b.book_id AND rp.user_id = ?
              WHERE b.is_public_domain = TRUE OR b.uploaded_by = ? OR rp.book_id IS NOT NULL
              ORDER BY (rp.last_read_at IS NULL), rp.last_read_at DESC, b.title"
        );
        $stmt->execute([$user_id, $user_id]);
        respond(200, ['ok' => true, 'books' => $stmt->fetchAll()]);
    }

    // ── JOURNAL list (full) ────────────────────────────────────────
    if ($action === 'journal_list') {
        $stmt = $pdo->prepare(
            "SELECT je.entry_id, je.mood, je.content, je.entry_date, je.created_at, je.updated_at
               FROM journal_entries je
               JOIN journals j ON je.journal_id = j.journal_id
              WHERE j.user_id = ?
              ORDER BY je.created_at DESC"
        );
        $stmt->execute([$user_id]);
        $entries = $stmt->fetchAll();

        if ($entries) {
            $ids = array_column($entries, 'entry_id');
            $ph  = implode(',', array_fill(0, count($ids), '?'));
            $stmt = $pdo->prepare(
                "SELECT jet.entry_id, t.name
                   FROM journal_entry_tags jet
                   JOIN tags t ON jet.tag_id = t.tag_id
                  WHERE jet.entry_id IN ($ph)"
            );
            $stmt->execute($ids);
            $by = [];
            foreach ($stmt->fetchAll() as $r) $by[$r['entry_id']][] = $r['name'];
            foreach ($entries as &$e) $e['tags'] = $by[$e['entry_id']] ?? [];
            unset($e);
        }

        $stmt = $pdo->prepare("SELECT name FROM tags WHERE user_id = ? ORDER BY name");
        $stmt->execute([$user_id]);
        $allTags = array_column($stmt->fetchAll(), 'name');

        respond(200, ['ok' => true, 'entries' => $entries, 'tags' => $allTags]);
    }

    // ── CREATE journal entry ───────────────────────────────────────
    if ($action === 'save_entry') {
        $in      = jsonInput();
        $content = trim($in['content'] ?? '');
        $mood    = trim($in['mood'] ?? '🌙');
        $tags    = is_array($in['tags'] ?? null) ? $in['tags'] : [];

        if (strlen($content) < 3)    respond(400, ['ok' => false, 'error' => 'Write at least 3 characters.']);
        if (strlen($content) > 2000) respond(400, ['ok' => false, 'error' => 'Entry too long (max 2000).']);

        $pdo->beginTransaction();

        $stmt = $pdo->prepare("SELECT journal_id FROM journals WHERE user_id = ? AND type = 'freeform' LIMIT 1");
        $stmt->execute([$user_id]);
        $j = $stmt->fetch();
        if (!$j) {
            $pdo->prepare("INSERT INTO journals (user_id, type, title) VALUES (?, 'freeform', 'My Freeform Journal')")
                ->execute([$user_id]);
            $journal_id = $pdo->lastInsertId();
        } else {
            $journal_id = $j['journal_id'];
        }

        $pdo->prepare("INSERT INTO journal_entries (journal_id, mood, content, entry_date) VALUES (?, ?, ?, CURRENT_DATE())")
            ->execute([$journal_id, $mood, $content]);
        $entry_id = $pdo->lastInsertId();

        $clean = [];
        foreach ($tags as $raw) {
            $name = trim(strtolower($raw));
            if ($name === '' || !preg_match('/^[a-z0-9-]+$/', $name)) continue;
            $pdo->prepare("INSERT IGNORE INTO tags (user_id, name) VALUES (?, ?)")->execute([$user_id, $name]);
            $stmt = $pdo->prepare("SELECT tag_id FROM tags WHERE user_id = ? AND name = ?");
            $stmt->execute([$user_id, $name]);
            $row = $stmt->fetch();
            if ($row) {
                $pdo->prepare("INSERT IGNORE INTO journal_entry_tags (entry_id, tag_id) VALUES (?, ?)")
                    ->execute([$entry_id, $row['tag_id']]);
                $clean[] = $name;
            }
        }

        $pdo->commit();

        respond(200, ['ok' => true, 'entry' => [
            'entry_id'   => (int)$entry_id,
            'content'    => $content,
            'mood'       => $mood,
            'tags'       => $clean,
            'created_at' => date('c'),
        ]]);
    }

    // ── DELETE journal entry ───────────────────────────────────────
    if ($action === 'delete_entry') {
        $in = jsonInput();
        $entry_id = (int)($in['entry_id'] ?? 0);
        if ($entry_id <= 0) respond(400, ['ok' => false, 'error' => 'Invalid entry id.']);

        $pdo->beginTransaction();
        try {
            // ON DELETE CASCADE on journal_entry_tags handles the junction.
            $stmt = $pdo->prepare(
                "DELETE FROM journal_entries
                  WHERE entry_id = ?
                    AND journal_id IN (SELECT journal_id FROM journals WHERE user_id = ?)"
            );
            $stmt->execute([$entry_id, $user_id]);
            $deleted = $stmt->rowCount();

            // Now garbage-collect any of this user's tags that no longer have
            // a single linked entry. This keeps the tag filter list clean.
            $orphans = $pdo->prepare(
                "DELETE FROM tags
                  WHERE user_id = ?
                    AND tag_id NOT IN (SELECT DISTINCT tag_id FROM journal_entry_tags)"
            );
            $orphans->execute([$user_id]);
            $orphanCount = $orphans->rowCount();

            $pdo->commit();

            if ($deleted > 0) {
                respond(200, ['ok' => true, 'orphaned_tags_removed' => $orphanCount]);
            }
            respond(404, ['ok' => false, 'error' => 'Entry not found.']);
        } catch (PDOException $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            throw $e;
        }
    }

    // ── SETTINGS ────────────────────────────────────────────────────
    if ($action === 'settings_get') {
        $stmt = $pdo->prepare(
            "SELECT u.username, u.email, u.preferred_lang, u.created_at,
                    CASE WHEN p.user_id IS NOT NULL THEN 'paid' ELSE 'free' END AS tier
               FROM users u LEFT JOIN paid_users p ON u.user_id = p.user_id
              WHERE u.user_id = ?"
        );
        $stmt->execute([$user_id]);
        $u = $stmt->fetch();
        $stmt = $pdo->prepare("SELECT * FROM user_preferences WHERE user_id = ?");
        $stmt->execute([$user_id]);
        respond(200, ['ok' => true, 'user' => $u, 'preferences' => $stmt->fetch()]);
    }

    if ($action === 'update_preference') {
        $in = jsonInput();
        $stmt = $pdo->prepare("SELECT * FROM user_preferences WHERE user_id = ?");
        $stmt->execute([$user_id]);
        $pref = $stmt->fetch();
        if (!$pref) {
            $pdo->prepare(
                "INSERT INTO user_preferences (user_id, theme, background, font, font_size, ambient_sound, sound_volume)
                 VALUES (?, 'dusk', 'plain', 'Lora', 16, 'fireplace', 0.40)"
            )->execute([$user_id]);
            $stmt->execute([$user_id]);
            $pref = $stmt->fetch();
        }

        $themes = ['dusk', 'olive', 'candlelight', 'rose'];
        $sounds = ['', 'rain', 'fireplace', 'cafe', 'lofi', 'forest'];
        $fonts  = ['Lora', 'Inter', 'Cormorant Garamond', 'EB Garamond', 'Amiri'];

        $theme = in_array($in['theme'] ?? null, $themes)        ? $in['theme']         : $pref['theme'];
        $sound = in_array($in['ambient_sound'] ?? null, $sounds, true) ? $in['ambient_sound'] : $pref['ambient_sound'];
        $vol   = isset($in['sound_volume']) ? max(0.0, min(1.0, (float)$in['sound_volume'])) : (float)$pref['sound_volume'];
        $font  = in_array($in['font'] ?? null, $fonts)          ? $in['font']          : $pref['font'];
        $fsize = isset($in['font_size']) ? max(12, min(28, (int)$in['font_size']))         : (int)$pref['font_size'];

        $pdo->prepare(
            "UPDATE user_preferences
                SET theme = ?, ambient_sound = ?, sound_volume = ?, font = ?, font_size = ?
              WHERE user_id = ?"
        )->execute([$theme, $sound, $vol, $font, $fsize, $user_id]);

        respond(200, ['ok' => true, 'preferences' => [
            'theme' => $theme, 'ambient_sound' => $sound, 'sound_volume' => $vol,
            'font'  => $font,  'font_size' => $fsize,
        ]]);
    }

    if ($action === 'upgrade') {
        $pdo->beginTransaction();
        $pdo->prepare("DELETE FROM free_users WHERE user_id = ?")->execute([$user_id]);
        $pdo->prepare("INSERT IGNORE INTO paid_users (user_id) VALUES (?)")->execute([$user_id]);
        $pdo->commit();
        $_SESSION['tier'] = 'paid';
        respond(200, ['ok' => true, 'tier' => 'paid']);
    }

    if ($action === 'downgrade') {
        $pdo->beginTransaction();
        $pdo->prepare("DELETE FROM paid_users WHERE user_id = ?")->execute([$user_id]);
        $pdo->prepare("INSERT IGNORE INTO free_users (user_id) VALUES (?)")->execute([$user_id]);
        $pdo->commit();
        $_SESSION['tier'] = 'free';
        respond(200, ['ok' => true, 'tier' => 'free']);
    }

    if ($action === 'export') {
        $tables = ['user_preferences', 'reading_progress', 'highlights', 'bookmarks', 'journals', 'tags'];
        $bundle = [];
        foreach ($tables as $t) {
            $stmt = $pdo->prepare("SELECT * FROM $t WHERE user_id = ?");
            $stmt->execute([$user_id]);
            $bundle[$t] = $stmt->fetchAll();
        }
        $stmt = $pdo->prepare(
            "SELECT je.* FROM journal_entries je
               JOIN journals j ON je.journal_id = j.journal_id
              WHERE j.user_id = ?"
        );
        $stmt->execute([$user_id]);
        $bundle['journal_entries'] = $stmt->fetchAll();
        respond(200, ['ok' => true, 'export' => $bundle]);
    }

    if ($action === 'delete_account') {
        $pdo->prepare("DELETE FROM users WHERE user_id = ?")->execute([$user_id]);
        $_SESSION = [];
        session_destroy();
        respond(200, ['ok' => true]);
    }

    // ── HIGHLIGHTS ─────────────────────────────────────────────────
    if ($action === 'save_highlight') {
        $in       = jsonInput();
        $book_id  = (int)($in['book_id'] ?? 0);
        $page     = (int)($in['page_number'] ?? 1);
        $text     = trim($in['selected_text'] ?? '');
        $color    = in_array($in['color'] ?? '', ['yellow','green','blue','pink']) ? $in['color'] : 'yellow';
        if ($book_id <= 0)        respond(400, ['ok' => false, 'error' => 'Invalid book.']);
        if ($text === '')         respond(400, ['ok' => false, 'error' => 'No text to highlight.']);
        if (strlen($text) > 1000) respond(400, ['ok' => false, 'error' => 'Selection too long.']);

        $pdo->prepare(
            "INSERT INTO highlights (user_id, book_id, page_number, selected_text, color)
             VALUES (?, ?, ?, ?, ?)"
        )->execute([$user_id, $book_id, $page, $text, $color]);
        $hid = (int)$pdo->lastInsertId();
        respond(200, ['ok' => true, 'highlight' => [
            'highlight_id' => $hid,
            'book_id'      => $book_id,
            'page_number'  => $page,
            'selected_text'=> $text,
            'color'        => $color,
        ]]);
    }

    if ($action === 'list_highlights') {
        $book_id = (int)($_GET['book_id'] ?? 0);
        $sql = "SELECT highlight_id, book_id, page_number, selected_text, color, created_at
                  FROM highlights WHERE user_id = ?"
             . ($book_id > 0 ? " AND book_id = ?" : "")
             . " ORDER BY created_at DESC";
        $args = $book_id > 0 ? [$user_id, $book_id] : [$user_id];
        $stmt = $pdo->prepare($sql);
        $stmt->execute($args);
        respond(200, ['ok' => true, 'highlights' => $stmt->fetchAll()]);
    }

    if ($action === 'delete_highlight') {
        $in = jsonInput();
        $hid = (int)($in['highlight_id'] ?? 0);
        if ($hid <= 0) respond(400, ['ok' => false, 'error' => 'Invalid highlight id.']);
        $stmt = $pdo->prepare("DELETE FROM highlights WHERE highlight_id = ? AND user_id = ?");
        $stmt->execute([$hid, $user_id]);
        if ($stmt->rowCount() > 0) respond(200, ['ok' => true]);
        respond(404, ['ok' => false, 'error' => 'Highlight not found.']);
    }

    if ($action === 'advance_progress') {
        $in = jsonInput();
        $book_id = (int)($in['book_id'] ?? 0);
        if ($book_id <= 0) respond(400, ['ok' => false, 'error' => 'Invalid book id.']);

        $stmt = $pdo->prepare("SELECT total_pages FROM books WHERE book_id = ?");
        $stmt->execute([$book_id]);
        $book = $stmt->fetch();
        if (!$book) respond(404, ['ok' => false, 'error' => 'Book not found.']);

        $stmt = $pdo->prepare("SELECT * FROM reading_progress WHERE user_id = ? AND book_id = ?");
        $stmt->execute([$user_id, $book_id]);
        $rp = $stmt->fetch();

        if (!$rp) {
            $pdo->prepare(
                "INSERT INTO reading_progress (user_id, book_id, current_page, pages_read, total_seconds_read)
                 VALUES (?, ?, 2, 1, 60)"
            )->execute([$user_id, $book_id]);
        } else {
            $newPage = min((int)$rp['current_page'] + 1, (int)$book['total_pages']);
            $done    = $newPage >= (int)$book['total_pages'] ? 1 : 0;
            $pdo->prepare(
                "UPDATE reading_progress
                    SET current_page = ?, pages_read = ?,
                        total_seconds_read = total_seconds_read + 60,
                        is_completed = ?
                  WHERE user_id = ? AND book_id = ?"
            )->execute([$newPage, $newPage, $done, $user_id, $book_id]);
        }
        respond(200, ['ok' => true]);
    }

    respond(400, ['ok' => false, 'error' => 'Unknown action: ' . htmlspecialchars($action)]);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    respond(500, ['ok' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
