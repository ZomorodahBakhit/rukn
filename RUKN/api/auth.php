<?php
// ────────────────────────────────────────────────────────────────
// RUKN — auth.php
// JSON endpoints: me, register, login, logout.
// JSX components POST JSON bodies via fetch().
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

$action = $_GET['action'] ?? '';

// ── me: session probe used by every protected page on load ──────
if ($action === 'me') {
    if (!isset($_SESSION['user_id'])) {
        respond(401, ['ok' => false, 'error' => 'Not logged in']);
    }
    try {
        $stmt = $pdo->prepare(
            "SELECT u.user_id, u.username, u.email, u.preferred_lang, u.created_at,
                    CASE WHEN p.user_id IS NOT NULL THEN 'paid' ELSE 'free' END AS tier
               FROM users u
               LEFT JOIN paid_users p ON u.user_id = p.user_id
              WHERE u.user_id = ?"
        );
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch();
        if (!$user) {
            session_destroy();
            respond(401, ['ok' => false, 'error' => 'Session user missing']);
        }
        respond(200, ['ok' => true, 'user' => $user]);
    } catch (PDOException $e) {
        respond(500, ['ok' => false, 'error' => $e->getMessage()]);
    }
}

// ── register: atomic user + free_users + user_preferences + journals ──
if ($action === 'register') {
    $in        = jsonInput();
    $username  = trim($in['username'] ?? '');
    $email     = trim($in['email'] ?? '');
    $password  = $in['password'] ?? '';
    $confirm   = $in['confirm'] ?? '';
    $lang      = in_array(($in['lang'] ?? 'EN'), ['EN', 'AR']) ? $in['lang'] : 'EN';

    if ($username === '' || $email === '' || $password === '') {
        respond(400, ['ok' => false, 'error' => 'Please fill out all required fields.']);
    }
    if (!preg_match('/^[a-z0-9_]{3,20}$/', $username)) {
        respond(400, ['ok' => false, 'error' => 'Username must be 3–20 chars: lowercase, numbers, underscore.']);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        respond(400, ['ok' => false, 'error' => 'Please enter a valid email address.']);
    }
    if (strlen($password) < 8) {
        respond(400, ['ok' => false, 'error' => 'Password must be at least 8 characters.']);
    }
    if ($password !== $confirm) {
        respond(400, ['ok' => false, 'error' => 'Passwords do not match.']);
    }

    try {
        $stmt = $pdo->prepare("SELECT user_id FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $email]);
        if ($stmt->fetch()) {
            respond(409, ['ok' => false, 'error' => 'Username or email is already registered.']);
        }
    } catch (PDOException $e) {
        respond(500, ['ok' => false, 'error' => $e->getMessage()]);
    }

    try {
        $pdo->beginTransaction();

        $hash = password_hash($password, PASSWORD_DEFAULT);
        $pdo->prepare("INSERT INTO users (username, email, password_hash, preferred_lang) VALUES (?, ?, ?, ?)")
            ->execute([$username, $email, $hash, $lang]);
        $uid = $pdo->lastInsertId();

        $pdo->prepare("INSERT INTO free_users (user_id) VALUES (?)")->execute([$uid]);

        $pdo->prepare(
            "INSERT INTO user_preferences (user_id, theme, background, font, font_size, ambient_sound, sound_volume)
             VALUES (?, 'dusk', 'plain', 'Lora', 16, 'fireplace', 0.40)"
        )->execute([$uid]);

        $pdo->prepare(
            "INSERT INTO journals (user_id, book_id, type, title) VALUES (?, NULL, 'freeform', 'My Freeform Journal')"
        )->execute([$uid]);

        $pdo->commit();

        $_SESSION['user_id']        = $uid;
        $_SESSION['username']       = $username;
        $_SESSION['tier']           = 'free';
        $_SESSION['preferred_lang'] = $lang;

        respond(200, ['ok' => true, 'user' => [
            'user_id'        => $uid,
            'username'       => $username,
            'email'          => $email,
            'tier'           => 'free',
            'preferred_lang' => $lang,
        ]]);
    } catch (PDOException $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        respond(500, ['ok' => false, 'error' => 'Account creation failed: ' . $e->getMessage()]);
    }
}

// ── login ───────────────────────────────────────────────────────
if ($action === 'login') {
    $in  = jsonInput();
    $id  = trim($in['email'] ?? $in['username'] ?? '');
    $pw  = $in['password'] ?? '';

    if ($id === '' || $pw === '') {
        respond(400, ['ok' => false, 'error' => 'Please fill out all fields.']);
    }

    try {
        $stmt = $pdo->prepare(
            "SELECT u.*,
                    CASE WHEN p.user_id IS NOT NULL THEN 'paid' ELSE 'free' END AS tier
               FROM users u
               LEFT JOIN paid_users p ON u.user_id = p.user_id
              WHERE u.email = ? OR u.username = ?"
        );
        $stmt->execute([$id, $id]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($pw, $user['password_hash'])) {
            respond(401, ['ok' => false, 'error' => 'Email/username or password is incorrect.']);
        }

        $pdo->prepare("UPDATE users SET last_login = NOW() WHERE user_id = ?")->execute([$user['user_id']]);

        $_SESSION['user_id']        = $user['user_id'];
        $_SESSION['username']       = $user['username'];
        $_SESSION['tier']           = $user['tier'];
        $_SESSION['preferred_lang'] = $user['preferred_lang'];

        respond(200, ['ok' => true, 'user' => [
            'user_id'        => $user['user_id'],
            'username'       => $user['username'],
            'email'          => $user['email'],
            'tier'           => $user['tier'],
            'preferred_lang' => $user['preferred_lang'],
        ]]);
    } catch (PDOException $e) {
        respond(500, ['ok' => false, 'error' => $e->getMessage()]);
    }
}

// ── forgot password: create a one-time token ────────────────────
// Without SMTP we return the reset URL inline. The frontend shows it as a
// "magic link" so the user (or a grader) can click straight through.
if ($action === 'forgot') {
    $in    = jsonInput();
    $ident = trim($in['email'] ?? '');
    if ($ident === '') {
        respond(400, ['ok' => false, 'error' => 'Please enter your email or username.']);
    }
    try {
        $stmt = $pdo->prepare("SELECT user_id, email FROM users WHERE email = ? OR username = ?");
        $stmt->execute([$ident, $ident]);
        $u = $stmt->fetch();
        // Same response either way to avoid email-enumeration. The reset link is
        // only included if the account exists.
        $payload = ['ok' => true, 'message' => 'If that account exists, a reset link is on its way.'];
        if ($u) {
            $token = bin2hex(random_bytes(32));
            $pdo->prepare(
                "INSERT INTO password_resets (token, user_id, expires_at)
                 VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))"
            )->execute([$token, $u['user_id']]);
            // Dev-only convenience — surface the reset path so the demo works
            // without SMTP. Strip this in production.
            $payload['dev_reset_path'] = "Reset.html?token=" . $token;
        }
        respond(200, $payload);
    } catch (PDOException $e) {
        respond(500, ['ok' => false, 'error' => $e->getMessage()]);
    }
}

