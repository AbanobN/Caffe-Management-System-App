
// db/repositories/purchaseRepository.ts
import type { Purchase, PurchaseItem } from '../../models/inventory';
import { queryAll, queryFirst, run } from '../sqliteHelpers';

// محوّل من صف SQL لكائن TypeScript
function rowToPurchase(row: any): Purchase {
    return {
        id: row.id,
        supplierId: row.supplierId ?? null,
        date: row.date,
        totalAmount: row.totalAmount,
        cashPaid: row.cashPaid,
        debtAmount: row.debtAmount,
        createdAt: row.createdAt,
    };
}

function rowToPurchaseItem(row: any): PurchaseItem {
    return {
        id: row.id,
        purchaseId: row.purchaseId,
        inventoryItemId: row.inventoryItemId,
        quantityBig: row.quantityBig,
        quantitySmall: row.quantitySmall,
        stockAddedSmall: row.stockAddedSmall,
        unitPricePerBig: row.unitPricePerBig,
        unitPricePerSmall:
            row.unitPricePerSmall !== null ? row.unitPricePerSmall : undefined,
        lineTotal: row.lineTotal,
    };
}

/**
 * ✅ إنشاء Purchase جديد في جدول purchases
 */
export interface CreatePurchaseInput {
    supplierId?: number | null;
    date: string;          // ISO string
    totalAmount: number;
    cashPaid: number;
    debtAmount: number;
}

export async function createPurchase(
    input: CreatePurchaseInput
): Promise<Purchase> {
    const createdAt = new Date().toISOString();

    const result = await run(
        `
    INSERT INTO purchases
    (supplierId, date, totalAmount, cashPaid, debtAmount, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
        [
            input.supplierId ?? null,
            input.date,
            input.totalAmount,
            input.cashPaid,
            input.debtAmount,
            createdAt,
        ]
    );

    const id = result.lastInsertRowId;

    const row = await queryFirst('SELECT * FROM purchases WHERE id = ?', [id]);
    if (!row) {
        throw new Error('Failed to load created purchase');
    }

    return rowToPurchase(row);
}

/**
 * ✅ إنشاء مجموعة PurchaseItem لسطر/سطرين الفاتورة
 */
export async function createPurchaseItems(
    items: Omit<PurchaseItem, 'id'>[]
): Promise<void> {
    for (const item of items) {
        await run(
            `INSERT INTO purchase_items
            (purchaseId, inventoryItemId, quantityBig, quantitySmall, stockAddedSmall, unitPricePerBig, unitPricePerSmall, lineTotal)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                item.purchaseId,
                item.inventoryItemId,
                item.quantityBig,
                item.quantitySmall,
                item.stockAddedSmall,
                item.unitPricePerBig,
                item.unitPricePerSmall ?? null,
                item.lineTotal,
            ]
        );
    }
}

/**
 * ✅ رجّع Purchase واحدة بالـ id
 */
export async function getPurchaseById(
    id: number
): Promise<Purchase | null> {
    const row = await queryFirst('SELECT * FROM purchases WHERE id = ?', [id]);
    return row ? rowToPurchase(row) : null;
}

/**
 * ✅ رجّع كل الـ PurchaseItems لفاتورة معينة
 */
export async function getPurchaseItemsByPurchaseId(
    purchaseId: number
): Promise<PurchaseItem[]> {
    const rows = await queryAll(
        'SELECT * FROM purchase_items WHERE purchaseId = ?',
        [purchaseId]
    );
    return rows.map(rowToPurchaseItem);
}

/**
 * ✅ رجّع كل المشتريات (ممكن تستخدمها في شاشة تقرير)
 */
export async function getAllPurchases(): Promise<Purchase[]> {
    const rows = await queryAll(
        'SELECT * FROM purchases ORDER BY date DESC, id DESC'
    );
    return rows.map(rowToPurchase);
}
