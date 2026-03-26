import { getDatabase, generateId, now } from '../db/database';
import { Reminder, ReminderType } from '../types';

export class ReminderRepository {
  async create(promiseId: string, remindAt: string, type: ReminderType = ReminderType.EXACT): Promise<Reminder> {
    const db = getDatabase();
    const id = generateId();
    const ts = now();
    const reminder: Reminder = {
      id, promiseId, remindAt, type, isSent: 0, notificationId: null, createdAt: ts,
    };
    await db.runAsync(
      'INSERT INTO reminders (id, promiseId, remindAt, type, isSent, notificationId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, promiseId, remindAt, type, 0, null, ts]
    );
    return reminder;
  }

  async findByPromiseId(promiseId: string): Promise<Reminder[]> {
    const db = getDatabase();
    return db.getAllAsync<Reminder>(
      'SELECT * FROM reminders WHERE promiseId = ? ORDER BY remindAt ASC', [promiseId]
    );
  }

  async updateNotificationId(id: string, notificationId: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('UPDATE reminders SET notificationId = ? WHERE id = ?', [notificationId, id]);
  }

  async markSent(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('UPDATE reminders SET isSent = 1 WHERE id = ?', [id]);
  }

  async deleteByPromiseId(promiseId: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM reminders WHERE promiseId = ?', [promiseId]);
  }

  async delete(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM reminders WHERE id = ?', [id]);
  }
}

export const reminderRepository = new ReminderRepository();
