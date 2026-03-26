import { getDatabase } from '../db/database';
import { PromiseTemplate } from '../types';

export class TemplateRepository {
  async findAll(): Promise<PromiseTemplate[]> {
    const db = getDatabase();
    return db.getAllAsync<PromiseTemplate>(
      'SELECT * FROM promise_templates ORDER BY builtIn DESC, title ASC'
    );
  }

  async findById(id: string): Promise<PromiseTemplate | null> {
    const db = getDatabase();
    const row = await db.getFirstAsync<PromiseTemplate>(
      'SELECT * FROM promise_templates WHERE id = ?', [id]
    );
    return row ?? null;
  }
}

export const templateRepository = new TemplateRepository();
