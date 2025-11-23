// services/inventoryService.ts

import {
    createInventoryItem,
    deleteInventoryItem,
    getAllInventoryItems,
    getInventoryItemById,
    updateInventoryItemStock,
    type CreateInventoryItemInput,
} from '../db/repositories/inventoryRepository';
import type { InventoryItem } from '../models/inventory';

/**
 * Input مبسّط لإنشاء InventoryItem
 * مش محتاج تبعت purchasePricePerSmallUnit، هيتحسب أوتوماتيك.
 */
export interface CreateInventoryItemServiceInput {
    name: string;
    bigUnitName: string;      // "kg", "liter"
    smallUnitName: string;    // "g", "ml"
    convertRatio: number;     // 1 kg = 1000 g
    purchasePricePerBigUnit: number;
}

/**
 * ✅ إنشاء منتج مخزني جديد (سكر، بن، لبن...)
 * - يحسب سعر الوحدة الصغيرة (جرام/مللي) تلقائيًا
 * - يمرر الداتا للـ repository
 */
export async function createInventoryProduct(
    input: CreateInventoryItemServiceInput
): Promise<InventoryItem> {
    if (input.convertRatio <= 0) {
        throw new Error('convertRatio must be greater than zero');
    }

    const purchasePricePerSmallUnit =
        input.purchasePricePerBigUnit / input.convertRatio;

    const repoInput: CreateInventoryItemInput = {
        name: input.name,
        bigUnitName: input.bigUnitName,
        smallUnitName: input.smallUnitName,
        convertRatio: input.convertRatio,
        purchasePricePerBigUnit: input.purchasePricePerBigUnit,
        purchasePricePerSmallUnit,
    };

    const item = await createInventoryItem(repoInput);
    return item;
}

/**
 * ✅ رجّع كل المخزون (Inventory Items) بصورتهم الأصلية من الـ DB
 */
export async function getInventoryList(): Promise<InventoryItem[]> {
    const items = await getAllInventoryItems();
    return items;
}

/**
 * شكل عرض المخزون بشكل مقروء:
 * - stockBigUnit = كام كيلو/لتر كامل
 * - stockSmallRemainder = الباقي بالجرام/المللي
 */
export interface InventoryItemWithBreakdown extends InventoryItem {
    stockBigUnit: number;       // مثلاً 12 kg
    stockSmallRemainder: number; // مثلاً 350 g
}

/**
 * ✅ رجّع المخزون مع تحويل الكمية من جرام → (كيلو + باقي جرام)
 * ده مفيد جدًا في شاشة الـ UI بتاعة المخزون.
 */
export async function getInventoryWithBreakdown(): Promise<InventoryItemWithBreakdown[]> {
    const items = await getAllInventoryItems();

    return items.map((item) => {
        const stockBigUnit = Math.floor(
            item.currentStockSmall / item.convertRatio
        );
        const stockSmallRemainder =
            item.currentStockSmall % item.convertRatio;

        return {
            ...item,
            stockBigUnit,
            stockSmallRemainder,
        };
    });
}

/**
 * ✅ زيادة المخزون يدويًا (مثلاً تعديل يدوي)
 * deltaSmall بالوحدة الصغيرة (جرام/مللي)
 */
export async function incrementInventoryStock(
    itemId: number,
    deltaSmall: number
): Promise<InventoryItem> {
    if (deltaSmall <= 0) {
        throw new Error('deltaSmall must be positive in incrementInventoryStock');
    }

    const item = await getInventoryItemById(itemId);
    if (!item) {
        throw new Error(`Inventory item with id ${itemId} not found`);
    }

    const newStock = item.currentStockSmall + deltaSmall;
    await updateInventoryItemStock(itemId, newStock);

    const updated = await getInventoryItemById(itemId);
    if (!updated) {
        throw new Error('Failed to reload inventory item after stock update');
    }

    return updated;
}

/**
 * ✅ تقليل المخزون يدويًا (تصحيح جرد مثلاً)
 * - يتحقق إن المخزون الحالي يكفي
 */
export async function decrementInventoryStock(
    itemId: number,
    deltaSmall: number
): Promise<InventoryItem> {
    if (deltaSmall <= 0) {
        throw new Error('deltaSmall must be positive in decrementInventoryStock');
    }

    const item = await getInventoryItemById(itemId);
    if (!item) {
        throw new Error(`Inventory item with id ${itemId} not found`);
    }

    if (item.currentStockSmall < deltaSmall) {
        throw new Error(
            `Not enough stock for "${item.name}". Trying to remove ${deltaSmall} ${item.smallUnitName}, but only ${item.currentStockSmall} available.`
        );
    }

    const newStock = item.currentStockSmall - deltaSmall;
    await updateInventoryItemStock(itemId, newStock);

    const updated = await getInventoryItemById(itemId);
    if (!updated) {
        throw new Error('Failed to reload inventory item after stock update');
    }

    return updated;
}

/**
 * ✅ Helper لو حابب تجيب Item واحد مع Breakdown للعرض في تفاصيل منتج
 */
export async function getInventoryItemWithBreakdown(
    id: number
): Promise<InventoryItemWithBreakdown | null> {
    const item = await getInventoryItemById(id);
    if (!item) return null;

    const stockBigUnit = Math.floor(
        item.currentStockSmall / item.convertRatio
    );
    const stockSmallRemainder =
        item.currentStockSmall % item.convertRatio;

    return {
        ...item,
        stockBigUnit,
        stockSmallRemainder,
    };
}

/**
 * ✅ حذف صنف مخزني بالكامل
 */
export async function deleteInventoryProduct(id: number): Promise<void> {
    await deleteInventoryItem(id);
}