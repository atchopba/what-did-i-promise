import { getDatabase, generateId, now } from '../db/database';
import {
  Promise as PromiseEntity,
  CreatePromiseDTO,
  UpdatePromiseDTO,
  PromiseWithPerson,
  PromiseFilters,
  PromiseStatus,
  ContextType,
  PromisePriority,
  DuePrecision,
  RecurrenceType,
  SourceType,
} from '../types';

export class PromiseRepository {
  async create(dto: CreatePromiseDTO): Promise<PromiseEntity> {
    const db = getDatabase();
    const id = generateId();
    const ts = now();

    const entity: PromiseEntity = {
      id,
      title: dto.title,
      normalizedTitle: dto.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      personId: dto.personId ?? null,
      contextType: dto.contextType ?? ContextType.PERSONNEL,
      dueDate: dto.dueDate ?? null,
      duePrecision: dto.duePrecision ?? DuePrecision.AUCUNE,
      priority: dto.priority ?? PromisePriority.NORMALE,
      status: PromiseStatus.OUVERTE,
      createdAt: ts,
      updatedAt: ts,
      completedAt: null,
      snoozedUntil: null,
      lastViewedAt: null,
      lastReminderAt: null,
      isArchived: 0,
      sourceType: dto.sourceType ?? SourceType.MANUAL,
      categoryId: dto.categoryId ?? null,
      riskScore: 0,
      notesCount: 0,
      followUpCount: 0,
      recurrence: dto.recurrence ?? RecurrenceType.AUCUNE,
      attachmentUri: dto.attachmentUri ?? null,
    };

    await db.runAsync(
      `INSERT INTO promises (id, title, normalizedTitle, personId, contextType, dueDate, duePrecision,
         priority, status, createdAt, updatedAt, completedAt, snoozedUntil, lastViewedAt, lastReminderAt,
         isArchived, sourceType, categoryId, riskScore, notesCount, followUpCount, recurrence, attachmentUri)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [entity.id, entity.title, entity.normalizedTitle ?? null, entity.personId, entity.contextType,
       entity.dueDate, entity.duePrecision, entity.priority, entity.status, entity.createdAt,
       entity.updatedAt, entity.completedAt, entity.snoozedUntil, entity.lastViewedAt,
       entity.lastReminderAt, entity.isArchived, entity.sourceType, entity.categoryId,
       entity.riskScore, entity.notesCount, entity.followUpCount, entity.recurrence, entity.attachmentUri]
    );

    return entity;
  }

  async findById(id: string): Promise<PromiseEntity | null> {
    const db = getDatabase();
    const row = await db.getFirstAsync<PromiseEntity>(
      'SELECT * FROM promises WHERE id = ?', [id]
    );
    return row ?? null;
  }

  async findWithPerson(id: string): Promise<PromiseWithPerson | null> {
    const db = getDatabase();
    const row = await db.getFirstAsync<any>(
      `SELECT p.*, per.id as per_id, per.name as per_name, per.type as per_type,
              per.colorSeed as per_colorSeed, per.relationshipWeight as per_weight, per.archived as per_archived,
              per.createdAt as per_createdAt, per.updatedAt as per_updatedAt, per.notes as per_notes
       FROM promises p
       LEFT JOIN people per ON p.personId = per.id
       WHERE p.id = ?`,
      [id]
    );
    if (!row) return null;
    return this.mapRowWithPerson(row);
  }

  async findAll(filters?: PromiseFilters): Promise<PromiseWithPerson[]> {
    const db = getDatabase();
    let query = `
      SELECT p.*, per.id as per_id, per.name as per_name, per.type as per_type,
             per.colorSeed as per_colorSeed, per.relationshipWeight as per_weight, per.archived as per_archived,
             per.createdAt as per_createdAt, per.updatedAt as per_updatedAt, per.notes as per_notes
      FROM promises p
      LEFT JOIN people per ON p.personId = per.id
      WHERE p.isArchived = 0
    `;
    const params: any[] = [];

    if (filters?.status && filters.status.length > 0) {
      query += ` AND p.status IN (${filters.status.map(() => '?').join(',')})`;
      params.push(...filters.status);
    }
    if (filters?.personId) {
      query += ' AND p.personId = ?';
      params.push(filters.personId);
    }
    if (filters?.contextType) {
      query += ' AND p.contextType = ?';
      params.push(filters.contextType);
    }
    if (filters?.priority) {
      query += ' AND p.priority = ?';
      params.push(filters.priority);
    }
    if (filters?.searchQuery) {
      query += ' AND (p.title LIKE ? OR p.normalizedTitle LIKE ?)';
      const q = `%${filters.searchQuery}%`;
      params.push(q, q);
    }

    query += ' ORDER BY p.createdAt DESC';

    const rows = await db.getAllAsync<any>(query, params);
    return rows.map(this.mapRowWithPerson);
  }

  async findActive(): Promise<PromiseWithPerson[]> {
    return this.findAll({
      status: [PromiseStatus.OUVERTE, PromiseStatus.EN_COURS, PromiseStatus.EN_RETARD],
    });
  }

  async findByPersonId(personId: string): Promise<PromiseWithPerson[]> {
    return this.findAll({ personId });
  }

  async update(id: string, dto: UpdatePromiseDTO): Promise<PromiseEntity | null> {
    const db = getDatabase();
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated: PromiseEntity = {
      ...existing,
      ...dto,
      updatedAt: now(),
    };

    await db.runAsync(
      `UPDATE promises SET
         title = ?, personId = ?, contextType = ?, dueDate = ?, duePrecision = ?,
         priority = ?, status = ?, updatedAt = ?, snoozedUntil = ?, recurrence = ?,
         attachmentUri = ?, categoryId = ?
       WHERE id = ?`,
      [updated.title, updated.personId, updated.contextType, updated.dueDate,
       updated.duePrecision, updated.priority, updated.status, updated.updatedAt,
       updated.snoozedUntil, updated.recurrence, updated.attachmentUri, updated.categoryId, id]
    );

    return updated;
  }

  async updateStatus(id: string, status: PromiseStatus): Promise<void> {
    const db = getDatabase();
    const ts = now();
    const completedAt = status === PromiseStatus.TENUE ? ts : null;
    await db.runAsync(
      'UPDATE promises SET status = ?, updatedAt = ?, completedAt = ? WHERE id = ?',
      [status, ts, completedAt, id]
    );
  }

  async updateRiskScore(id: string, score: number): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
      'UPDATE promises SET riskScore = ?, updatedAt = ? WHERE id = ?',
      [score, now(), id]
    );
  }

  async updateLastViewed(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
      'UPDATE promises SET lastViewedAt = ? WHERE id = ?',
      [now(), id]
    );
  }

  async incrementNotesCount(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
      'UPDATE promises SET notesCount = notesCount + 1, updatedAt = ? WHERE id = ?',
      [now(), id]
    );
  }

  async archive(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
      'UPDATE promises SET isArchived = 1, status = ?, updatedAt = ? WHERE id = ?',
      [PromiseStatus.ARCHIVEE, now(), id]
    );
  }

  async delete(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM promises WHERE id = ?', [id]);
  }

  async findOverdue(): Promise<PromiseWithPerson[]> {
    const db = getDatabase();
    const today = new Date().toISOString().split('T')[0];
    const rows = await db.getAllAsync<any>(
      `SELECT p.*, per.id as per_id, per.name as per_name, per.type as per_type,
              per.colorSeed as per_colorSeed, per.relationshipWeight as per_weight, per.archived as per_archived,
              per.createdAt as per_createdAt, per.updatedAt as per_updatedAt, per.notes as per_notes
       FROM promises p
       LEFT JOIN people per ON p.personId = per.id
       WHERE p.isArchived = 0
         AND p.status NOT IN ('tenue', 'annulee', 'archivee')
         AND p.dueDate IS NOT NULL
         AND date(p.dueDate) < date(?)
       ORDER BY p.dueDate ASC`,
      [today]
    );
    return rows.map(this.mapRowWithPerson);
  }

  async findDueToday(): Promise<PromiseWithPerson[]> {
    const db = getDatabase();
    const today = new Date().toISOString().split('T')[0];
    const rows = await db.getAllAsync<any>(
      `SELECT p.*, per.id as per_id, per.name as per_name, per.type as per_type,
              per.colorSeed as per_colorSeed, per.relationshipWeight as per_weight, per.archived as per_archived,
              per.createdAt as per_createdAt, per.updatedAt as per_updatedAt, per.notes as per_notes
       FROM promises p
       LEFT JOIN people per ON p.personId = per.id
       WHERE p.isArchived = 0
         AND p.status NOT IN ('tenue', 'annulee', 'archivee')
         AND p.dueDate IS NOT NULL
         AND date(p.dueDate) = date(?)
       ORDER BY p.priority DESC`,
      [today]
    );
    return rows.map(this.mapRowWithPerson);
  }

  async findDueThisWeek(): Promise<PromiseWithPerson[]> {
    const db = getDatabase();
    const today = new Date().toISOString().split('T')[0];
    const weekEnd = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    const rows = await db.getAllAsync<any>(
      `SELECT p.*, per.id as per_id, per.name as per_name, per.type as per_type,
              per.colorSeed as per_colorSeed, per.relationshipWeight as per_weight, per.archived as per_archived,
              per.createdAt as per_createdAt, per.updatedAt as per_updatedAt, per.notes as per_notes
       FROM promises p
       LEFT JOIN people per ON p.personId = per.id
       WHERE p.isArchived = 0
         AND p.status NOT IN ('tenue', 'annulee', 'archivee')
         AND p.dueDate IS NOT NULL
         AND date(p.dueDate) >= date(?)
         AND date(p.dueDate) <= date(?)
       ORDER BY p.dueDate ASC`,
      [today, weekEnd]
    );
    return rows.map(this.mapRowWithPerson);
  }

  async findStale(daysThreshold: number = 7): Promise<PromiseWithPerson[]> {
    const db = getDatabase();
    const cutoff = new Date(Date.now() - daysThreshold * 86400000).toISOString();
    const rows = await db.getAllAsync<any>(
      `SELECT p.*, per.id as per_id, per.name as per_name, per.type as per_type,
              per.colorSeed as per_colorSeed, per.relationshipWeight as per_weight, per.archived as per_archived,
              per.createdAt as per_createdAt, per.updatedAt as per_updatedAt, per.notes as per_notes
       FROM promises p
       LEFT JOIN people per ON p.personId = per.id
       WHERE p.isArchived = 0
         AND p.status NOT IN ('tenue', 'annulee', 'archivee')
         AND p.dueDate IS NULL
         AND p.createdAt < ?
         AND (p.lastViewedAt IS NULL OR p.lastViewedAt < ?)
       ORDER BY p.createdAt ASC`,
      [cutoff, cutoff]
    );
    return rows.map(this.mapRowWithPerson);
  }

  async findRecentlyCompleted(days: number = 7): Promise<PromiseWithPerson[]> {
    const db = getDatabase();
    const cutoff = new Date(Date.now() - days * 86400000).toISOString();
    const rows = await db.getAllAsync<any>(
      `SELECT p.*, per.id as per_id, per.name as per_name, per.type as per_type,
              per.colorSeed as per_colorSeed, per.relationshipWeight as per_weight, per.archived as per_archived,
              per.createdAt as per_createdAt, per.updatedAt as per_updatedAt, per.notes as per_notes
       FROM promises p
       LEFT JOIN people per ON p.personId = per.id
       WHERE p.status = 'tenue'
         AND p.completedAt IS NOT NULL
         AND p.completedAt > ?
       ORDER BY p.completedAt DESC
       LIMIT 10`,
      [cutoff]
    );
    return rows.map(this.mapRowWithPerson);
  }

  async getStats(): Promise<{
    total: number;
    active: number;
    kept: number;
    overdue: number;
    cancelled: number;
  }> {
    const db = getDatabase();
    const row = await db.getFirstAsync<any>(
      `SELECT
         COUNT(*) as total,
         SUM(CASE WHEN status IN ('ouverte','en_cours','en_retard') THEN 1 ELSE 0 END) as active,
         SUM(CASE WHEN status = 'tenue' THEN 1 ELSE 0 END) as kept,
         SUM(CASE WHEN status = 'en_retard' THEN 1 ELSE 0 END) as overdue,
         SUM(CASE WHEN status = 'annulee' THEN 1 ELSE 0 END) as cancelled
       FROM promises WHERE isArchived = 0`
    );
    return {
      total: row?.total ?? 0,
      active: row?.active ?? 0,
      kept: row?.kept ?? 0,
      overdue: row?.overdue ?? 0,
      cancelled: row?.cancelled ?? 0,
    };
  }

  private mapRowWithPerson(row: any): PromiseWithPerson {
    const {
      per_id, per_name, per_type, per_colorSeed, per_weight, per_archived,
      per_createdAt, per_updatedAt, per_notes,
      ...promiseData
    } = row;
    const result: PromiseWithPerson = { ...promiseData };
    if (per_id) {
      result.person = {
        id: per_id,
        name: per_name,
        type: per_type,
        colorSeed: per_colorSeed,
        relationshipWeight: per_weight,
        archived: per_archived,
        createdAt: per_createdAt ?? '',
        updatedAt: per_updatedAt ?? '',
        notes: per_notes ?? null,
      };
    }
    return result;
  }
}

export const promiseRepository = new PromiseRepository();
