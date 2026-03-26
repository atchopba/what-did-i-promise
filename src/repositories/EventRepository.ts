import { getDatabase, generateId, now } from '../db/database';
import { PromiseEvent, EventType } from '../types';

export class EventRepository {
  async log(promiseId: string, eventType: EventType, metadata?: Record<string, any>): Promise<PromiseEvent> {
    const db = getDatabase();
    const id = generateId();
    const ts = now();
    const event: PromiseEvent = {
      id, promiseId, eventType,
      metadata: metadata ? JSON.stringify(metadata) : null,
      createdAt: ts,
    };
    await db.runAsync(
      'INSERT INTO promise_events (id, promiseId, eventType, metadata, createdAt) VALUES (?, ?, ?, ?, ?)',
      [id, promiseId, eventType, event.metadata, ts]
    );
    return event;
  }

  async findByPromiseId(promiseId: string): Promise<PromiseEvent[]> {
    const db = getDatabase();
    return db.getAllAsync<PromiseEvent>(
      'SELECT * FROM promise_events WHERE promiseId = ? ORDER BY createdAt DESC LIMIT 50', [promiseId]
    );
  }
}

export const eventRepository = new EventRepository();
