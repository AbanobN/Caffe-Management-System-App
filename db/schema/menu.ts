import type * as SQLite from 'expo-sqlite';

export async function createMenuTables(
    db: SQLite.SQLiteDatabase
): Promise<void> {
    // MenuItems
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS menu_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        sellPrice REAL NOT NULL,
        isActive INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
        );`
    );

    // MenuItemIngredients
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS menu_item_ingredients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        menuItemId INTEGER NOT NULL,
        inventoryItemId INTEGER NOT NULL,
        quantitySmallUsed REAL NOT NULL,
        FOREIGN KEY (menuItemId) REFERENCES menu_items(id),
        FOREIGN KEY (inventoryItemId) REFERENCES inventory_items(id)
        );`
    );
}
