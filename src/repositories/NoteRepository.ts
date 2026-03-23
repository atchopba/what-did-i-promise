import { getDatabase, generateId, now } from '../db/database';
import { PromiseNote } from '../types';

export class NoteRepository {
  async create(promiseId: string, content: string): Promise<PromiseNote> {
    const db = getDatabase();
    const id = generateId();
    const ts = now();
    const note: PromiseNote = { id, promiseId, content, createdAt: ts, updatedAt: ts };
    await db.runAsync(
      'INSERT INTO promise_notes (id, promiseId, content, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
      [id, promiseId, content, ts, ts]
    );
    return note;
  }

  async findByPromiseId(promiseId: string): Promise<PromiseNote[]> {
    const db = getDatabase();
    return db.getAllAsync<PromiseNote>(
      'SELECT * FROM promise_notes WHERE promiseId = ? ORDER BY createdAt DESC', [promiseId]
    );
  }

  async update(id: string, content: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
      'UPDATE promise_notes SET content = ?, updatedAt = ? WHERE id = ?', [content, now(), id]
    );
  }

  async delete(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM promise_notes WHERE id = ?', [id]);
  }
}

export const noteRepository = new NoteRepository();
