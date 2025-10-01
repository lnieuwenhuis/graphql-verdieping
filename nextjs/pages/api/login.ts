import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/sqlite';
import bcrypt from 'bcryptjs';

interface LoginBody {
  email?: string;
  password?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password } = (req.body as LoginBody) || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const db = getDb();

    // Fetch author by email
    const authorRow = db
      .prepare("SELECT id, name, email, role, password FROM authors WHERE email = ? AND (deleted_at IS NULL OR deleted_at = '')")
      .get(email) as { id: number; name: string; email: string; role: string; password: string } | undefined;

    if (!authorRow) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, authorRow.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session token
    const token = `${authorRow.id}-${Math.random().toString(36).slice(2)}-${Date.now()}`;
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(); // 7 days
    db.prepare('INSERT INTO sessions (created_at, updated_at, token, author_id, expires_at) VALUES (?, ?, ?, ?, ?)')
      .run(now, now, token, authorRow.id, expiresAt);

    const author = { id: authorRow.id, name: authorRow.name, email: authorRow.email, role: authorRow.role };
    return res.status(200).json({ token, author });
  } catch (err) {
    console.error('Login API error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}