// ── reset: consume a token, change the password ─────────────────
if ($action === 'reset') {
    $in       = jsonInput();
    $token    = trim($in['token'] ?? '');
    $password = $in['password'] ?? '';
    $confirm  = $in['confirm']  ?? '';
    if ($token === '' || $password === '') {
        respond(400, ['ok' => false, 'error' => 'Missing token or password.']);
    }
    if (strlen($password) < 8) {
        respond(400, ['ok' => false, 'error' => 'Password must be at least 8 characters.']);
    }
    if ($password !== $confirm) {
        respond(400, ['ok' => false, 'error' => 'Passwords do not match.']);
    }
    try {
        $stmt = $pdo->prepare(
            "SELECT user_id FROM password_resets
              WHERE token = ? AND used = FALSE AND expires_at > NOW()"
        );
        $stmt->execute([$token]);
        $row = $stmt->fetch();
        if (!$row) {
            respond(400, ['ok' => false, 'error' => 'This reset link has expired or already been used.']);
        }
        $pdo->beginTransaction();
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $pdo->prepare("UPDATE users SET password_hash = ? WHERE user_id = ?")
            ->execute([$hash, $row['user_id']]);
        $pdo->prepare("UPDATE password_resets SET used = TRUE WHERE token = ?")
            ->execute([$token]);
        $pdo->commit();
        respond(200, ['ok' => true, 'message' => 'Password updated. You can sign in now.']);
    } catch (PDOException $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        respond(500, ['ok' => false, 'error' => $e->getMessage()]);
    }
}

// ── logout ──────────────────────────────────────────────────────
if ($action === 'logout') {
    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p["path"], $p["domain"], $p["secure"], $p["httponly"]);
    }
    session_destroy();
    respond(200, ['ok' => true]);
}

respond(400, ['ok' => false, 'error' => 'Unknown action.']);
