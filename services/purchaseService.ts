// services/purchaseService.ts
import {
    getInventoryItemById,
    updateInventoryItemStock,
} from '../db/repositories/inventoryRepository';
import {
    createPurchase,
    createPurchaseItems,
    getPurchaseItemsByPurchaseId,
} from '../db/repositories/purchaseRepository';
import type { Purchase, PurchaseItem } from '../models/inventory';

/**
 * شكل الـ item اللي الشاشة هتبعتُه لما تسجل فاتورة شراء
 */
export interface PurchaseItemInput {
    inventoryItemId: number;
    quantityBig: number;    // مثلاً 10 كيلو
    quantitySmall: number;  // لو اشترى جرامات/مللي مباشرة (غالباً 0 في معظم الحالات)
    unitPricePerBig: number; // سعر الكيلو/اللتر في الفاتورة
}

/**
 * Input عام لعملية الشراء
 */
export interface PurchaseInput {
    supplierId?: number | null;
    date: string;       // ISO string
    cashPaid: number;   // المدفوع كاش
    items: PurchaseItemInput[];
}

/**
 * ✅ تسجيل عملية شراء كاملة:
 * - يحسب stockAddedSmall و lineTotal لكل صنف
 * - يحسب totalAmount و debtAmount
 * - ينشئ Purchase + PurchaseItems في الـ DB
 * - يحدّث المخزون لكل InventoryItem
 */
export async function recordPurchase(
    input: PurchaseInput
): Promise<{ purchase: Purchase; items: PurchaseItem[] }> {
    if (input.items.length === 0) {
        throw new Error('Purchase must have at least one item');
    }

    // 1) احسب lineTotal و stockAddedSmall و totalAmount
    const purchaseItemsToCreate: Omit<PurchaseItem, 'id'>[] = [];
    let totalAmount = 0;

    for (const item of input.items) {
        const inventoryItem = await getInventoryItemById(item.inventoryItemId);
        if (!inventoryItem) {
            throw new Error(
                `Inventory item with id ${item.inventoryItemId} not found`
            );
        }

        // كمية المخزون المضافة بالوحدة الصغيرة (جرام/مللي)
        const stockAddedSmall =
            item.quantityBig * inventoryItem.convertRatio + item.quantitySmall;

        // سعر الوحدة الصغيرة (اختياري)
        const unitPricePerSmall =
            item.unitPricePerBig / inventoryItem.convertRatio;

        // إجمالي سطر الفاتورة (بنشتغل بالكبير فقط غالباً)
        const lineTotal = item.quantityBig * item.unitPricePerBig;

        totalAmount += lineTotal;

        purchaseItemsToCreate.push({
            purchaseId: 0, // هيتظبط بعد إنشاء Purchase
            inventoryItemId: item.inventoryItemId,
            quantityBig: item.quantityBig,
            quantitySmall: item.quantitySmall,
            stockAddedSmall,
            unitPricePerBig: item.unitPricePerBig,
            unitPricePerSmall: unitPricePerSmall,
            lineTotal,
        });
    }

    if (input.cashPaid > totalAmount) {
        throw new Error(
            `Cash paid (${input.cashPaid}) cannot be greater than total amount (${totalAmount})`
        );
    }

    const debtAmount = totalAmount - input.cashPaid;

    // 2) أنشئ Purchase في جدول purchases
    const purchaseToCreate: Omit<Purchase, 'id' | 'createdAt'> = {
        supplierId: input.supplierId ?? null,
        date: input.date,
        totalAmount,
        cashPaid: input.cashPaid,
        debtAmount,
    };

    const purchase = await createPurchase(purchaseToCreate);

    // 3) أنشئ PurchaseItems في جدول purchase_items
    const rowsToInsert: Omit<PurchaseItem, 'id'>[] = purchaseItemsToCreate.map(
        (pi) => ({
            ...pi,
            purchaseId: purchase.id,
        })
    );

    await createPurchaseItems(rowsToInsert);

    // 4) حدث المخزون لكل InventoryItem
    for (const pi of rowsToInsert) {
        const inventoryItem = await getInventoryItemById(pi.inventoryItemId);
        if (!inventoryItem) continue;

        const newStock =
            inventoryItem.currentStockSmall + pi.stockAddedSmall;

        await updateInventoryItemStock(inventoryItem.id, newStock);
    }

    // 5) رجّع الـ Purchase + PurchaseItems الحقيقية من الـ DB (لو محتاجهم في UI)
    const createdItems = await getPurchaseItemsByPurchaseId(purchase.id);

    return {
        purchase,
        items: createdItems,
    };
}
