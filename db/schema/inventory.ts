import type * as SQLite from 'expo-sqlite';

export async function createInventoryTables(
    db: SQLite.SQLiteDatabase
): Promise<void> {
    // InventoryItem
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS inventory_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        bigUnitName TEXT NOT NULL,
        smallUnitName TEXT NOT NULL,
        convertRatio REAL NOT NULL,
        currentStockSmall REAL NOT NULL DEFAULT 0,
        purchasePricePerBigUnit REAL NOT NULL,
        purchasePricePerSmallUnit REAL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
        );`
    );

    // Purchases
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        supplierId INTEGER,
        date TEXT NOT NULL,
        totalAmount REAL NOT NULL,
        cashPaid REAL NOT NULL,
        debtAmount REAL NOT NULL,
        createdAt TEXT NOT NULL
        );`
    );

    // PurchaseItems
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS purchase_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        purchaseId INTEGER NOT NULL,
        inventoryItemId INTEGER NOT NULL,
        quantityBig REAL NOT NULL,
        quantitySmall REAL NOT NULL,
        stockAddedSmall REAL NOT NULL,
        unitPricePerBig REAL NOT NULL,
        unitPricePerSmall REAL,
        lineTotal REAL NOT NULL,
        FOREIGN KEY (purchaseId) REFERENCES purchases(id),
        FOREIGN KEY (inventoryItemId) REFERENCES inventory_items(id)
        );`
    );
}
