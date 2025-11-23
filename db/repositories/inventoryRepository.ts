import type { InventoryItem } from '../../models/inventory';
import { queryAll, queryFirst, run } from '../sqliteHelpers';

function rowToInventoryItem(row: any): InventoryItem {
    return {
        id: row.id,
        name: row.name,
        bigUnitName: row.bigUnitName,
        smallUnitName: row.smallUnitName,
        convertRatio: row.convertRatio,
        currentStockSmall: row.currentStockSmall,
        purchasePricePerBigUnit: row.purchasePricePerBigUnit,
        purchasePricePerSmallUnit:
            row.purchasePricePerSmallUnit !== null
                ? row.purchasePricePerSmallUnit
                : undefined,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    };
}

// Get all inventory items
export async function getAllInventoryItems(): Promise<InventoryItem[]> {
    const rows = await queryAll('SELECT * FROM inventory_items ORDER BY name ASC');
    return rows.map(rowToInventoryItem);
}

// Get single item
export async function getInventoryItemById(id: number): Promise<InventoryItem | null> {
    const row = await queryFirst('SELECT * FROM inventory_items WHERE id = ?', [id]);
    return row ? rowToInventoryItem(row) : null;
}

export interface CreateInventoryItemInput {
    name: string;
    bigUnitName: string;
    smallUnitName: string;
    convertRatio: number;
    purchasePricePerBigUnit: number;
    purchasePricePerSmallUnit?: number;
}

export async function createInventoryItem(
    input: CreateInventoryItemInput
): Promise<InventoryItem> {
    const now = new Date().toISOString();

    const result = await run(
    `INSERT INTO inventory_items
    (name, bigUnitName, smallUnitName, convertRatio, currentStockSmall, purchasePricePerBigUnit, purchasePricePerSmallUnit, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            input.name,
            input.bigUnitName,
            input.smallUnitName,
            input.convertRatio,
            0,
            input.purchasePricePerBigUnit,
            input.purchasePricePerSmallUnit ?? null,
            now,
            now,
        ]
    );

    const newItem = await getInventoryItemById(result.lastInsertRowId);
    if (!newItem) throw new Error('Failed to load created inventory item');
    return newItem;
}

export async function updateInventoryItemStock(
    id: number,
    newStockSmall: number
): Promise<void> {
    const now = new Date().toISOString();
    await run(
    `UPDATE inventory_items
    SET currentStockSmall = ?, updatedAt = ?
    WHERE id = ?`,
    [newStockSmall, now, id]
    );
}

export async function deleteInventoryItem(id: number): Promise<void> {
    await run(`DELETE FROM inventory_items WHERE id = ?`, [id]);
}
