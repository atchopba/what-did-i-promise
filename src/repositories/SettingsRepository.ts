import { getDatabase } from '../db/database';

export class SettingsRepository {
  async get(key: string): Promise<string | null> {
    const db = getDatabase();
    const row = await db.getFirstAsync<{ value: string }>(
      'SELECT value FROM app_settings WHERE key = ?', [key]
    );
    return row?.value ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
      'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)', [key, value]
    );
  }

  async getBool(key: string, defaultValue: boolean = false): Promise<boolean> {
    const val = await this.get(key);
    if (val === null) return defaultValue;
    return val === 'true';
  }

  async setBool(key: string, value: boolean): Promise<void> {
    await this.set(key, value ? 'true' : 'false');
  }
}

export const settingsRepository = new SettingsRepository();
