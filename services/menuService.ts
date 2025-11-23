// services/menuService.ts

import type { InventoryItem } from '../models/inventory';
import type { MenuItem, MenuItemIngredient } from '../models/menu';

import {
    createMenuItem,
    getActiveMenuItems,
    getAllMenuItems,
    getIngredientsForMenuItem,
    getMenuItemById,
    setMenuItemIngredients,
    type IngredientInput,
} from '../db/repositories/menuRepository';

import {
    getInventoryItemById,
} from '../db/repositories/inventoryRepository';

/**
 * شكل الـ MenuItem مع الـ Ingredients بتاعته
 */
export interface MenuItemWithIngredients {
    menuItem: MenuItem;
    ingredients: MenuItemIngredient[];
}

/**
 * شكل الـ MenuItem مع الـ Ingredients + Cost/Profit
 */
export interface MenuItemWithCost extends MenuItemWithIngredients {
    costPerUnit: number | null;
    profitPerUnit: number | null;
    profitMarginPercent: number | null;
}

/**
 * Input لإنشاء MenuItem جديد مع الـ Recipe بتاعته في خطوة واحدة
 */
export interface CreateMenuItemServiceInput {
    name: string;
    category: string;
    sellPrice: number;
    isActive?: boolean;
    ingredients: IngredientInput[]; // { inventoryItemId, quantitySmallUsed }[]
}

/**
 * Input لتحديث MenuItem (مع إمكانية تغيير الـ Recipe)
 */
export interface UpdateMenuItemServiceInput {
    id: number;
    name?: string;
    category?: string;
    sellPrice?: number;
    isActive?: boolean;
    ingredients?: IngredientInput[]; // لو حابب تغيّر الـ Recipe بالكامل
}

/**
 * ✅ إنشاء مشروب جديد في المنيو مع الـ Recipe
 */
export async function createMenuItemWithIngredients(
    input: CreateMenuItemServiceInput
): Promise<MenuItemWithCost> {
    const { ingredients, ...menuData } = input;

    // 1) إنشاء الـ MenuItem نفسه
    const menuItem = await createMenuItem({
        name: menuData.name,
        category: menuData.category,
        sellPrice: menuData.sellPrice,
        isActive: menuData.isActive,
    });

    // 2) حفظ الـ Ingredients (Recipe)
    if (ingredients && ingredients.length > 0) {
        await setMenuItemIngredients(menuItem.id, ingredients);
    }

    // 3) استرجاع الـ Ingredients من الـ DB
    const fullIngredients = await getIngredientsForMenuItem(menuItem.id);

    // 4) حساب الـ cost (لو أمكن)
    const costInfo = await safeCalculateMenuItemCost(menuItem, fullIngredients);

    return {
        menuItem,
        ingredients: fullIngredients,
        ...costInfo,
    };
}

/**
 * ✅ تحديث مشروب في المنيو (وممكن نغيّر الريسيبي لو عايز)
 */
export async function updateMenuItemWithIngredients(
    input: UpdateMenuItemServiceInput
): Promise<MenuItemWithCost> {
    const existing = await getMenuItemById(input.id);
    if (!existing) {
        throw new Error(`Menu item with id ${input.id} not found`);
    }

    // 1) حدّث البيانات الأساسية للـ MenuItem
    await import('../db/repositories/menuRepository').then(
        async ({ updateMenuItem }) => {
            await updateMenuItem({
                id: input.id,
                name: input.name,
                category: input.category,
                sellPrice: input.sellPrice,
                isActive: input.isActive,
            });
        }
    );

    // 2) لو فيه ingredients مبعوتة → استبدل القديمة بالجديدة
    if (input.ingredients) {
        await setMenuItemIngredients(input.id, input.ingredients);
    }

    // 3) رجّع الـ MenuItem بعد التحديث
    const updated = await getMenuItemById(input.id);
    if (!updated) {
        throw new Error('Failed to reload menu item after update');
    }

    const ingredients = await getIngredientsForMenuItem(input.id);

    const costInfo = await safeCalculateMenuItemCost(updated, ingredients);

    return {
        menuItem: updated,
        ingredients,
        ...costInfo,
    };
}

/**
 * ✅ رجّع مشروب واحد بالـ Ingredients + Cost/Profit
 */
export async function getMenuItemDetails(
    id: number
): Promise<MenuItemWithCost | null> {
    const menuItem = await getMenuItemById(id);
    if (!menuItem) return null;

    const ingredients = await getIngredientsForMenuItem(id);
    const costInfo = await safeCalculateMenuItemCost(menuItem, ingredients);

    return {
        menuItem,
        ingredients,
        ...costInfo,
    };
}

