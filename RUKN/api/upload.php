<?php
// ────────────────────────────────────────────────────────────────
// RUKN — upload.php
// Accepts a multipart POST containing a PDF or EPUB upload,
// stores it on disk under uploads/, and inserts a row into `books`.
//
// Constraints:
//   - max 20 MB
//   - only .pdf and .epub extensions
//   - filename is normalized + suffixed with the new book_id
// ────────────────────────────────────────────────────────────────

header('Content-Type: application/json');
session_start();
require_once __DIR__ . '/db.php';

function respond($code, $payload) {
    http_response_code($code);
    echo json_encode($payload);
    exit();
}

if (!isset($_SESSION['user_id'])) {
    respond(401, ['ok' => false, 'error' => 'Not logged in']);
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'POST required']);
}

$user_id = (int)$_SESSION['user_id'];

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $codes = [
        UPLOAD_ERR_INI_SIZE   => 'File exceeds server upload limit.',
        UPLOAD_ERR_FORM_SIZE  => 'File exceeds form upload limit.',
        UPLOAD_ERR_PARTIAL    => 'Upload was interrupted.',
        UPLOAD_ERR_NO_FILE    => 'No file was uploaded.',
        UPLOAD_ERR_NO_TMP_DIR => 'Server temp folder missing.',
        UPLOAD_ERR_CANT_WRITE => 'Server could not write the file.',
        UPLOAD_ERR_EXTENSION  => 'A server extension blocked the upload.',
    ];
    $code = isset($_FILES['file']) ? $_FILES['file']['error'] : UPLOAD_ERR_NO_FILE;
    respond(400, ['ok' => false, 'error' => $codes[$code] ?? 'Upload failed.']);
}

$file = $_FILES['file'];

// Hard size cap (also enforced via php.ini)
if ($file['size'] > 20 * 1024 * 1024) {
    respond(400, ['ok' => false, 'error' => 'File is larger than 20 MB.']);
}

$orig = $file['name'];
$ext  = strtolower(pathinfo($orig, PATHINFO_EXTENSION));
if (!in_array($ext, ['pdf', 'epub'], true)) {
    respond(400, ['ok' => false, 'error' => 'Only PDF and EPUB files are accepted.']);
}

// Read user-supplied title/author. If missing, derive from filename.
$title  = trim($_POST['title']  ?? '');
$author = trim($_POST['author'] ?? '');
if ($title === '') {
    $title = preg_replace('/\.[^.]+$/', '', $orig);
    $title = preg_replace('/[_\-]+/', ' ', $title);
    $title = trim($title);
    if ($title === '') $title = 'Untitled';
}
if ($author === '') $author = 'Unknown';

$pages = (int)($_POST['pages'] ?? 0);
if ($pages <= 0) $pages = 100; // fallback estimate; in production we'd parse the PDF

$format = strtoupper($ext); // PDF or EPUB

try {
    // Insert the book row first, so we can use its id in the saved filename.
    $stmt = $pdo->prepare(
        "INSERT INTO books (title, author, format, file_path, total_pages, is_public_domain, uploaded_by)
         VALUES (?, ?, ?, ?, ?, FALSE, ?)"
    );
    // We'll fill file_path with the final relative path after we know book_id.
    $stmt->execute([$title, $author, $format, '', $pages, $user_id]);
    $book_id = (int)$pdo->lastInsertId();

    // Move the uploaded temp file into a permanent uploads/ directory.
    $uploadsDir = __DIR__ . '/../uploads';
    if (!is_dir($uploadsDir)) {
        if (!mkdir($uploadsDir, 0775, true)) {
            $pdo->prepare("DELETE FROM books WHERE book_id = ?")->execute([$book_id]);
            respond(500, ['ok' => false, 'error' => 'Could not create uploads directory.']);
        }
    }

    $safeName = preg_replace('/[^a-zA-Z0-9._-]+/', '_', pathinfo($orig, PATHINFO_FILENAME));
    $safeName = trim($safeName, '_');
    if ($safeName === '') $safeName = 'book';
    $stored   = "uploads/" . $book_id . "_" . $safeName . "." . $ext;
    $absPath  = __DIR__ . '/../' . $stored;

    if (!move_uploaded_file($file['tmp_name'], $absPath)) {
        $pdo->prepare("DELETE FROM books WHERE book_id = ?")->execute([$book_id]);
        respond(500, ['ok' => false, 'error' => 'Could not save the uploaded file.']);
    }

    $pdo->prepare("UPDATE books SET file_path = ? WHERE book_id = ?")
        ->execute([$stored, $book_id]);

    // Start the user's reading_progress row at page 1 so the book shows up
    // under "In progress" immediately.
    $pdo->prepare(
        "INSERT IGNORE INTO reading_progress (user_id, book_id, current_page, pages_read)
         VALUES (?, ?, 1, 0)"
    )->execute([$user_id, $book_id]);

    respond(200, ['ok' => true, 'book' => [
        'book_id'  => $book_id,
        'title'    => $title,
        'author'   => $author,
        'format'   => $format,
        'file_path'=> $stored,
        'total_pages' => $pages,
    ]]);

} catch (PDOException $e) {
    respond(500, ['ok' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
