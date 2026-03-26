import { getDatabase, generateId, now } from '../db/database';
import { Person, CreatePersonDTO, PersonType } from '../types';

export class PersonRepository {
  async create(dto: CreatePersonDTO): Promise<Person> {
    const db = getDatabase();
    const id = generateId();
    const ts = now();

    const entity: Person = {
      id,
      name: dto.name,
      type: dto.type ?? PersonType.AUTRE,
      createdAt: ts,
      updatedAt: ts,
      notes: dto.notes ?? null,
      colorSeed: dto.colorSeed ?? Math.floor(Math.random() * 360),
      archived: 0,
      relationshipWeight: dto.relationshipWeight ?? 3,
    };

    await db.runAsync(
      `INSERT INTO people (id, name, type, createdAt, updatedAt, notes, colorSeed, archived, relationshipWeight)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [entity.id, entity.name, entity.type, entity.createdAt, entity.updatedAt,
       entity.notes, entity.colorSeed, entity.archived, entity.relationshipWeight]
    );

    return entity;
  }

  async findById(id: string): Promise<Person | null> {
    const db = getDatabase();
    const row = await db.getFirstAsync<Person>('SELECT * FROM people WHERE id = ?', [id]);
    return row ?? null;
  }

  async findAll(): Promise<Person[]> {
    const db = getDatabase();
    return db.getAllAsync<Person>('SELECT * FROM people WHERE archived = 0 ORDER BY name ASC');
  }

  async update(id: string, updates: Partial<Person>): Promise<Person | null> {
    const db = getDatabase();
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates, updatedAt: now() };
    await db.runAsync(
      `UPDATE people SET name = ?, type = ?, notes = ?, colorSeed = ?, archived = ?,
         relationshipWeight = ?, updatedAt = ? WHERE id = ?`,
      [updated.name, updated.type, updated.notes, updated.colorSeed,
       updated.archived, updated.relationshipWeight, updated.updatedAt, id]
    );

    return updated;
  }

  async archive(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('UPDATE people SET archived = 1, updatedAt = ? WHERE id = ?', [now(), id]);
  }

  async delete(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM people WHERE id = ?', [id]);
  }
}

export const personRepository = new PersonRepository();