/**
 * ✅ رجّع المنيو كلها (Active بس أو الكل) مع Cost/Profit
 */
export async function getMenuListWithCost(
    options: { onlyActive?: boolean } = {}
): Promise<MenuItemWithCost[]> {
    const rawItems = options.onlyActive
        ? await getActiveMenuItems()
        : await getAllMenuItems();

    const result: MenuItemWithCost[] = [];

    for (const item of rawItems) {
        const ingredients = await getIngredientsForMenuItem(item.id);
        const costInfo = await safeCalculateMenuItemCost(item, ingredients);

        result.push({
            menuItem: item,
            ingredients,
            ...costInfo,
        });
    }

    return result;
}

/**
 * ✅ حذف مشروب من المنيو (مع حذف الـ Recipe بتاعه)
 */
export async function deleteMenuItemWithIngredients(id: number): Promise<void> {
    await import('../db/repositories/menuRepository').then(
        async ({ deleteMenuItem }) => {
            await deleteMenuItem(id);
        }
    );
}

/* --------------------------------------------------
🧠 حساب تكلفة المشروب الواحد (Cost Per Unit)
   -------------------------------------------------- */

/**
 * يحسب تكلفة المشروب الواحد:
 * - يستخدم quantitySmallUsed لكل ingredient
 * - يعتمد على purchasePricePerSmallUnit من الـ inventory
 */
async function calculateMenuItemCostPerUnit(
    menuItem: MenuItem,
    ingredients: MenuItemIngredient[]
): Promise<number> {
    if (ingredients.length === 0) {
        // مفيش Recipe → مفيش تكلفة محسوبة
        return 0;
    }

    let totalCost = 0;

    for (const ing of ingredients) {
        const inventoryItem = await getInventoryItemById(ing.inventoryItemId);
        if (!inventoryItem) {
            // لو صنف مش موجود في الـ inventory → نعتبره صفر / أو نرمي Error
            continue;
        }

        const unitCostSmall = getUnitCostPerSmall(inventoryItem);
        if (unitCostSmall == null) {
            // لو مفيش بيانات تكلفة للصنف ده
            continue;
        }

        const ingredientCost = unitCostSmall * ing.quantitySmallUsed;
        totalCost += ingredientCost;
    }

    return totalCost;
}

/**
 * Helper: جيب تكلفة الوحدة الصغيرة (جرام/مللي) من InventoryItem
 */
function getUnitCostPerSmall(inventoryItem: InventoryItem): number | null {
    if (
        inventoryItem.purchasePricePerSmallUnit != null &&
        !Number.isNaN(inventoryItem.purchasePricePerSmallUnit)
    ) {
        return inventoryItem.purchasePricePerSmallUnit;
    }

    if (
        inventoryItem.convertRatio > 0 &&
        inventoryItem.purchasePricePerBigUnit != null
    ) {
        return inventoryItem.purchasePricePerBigUnit / inventoryItem.convertRatio;
    }

    return null;
}

/**
 * Helper آمن: يحسب Cost / Profit بدون ما يرمي Error لو فيه نقص بيانات
 */
async function safeCalculateMenuItemCost(
    menuItem: MenuItem,
    ingredients: MenuItemIngredient[]
): Promise<{
    costPerUnit: number | null;
    profitPerUnit: number | null;
    profitMarginPercent: number | null;
}> {
    try {
        const costPerUnit = await calculateMenuItemCostPerUnit(
            menuItem,
            ingredients
        );

        // لو مفيش Ingredients، خليه null بدل 0 (عشان مايبقاش مضلّل)
        const normalizedCost =
            ingredients.length === 0 ? null : Number(costPerUnit.toFixed(2));

        if (normalizedCost == null) {
            return {
                costPerUnit: null,
                profitPerUnit: null,
                profitMarginPercent: null,
            };
        }

        const profitPerUnit = Number(
            (menuItem.sellPrice - normalizedCost).toFixed(2)
        );
        const profitMarginPercent = Number(
            ((profitPerUnit / normalizedCost) * 100).toFixed(2)
        );

        return {
            costPerUnit: normalizedCost,
            profitPerUnit,
            profitMarginPercent,
        };
    } catch (e) {
        console.warn(
            `Failed to calculate cost for menu item "${menuItem.name}":`,
            e
        );
        return {
            costPerUnit: null,
            profitPerUnit: null,
            profitMarginPercent: null,
        };
    }
}
