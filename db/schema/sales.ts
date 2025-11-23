// db/schema/sales.ts
import type * as SQLite from 'expo-sqlite';

export async function createSalesTables(
    db: SQLite.SQLiteDatabase
): Promise<void> {
    // Sales
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        totalAmount REAL NOT NULL,
        paidAmount REAL NOT NULL,
        debtorId INTEGER
        );`
    );

    // SaleItems
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sale_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        saleId INTEGER NOT NULL,
        menuItemId INTEGER NOT NULL,
        quantity REAL NOT NULL,
        unitPrice REAL NOT NULL,
        lineTotal REAL NOT NULL,
        FOREIGN KEY (saleId) REFERENCES sales(id),
        FOREIGN KEY (menuItemId) REFERENCES menu_items(id)
        );`
    );
}
