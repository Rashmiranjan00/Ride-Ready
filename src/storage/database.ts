import * as SQLite from 'expo-sqlite';
import { logger } from '@services/logger';

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('rideready.db');
  await initDatabase(db);
  return db;
};

async function initDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS rides (
        id TEXT PRIMARY KEY NOT NULL,
        start_time INTEGER NOT NULL,
        end_time INTEGER NOT NULL,
        distance REAL NOT NULL DEFAULT 0,
        duration INTEGER NOT NULL DEFAULT 0,
        estimated_fuel REAL NOT NULL DEFAULT 0,
        cost REAL NOT NULL DEFAULT 0,
        cost_per_km REAL NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      );

      CREATE TABLE IF NOT EXISTS fuel_logs (
        id TEXT PRIMARY KEY NOT NULL,
        date INTEGER NOT NULL,
        amount REAL NOT NULL,
        liters REAL,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      );
    `);
    logger.info('Database initialized');
  } catch (error) {
    logger.error('Database init failed', error);
    throw error;
  }
}
