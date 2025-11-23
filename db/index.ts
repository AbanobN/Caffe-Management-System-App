import * as SQLite from 'expo-sqlite';
import { createInventoryTables } from './schema/inventory';
import { createMenuTables } from './schema/menu';
import { createSalesTables } from './schema/sales';

const DB_NAME = 'bondok_caffee.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDB(): Promise<SQLite.SQLiteDatabase> {
    if (dbInstance) return dbInstance;

    dbInstance = await SQLite.openDatabaseAsync(DB_NAME);

    await dbInstance.execAsync('PRAGMA foreign_keys = ON;');

    await initDB(dbInstance);

    return dbInstance;
}

async function initDB(db: SQLite.SQLiteDatabase): Promise<void> {
    await createInventoryTables(db);
    await createMenuTables(db);
    await createSalesTables(db);
}
