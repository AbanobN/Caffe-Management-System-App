// services/salesService.ts
import {
    getInventoryItemById,
    updateInventoryItemStock,
} from '../db/repositories/inventoryRepository';
import {
    getIngredientsForMenuItem,
    getMenuItemById,
} from '../db/repositories/menuRepository';
import {
    createSale,
    createSaleItems,
} from '../db/repositories/salesRepository';
import type { Sale } from '../models/sales';

// شكل الـ item اللي الشيفط هيبعته (من UI مثلاً)
export interface SaleItemInput {
    menuItemId: number;
    quantity: number;
    unitPrice?: number; // لو مش موجود → نجيب من menu_items.sellPrice
}

export interface SaleInput {
    date: string;             // ISO date
    paidAmount: number;
    debtorId?: number | null; // لو دين على عميل
    items: SaleItemInput[];
}

/**
 * ✅ تسجيل عملية بيع كاملة:
 * - يحسب إجمالي الفاتورة
 * - ينشئ Sale + SaleItems
 * - يخصم من المخزون بناءً على Recipe
 */
export async function recordSale(input: SaleInput): Promise<Sale> {
    if (input.items.length === 0) {
        throw new Error('Sale must have at least one item');
    }

    // 1) حساب lineTotal لكل عنصر + totalAmount
    const saleItemsToCreate: {
        menuItemId: number;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
    }[] = [];

    let totalAmount = 0;

    for (const item of input.items) {
        const menuItem = await getMenuItemById(item.menuItemId);
        if (!menuItem) {
            throw new Error(`Menu item with id ${item.menuItemId} not found`);
        }

        const unitPrice = item.unitPrice ?? menuItem.sellPrice;
        const lineTotal = unitPrice * item.quantity;

        totalAmount += lineTotal;

        saleItemsToCreate.push({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            unitPrice,
            lineTotal,
        });
    }

    if (input.paidAmount > totalAmount) {
        throw new Error(
            `Paid amount (${input.paidAmount}) cannot be greater than total amount (${totalAmount})`
        );
    }

    // 2) إنشاء Sale في DB
    const saleToCreate: Omit<Sale, 'id'> = {
        date: input.date,
        totalAmount,
        paidAmount: input.paidAmount,
        debtorId: input.debtorId ?? null,
    };

    const sale = await createSale(saleToCreate);

    // 3) إنشاء SaleItems
    const saleItemsRows = saleItemsToCreate.map((si) => ({
        saleId: sale.id,
        menuItemId: si.menuItemId,
        quantity: si.quantity,
        unitPrice: si.unitPrice,
        lineTotal: si.lineTotal,
    }));

    await createSaleItems(saleItemsRows);

    // 4) خصم المخزون بناءً على Ingredients لكل MenuItem
    for (const si of saleItemsRows) {
        const ingredients = await getIngredientsForMenuItem(si.menuItemId);

        for (const ingredient of ingredients) {
            // الكمية المستهلكة من الـ inventory item ده في sale item واحد
            const totalConsumed =
                ingredient.quantitySmallUsed * si.quantity; // مثال: 20g * 3 أكواب = 60g

            const inventoryItem = await getInventoryItemById(
                ingredient.inventoryItemId
            );

            if (!inventoryItem) {
                throw new Error(
                    `Inventory item with id ${ingredient.inventoryItemId} not found`
                );
            }

            // تأكد إن المخزون يكفي
            if (inventoryItem.currentStockSmall < totalConsumed) {
                throw new Error(
                    `Not enough stock for "${inventoryItem.name}". Required ${totalConsumed} ${inventoryItem.smallUnitName}, available ${inventoryItem.currentStockSmall}.`
                );
            }

            const newStock = inventoryItem.currentStockSmall - totalConsumed;
            await updateInventoryItemStock(inventoryItem.id, newStock);
        }
    }

    return sale;
}
