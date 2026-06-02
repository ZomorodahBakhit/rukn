-- ================================================================
-- RUKN Database Schema & Seed Data
-- Designed for CMPE 372 Final Project Submission (XAMPP / MySQL)
-- Normalization: 3NF Compliant
-- ================================================================

CREATE DATABASE IF NOT EXISTS rukn CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rukn;

-- ────────── DROP TABLES IN REVERSE ORDER OF DEPENDENCY ──────────
DROP TABLE IF EXISTS collection_books;
DROP TABLE IF EXISTS collections;
DROP TABLE IF EXISTS journal_entry_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS journal_entries;
DROP TABLE IF EXISTS journals;
DROP TABLE IF EXISTS bookmarks;
DROP TABLE IF EXISTS highlights;
DROP TABLE IF EXISTS reading_progress;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS user_preferences;
DROP TABLE IF EXISTS password_resets;
DROP TABLE IF EXISTS paid_users;
DROP TABLE IF EXISTS free_users;
DROP TABLE IF EXISTS users;

-- ────────────────────────────────────────────────────────────────
-- 1. USERS (Base table for all registered users)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE users (
    user_id          INT              PRIMARY KEY AUTO_INCREMENT,
    username         VARCHAR(50)      NOT NULL UNIQUE,
    email            VARCHAR(100)     NOT NULL UNIQUE,
    password_hash    VARCHAR(255)     NOT NULL,
    preferred_lang   ENUM('AR','EN')  NOT NULL DEFAULT 'EN',
    created_at       TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    last_login       TIMESTAMP        NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ────────────────────────────────────────────────────────────────
-- 2. FREE_USERS (ISA Subclass for free tier accounts)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE free_users (
    user_id          INT              PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ────────────────────────────────────────────────────────────────
-- 3. PAID_USERS (ISA Subclass for premium tier accounts)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE paid_users (
    user_id          INT              PRIMARY KEY,
    subscribed_at    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ────────────────────────────────────────────────────────────────
-- 3b. PASSWORD_RESETS (one-time tokens for forgot-password flow)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE password_resets (
    token            CHAR(64)         PRIMARY KEY,
    user_id          INT              NOT NULL,
    expires_at       TIMESTAMP        NOT NULL,
    used             BOOLEAN          NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_pr_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ────────────────────────────────────────────────────────────────
-- 4. USER_PREFERENCES (1:1 with users, theme & volume customizers)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE user_preferences (
    preference_id    INT              PRIMARY KEY AUTO_INCREMENT,
    user_id          INT              NOT NULL UNIQUE,
    theme            VARCHAR(50)      DEFAULT 'dusk',
    background       VARCHAR(100)     DEFAULT 'plain',
    font             VARCHAR(50)      DEFAULT 'Lora',
    font_size        INT              DEFAULT 16,
    ambient_sound    VARCHAR(50)      DEFAULT 'fireplace',
    sound_volume     DECIMAL(3,2)     DEFAULT 0.40,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ────────────────────────────────────────────────────────────────
-- 5. BOOKS (E-books, either uploaded or public domain)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE books (
    book_id            INT            PRIMARY KEY AUTO_INCREMENT,
    title              VARCHAR(255)   NOT NULL,
    author             VARCHAR(255),
    format             ENUM('PDF','EPUB') NOT NULL,
    file_path          VARCHAR(500)   NOT NULL,
    cover_image        VARCHAR(500),
    total_pages        INT            NOT NULL,
    is_public_domain   BOOLEAN        NOT NULL DEFAULT FALSE,
    uploaded_by        INT            NULL,
    uploaded_at        TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ────────────────────────────────────────────────────────────────
-- 6. READING_PROGRESS (User's active bookmarks/percent read)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE reading_progress (
    progress_id          INT          PRIMARY KEY AUTO_INCREMENT,
    user_id              INT          NOT NULL,
    book_id              INT          NOT NULL,
    current_page         INT          NOT NULL DEFAULT 1,
    pages_read           INT          NOT NULL DEFAULT 0,
    total_seconds_read   INT          NOT NULL DEFAULT 0,
    last_read_at         TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_completed         BOOLEAN      NOT NULL DEFAULT FALSE,
    UNIQUE KEY uq_progress_user_book (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ────────────────────────────────────────────────────────────────
-- 7. HIGHLIGHTS (Specific passages highlighted by users)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE highlights (
    highlight_id     INT              PRIMARY KEY AUTO_INCREMENT,
    user_id          INT              NOT NULL,
    book_id          INT              NOT NULL,
    page_number      INT              NOT NULL,
    selected_text    TEXT             NOT NULL,
    color            ENUM('yellow','green','blue','pink') NOT NULL DEFAULT 'yellow',
    created_at       TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ────────────────────────────────────────────────────────────────
-- 8. BOOKMARKS (Simple page references, no selected text)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE bookmarks (
    bookmark_id      INT              PRIMARY KEY AUTO_INCREMENT,
    user_id          INT              NOT NULL,
    book_id          INT              NOT NULL,
    page_number      INT              NOT NULL,
    created_at       TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_bookmark (user_id, book_id, page_number),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ────────────────────────────────────────────────────────────────
-- 9. JOURNALS (Collections of entries; 1 freeform, N book notes)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE journals (
    journal_id       INT              PRIMARY KEY AUTO_INCREMENT,
    user_id          INT              NOT NULL,
    book_id          INT              NULL,
    type             ENUM('book','freeform') NOT NULL,
    title            VARCHAR(255),
    created_at       TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_journal_user_book (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ────────────────────────────────────────────────────────────────
-- 10. JOURNAL_ENTRIES (Individual reflections written by user)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE journal_entries (
    entry_id         INT              PRIMARY KEY AUTO_INCREMENT,
    journal_id       INT              NOT NULL,
    highlight_id     INT              NULL,
    mood             VARCHAR(10)      NOT NULL DEFAULT '🌙',
    content          TEXT             NOT NULL,
    entry_date       DATE             NOT NULL DEFAULT (CURRENT_DATE),
    created_at       TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (journal_id)   REFERENCES journals(journal_id)    ON DELETE CASCADE,
    FOREIGN KEY (highlight_id) REFERENCES highlights(highlight_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ────────────────────────────────────────────────────────────────
-- 11. TAGS (Private user-created chips to categorize entries)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE tags (
    tag_id           INT              PRIMARY KEY AUTO_INCREMENT,
    user_id          INT              NOT NULL,
    name             VARCHAR(50)      NOT NULL,
    UNIQUE KEY uq_tag_user_name (user_id, name),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ────────────────────────────────────────────────────────────────
-- 12. JOURNAL_ENTRY_TAGS (Many-to-many junction)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE journal_entry_tags (
    entry_id         INT              NOT NULL,
    tag_id           INT              NOT NULL,
    PRIMARY KEY (entry_id, tag_id),
    FOREIGN KEY (entry_id) REFERENCES journal_entries(entry_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id)   REFERENCES tags(tag_id)              ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ────────────────────────────────────────────────────────────────
-- 13. COLLECTIONS (User folders for organizing books)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE collections (
    collection_id    INT              PRIMARY KEY AUTO_INCREMENT,
    user_id          INT              NOT NULL,
    name             VARCHAR(100)     NOT NULL,
    created_at       TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_collection_name (user_id, name),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ────────────────────────────────────────────────────────────────
-- 14. COLLECTION_BOOKS (Many-to-many junction)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE collection_books (
    collection_id    INT              NOT NULL,
    book_id          INT              NOT NULL,
    PRIMARY KEY (collection_id, book_id),
    FOREIGN KEY (collection_id) REFERENCES collections(collection_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id)       REFERENCES books(book_id)             ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ================================================================
--                   SEEDS FOR INITIAL TESTING
-- ================================================================

-- Seed 1: The primary user 'layla_amin'
-- Password is 'rukn12345' (real bcrypt hash via PHP password_hash, PASSWORD_DEFAULT)
INSERT INTO users (user_id, username, email, password_hash, preferred_lang)
VALUES (7, 'layla', 'layla@example.com', '$2y$10$BB4e1C3ZxGo/sDm20AkROe6B02.DgghF1/qa/xQYbXePi8yyo2DsK', 'EN');

-- Seed 2: Set user as free account subclass
INSERT INTO free_users (user_id) VALUES (7);

-- Seed 3: Save user preferences (theme, ambient, volume)
INSERT INTO user_preferences (user_id, theme, background, font, font_size, ambient_sound, sound_volume)
VALUES (7, 'dusk', 'plain', 'Lora', 16, 'fireplace', 0.40);

-- Seed 4: Ingest a few books into library (public domain & uploaded)
INSERT INTO books (book_id, title, author, format, file_path, cover_image, total_pages, is_public_domain)
VALUES (14, 'The Prophet', 'Khalil Gibran', 'EPUB', 'books/the_prophet.epub', 'covers/the_prophet.png', 96, TRUE);

INSERT INTO books (book_id, title, author, format, file_path, cover_image, total_pages, is_public_domain, uploaded_by)
VALUES (15, 'Pride and Prejudice', 'Jane Austen', 'EPUB', 'books/pride_prejudice.epub', 'covers/pride_prejudice.png', 320, TRUE, 7);

INSERT INTO books (book_id, title, author, format, file_path, cover_image, total_pages, is_public_domain, uploaded_by)
VALUES (16, 'Midaq Alley', 'Naguib Mahfouz', 'PDF', 'books/midaq_alley.pdf', 'covers/midaq_alley.png', 280, FALSE, 7);

-- Seed 5: Create reading progress metrics
INSERT INTO reading_progress (user_id, book_id, current_page, pages_read, total_seconds_read, is_completed)
VALUES (7, 14, 47, 47, 12240, FALSE);

INSERT INTO reading_progress (user_id, book_id, current_page, pages_read, total_seconds_read, is_completed)
VALUES (7, 15, 73, 73, 5400, FALSE);

-- Seed 6: Create default journals (1 freeform, 1 book notes journal)
INSERT INTO journals (journal_id, user_id, book_id, type, title)
VALUES (101, 7, NULL, 'freeform', 'My Freeform Journal');

INSERT INTO journals (journal_id, user_id, book_id, type, title)
VALUES (102, 7, 14, 'book', 'Notes on The Prophet');

-- Seed 7: Create tags for categorizing
INSERT INTO tags (tag_id, user_id, name) VALUES (1, 7, 'wisdom');
INSERT INTO tags (tag_id, user_id, name) VALUES (2, 7, 'surrender');
INSERT INTO tags (tag_id, user_id, name) VALUES (3, 7, 'calm');
INSERT INTO tags (tag_id, user_id, name) VALUES (4, 7, 'arabic-lit');

-- Seed 8: Ingest initial journal entries (dated past few hours)
INSERT INTO journal_entries (entry_id, journal_id, mood, content, created_at)
VALUES (1001, 102, '🌙', "Gibran's image of love crowning and crucifying — I keep coming back to it. There is no soft love that does not also cost something.", DATE_SUB(NOW(), INTERVAL 6 HOUR));

INSERT INTO journal_entries (entry_id, journal_id, mood, content, created_at)
VALUES (1002, 101, '🌧️', 'Read three pages of Midaq Alley today. The kettle on, the rain hasn\'t stopped. Small good day.', DATE_SUB(NOW(), INTERVAL 2 HOUR));

-- Seed 9: Link journal entries to tags
INSERT INTO journal_entry_tags (entry_id, tag_id) VALUES (1001, 1); -- #wisdom
INSERT INTO journal_entry_tags (entry_id, tag_id) VALUES (1001, 2); -- #surrender
INSERT INTO journal_entry_tags (entry_id, tag_id) VALUES (1002, 3); -- #calm
INSERT INTO journal_entry_tags (entry_id, tag_id) VALUES (1002, 4); -- #arabic-lit
