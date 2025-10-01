import Database from 'better-sqlite3';
import path from 'path';

// Create and export a singleton SQLite connection using better-sqlite3
// The database file lives in the custom Go backend folder to share data.
// We resolve it relative to the Next.js project directory.
const DB_PATH = path.join(process.cwd(), '..', 'custom', 'backend', 'data', 'blog.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    // Open database in default mode; better-sqlite3 is synchronous and safe for API routes.
    db = new Database(DB_PATH);
    // Ensure required tables exist (authors, sessions). In production, migrations should manage this.
    db.exec(`
      CREATE TABLE IF NOT EXISTS authors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        deleted_at TEXT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL DEFAULT '',
        bio TEXT,
        role TEXT NOT NULL DEFAULT 'admin'
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        deleted_at TEXT,
        token TEXT NOT NULL UNIQUE,
        author_id INTEGER NOT NULL,
        expires_at TEXT NOT NULL,
        FOREIGN KEY(author_id) REFERENCES authors(id)
      );
    `);
  }
  return db;
}