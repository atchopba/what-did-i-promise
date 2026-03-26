import * as SQLite from 'expo-sqlite';
import { ALL_TABLES, INDEXES } from './schema';
import { seedDatabase } from './seed';

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

export const initDatabase = async (): Promise<void> => {
  try {
    db = await SQLite.openDatabaseAsync('whatdidipromise.db');

    // Enable WAL mode for better performance
    await db.execAsync('PRAGMA journal_mode = WAL;');
    await db.execAsync('PRAGMA foreign_keys = ON;');

    // Create all tables
    for (const createTableSQL of ALL_TABLES) {
      await db.execAsync(createTableSQL);
    }

    // Create indexes
    for (const indexSQL of INDEXES) {
      await db.execAsync(indexSQL);
    }

    // Seed the database with initial data if empty
    await seedDatabase(db);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.closeAsync();
    db = null;
  }
};

// Helper to generate UUID
export const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const now = (): string => new Date().toISOString();
