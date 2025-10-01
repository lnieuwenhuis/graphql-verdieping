import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/sqlite';
import bcrypt from 'bcryptjs';

interface RegisterBody {
  name?: string;
  email?: string;
  password?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, password } = (req.body as RegisterBody) || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    const db = getDb();

    // Check if email already exists (SQLite uses single quotes for empty string literals)
    const existing = db
      .prepare("SELECT id FROM authors WHERE email = ? AND (deleted_at IS NULL OR deleted_at = '')")
      .get(email);
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const now = new Date().toISOString();
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert author
    const insertAuthor = db.prepare(
      'INSERT INTO authors (created_at, updated_at, name, email, password, bio, role) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    let role;
    if (email === "admin@admin.nl") {
      role = "admin";
    } else {
      role = "user";
    }
    const info = insertAuthor.run(now, now, name, email, passwordHash, '', role);
    const authorId = info.lastInsertRowid as number;

    // Create session token and insert
    const token = `${authorId}-${Math.random().toString(36).slice(2)}-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(); // 7 days
    db.prepare('INSERT INTO sessions (created_at, updated_at, token, author_id, expires_at) VALUES (?, ?, ?, ?, ?)')
      .run(now, now, token, authorId, expiresAt);

    const author = db.prepare('SELECT id, name, email, role FROM authors WHERE id = ?').get(authorId);

    return res.status(201).json({ token, author });
  } catch (err) {
    console.error('Registration API error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}