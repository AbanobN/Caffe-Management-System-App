import type { Sale, SaleItem } from '../../models/sales';
import { queryFirst, run } from '../sqliteHelpers';

function rowToSale(row: any): Sale {
    return {
        id: row.id,
        date: row.date,
        totalAmount: row.totalAmount,
        paidAmount: row.paidAmount,
        debtorId: row.debtorId ?? null,
    };
}

export async function createSale(
    input: Omit<Sale, 'id'>
): Promise<Sale> {
    const result = await run(
        `
    INSERT INTO sales
    (date, totalAmount, paidAmount, debtorId)
    VALUES (?, ?, ?, ?)
    `,
        [input.date, input.totalAmount, input.paidAmount, input.debtorId ?? null]
    );

    const id = result.lastInsertRowId;
    const row = await queryFirst('SELECT * FROM sales WHERE id = ?', [id]);
    if (!row) throw new Error('Failed to load created sale');
    return rowToSale(row);
}

export async function createSaleItems(
    items: Omit<SaleItem, 'id'>[]
): Promise<void> {
    for (const item of items) {
        await run(
            `INSERT INTO sale_items
            (saleId, menuItemId, quantity, unitPrice, lineTotal)
            VALUES (?, ?, ?, ?, ?)`,
            [
                item.saleId,
                item.menuItemId,
                item.quantity,
                item.unitPrice,
                item.lineTotal,
            ]
        );
    }
}
