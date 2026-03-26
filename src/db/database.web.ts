/**
 * Web-specific database implementation using AlaSQL (pure JS, no WASM).
 * Metro automatically uses this file instead of database.ts when bundling for web.
 */
// @ts-ignore – AlaSQL has incomplete type declarations
import alasql from 'alasql';

import { ALL_TABLES, INDEXES } from './schema';
import { seedDatabase } from './seed';

let initialized = false;

// ---------------------------------------------------------------------------
// SQL sanitisation: strip SQLite-specific syntax unsupported by AlaSQL
// ---------------------------------------------------------------------------
const sanitize = (sql: string): string => {
  const trimmed = sql.trim();
  if (!trimmed) return '';

  // Skip PRAGMA statements entirely (WAL mode, foreign_keys, etc.)
  if (/^PRAGMA\b/i.test(trimmed)) return '';

  return (
    trimmed
      // INSERT OR IGNORE INTO → INSERT INTO
      .replace(/INSERT\s+OR\s+IGNORE\b/gi, 'INSERT')
      // Remove every FOREIGN KEY line (including any trailing comma on the previous line)
      .split('\n')
      .filter((line) => !/FOREIGN KEY/i.test(line))
      .join('\n')
      // Clean up trailing commas left before the closing parenthesis
      .replace(/,(\s*\n\s*\))/g, '$1')
      .trim()
  );
};

// ---------------------------------------------------------------------------
// Thin async wrapper around the synchronous AlaSQL API
// ---------------------------------------------------------------------------
const webDB = {
  async execAsync(sql: string): Promise<void> {
    // May contain multiple statements (e.g. multi-line schema strings)
    const stmts = sql.split(';').map((s) => sanitize(s)).filter(Boolean);
    for (const stmt of stmts) {
      try {
        alasql(stmt);
      } catch (e) {
        // Non-fatal: DDL warnings (e.g. table already exists) are ignored
        console.warn('[WebDB] execAsync warning:', (e as Error).message, '|', stmt.slice(0, 80));
      }
    }
  },

  async runAsync(sql: string, params: unknown[] = []): Promise<void> {
    const clean = sanitize(sql);
    if (!clean) return;
    try {
      alasql(clean, params);
    } catch (e) {
      console.warn('[WebDB] runAsync warning:', (e as Error).message, '|', clean.slice(0, 80));
    }
  },

  async getFirstAsync<T>(sql: string, params: unknown[] = []): Promise<T | null> {
    const clean = sanitize(sql);
    if (!clean) return null;
    try {
      const rows = alasql(clean, params) as T[];
      return rows?.[0] ?? null;
    } catch (e) {
      console.warn('[WebDB] getFirstAsync warning:', (e as Error).message, '|', clean.slice(0, 80));
      return null;
    }
  },

  async getAllAsync<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    const clean = sanitize(sql);
    if (!clean) return [];
    try {
      return (alasql(clean, params) as T[]) ?? [];
    } catch (e) {
      console.warn('[WebDB] getAllAsync warning:', (e as Error).message, '|', clean.slice(0, 80));
      return [];
    }
  },

  async closeAsync(): Promise<void> {
    initialized = false;
  },
};

// ---------------------------------------------------------------------------
// Public API – mirrors src/db/database.ts
// ---------------------------------------------------------------------------

export const getDatabase = (): typeof webDB => {
  if (!initialized) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return webDB;
};

export const initDatabase = async (): Promise<void> => {
  try {
    // Create tables (PRAGMA and FOREIGN KEY constraints are stripped)
    for (const createSQL of ALL_TABLES) {
      const clean = sanitize(createSQL);
      if (clean) {
        try {
          alasql(clean);
        } catch (e) {
          console.warn('[WebDB] table creation warning:', (e as Error).message);
        }
      }
    }

    // Create indexes (silently ignore failures)
    for (const indexSQL of INDEXES) {
      const clean = sanitize(indexSQL);
      if (clean) {
        try {
          alasql(clean);
        } catch {
          // ignore
        }
      }
    }

    initialized = true;

    // Seed initial data
    await seedDatabase(webDB);
  } catch (error) {
    console.error('[WebDB] Initialization failed:', error);
    throw error;
  }
};

export const closeDatabase = async (): Promise<void> => {
  initialized = false;
};

// Shared utilities (same as database.ts)
export const generateId = (): string =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

export const now = (): string => new Date().toISOString();
