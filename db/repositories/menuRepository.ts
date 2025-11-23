// db/repositories/menuRepository.ts
import type { MenuItem, MenuItemIngredient } from '../../models/menu';
import { queryAll, queryFirst, run } from '../sqliteHelpers';

// محوّل من صف SQL -> MenuItem
function rowToMenuItem(row: any): MenuItem {
    return {
        id: row.id,
        name: row.name,
        category: row.category,
        sellPrice: row.sellPrice,
        isActive: row.isActive === 1, // في DB مخزنة 0/1
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    };
}

// محوّل من صف SQL -> MenuItemIngredient
function rowToMenuItemIngredient(row: any): MenuItemIngredient {
    return {
        id: row.id,
        menuItemId: row.menuItemId,
        inventoryItemId: row.inventoryItemId,
        quantitySmallUsed: row.quantitySmallUsed,
    };
}

/**
 * ✅ رجّع كل الـ MenuItems
 */
export async function getAllMenuItems(): Promise<MenuItem[]> {
    const rows = await queryAll(
        'SELECT * FROM menu_items ORDER BY category ASC, name ASC'
    );
    return rows.map(rowToMenuItem);
}

/**
 * ✅ رجّع الـ MenuItems الـ active بس (لو حابب تستخدمها في المنيو)
 */
export async function getActiveMenuItems(): Promise<MenuItem[]> {
    const rows = await queryAll(
        'SELECT * FROM menu_items WHERE isActive = 1 ORDER BY category ASC, name ASC'
    );
    return rows.map(rowToMenuItem);
}

/**
 * ✅ رجّع مشروب واحد بالـ id
 */
export async function getMenuItemById(
    id: number
): Promise<MenuItem | null> {
    const row = await queryFirst('SELECT * FROM menu_items WHERE id = ?', [id]);
    return row ? rowToMenuItem(row) : null;
}

/**
 * ✅ إنشاء MenuItem جديد
 */

export interface CreateMenuItemInput {
    name: string;
    category: string;
    sellPrice: number;
    isActive?: boolean;
}

export async function createMenuItem(
    input: CreateMenuItemInput
): Promise<MenuItem> {
    const now = new Date().toISOString();

    const result = await run(
        `
    INSERT INTO menu_items
    (name, category, sellPrice, isActive, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
        [
            input.name,
            input.category,
            input.sellPrice,
            input.isActive === false ? 0 : 1, // default = active
            now,
            now,
        ]
    );

    const id = result.lastInsertRowId;
    const row = await queryFirst('SELECT * FROM menu_items WHERE id = ?', [id]);
    if (!row) throw new Error('Failed to load created menu item');
    return rowToMenuItem(row);
}

/**
 * ✅ تحديث بيانات مشروب (من غير الـ ingredients)
 */
export interface UpdateMenuItemInput {
    id: number;
    name?: string;
    category?: string;
    sellPrice?: number;
    isActive?: boolean;
}

export async function updateMenuItem(
    input: UpdateMenuItemInput
): Promise<void> {
    const existing = await getMenuItemById(input.id);
    if (!existing) {
        throw new Error(`Menu item with id ${input.id} not found`);
    }

    const updated: MenuItem = {
        ...existing,
        name: input.name ?? existing.name,
        category: input.category ?? existing.category,
        sellPrice: input.sellPrice ?? existing.sellPrice,
        isActive: input.isActive ?? existing.isActive,
        updatedAt: new Date().toISOString(),
    };

    await run(
        `
    UPDATE menu_items
    SET
    name = ?,
    category = ?,
    sellPrice = ?,
    isActive = ?,
    updatedAt = ?
    WHERE id = ?
    `,
        [
            updated.name,
            updated.category,
            updated.sellPrice,
            updated.isActive ? 1 : 0,
            updated.updatedAt,
            updated.id,
        ]
    );
}

/**
 * ✅ حذف مشروب من المنيو
 * خلي بالك لو فيه sale_items أو ingredients مرتبطة بيه
 */
export async function deleteMenuItem(id: number): Promise<void> {
    // الأول امسح ingredients المرتبطة بيه
    await run(
        `
    DELETE FROM menu_item_ingredients
    WHERE menuItemId = ?
    `,
        [id]
    );

    // بعدين امسح الـ menu item نفسه
    await run(
        `
    DELETE FROM menu_items
    WHERE id = ?
    `,
        [id]
    );
}

/**
 * ✅ رجّع كل الـ Ingredients لمشروب معيّن
 */
export async function getIngredientsForMenuItem(
    menuItemId: number
): Promise<MenuItemIngredient[]> {
    const rows = await queryAll(
        `
    SELECT * FROM menu_item_ingredients
    WHERE menuItemId = ?
    `,
        [menuItemId]
    );
    return rows.map(rowToMenuItemIngredient);
}

/**
 * ✅ Set / Replace ingredients لمشروب
 * (إمسح القديم، وحط الجديد)
 */
export interface IngredientInput {
    inventoryItemId: number;
    quantitySmallUsed: number; // per 1 unit of menu item
}

export async function setMenuItemIngredients(
    menuItemId: number,
    ingredients: IngredientInput[]
): Promise<void> {
    // امسح كل الـ ingredients القديمة
    await run(
        `
    DELETE FROM menu_item_ingredients
    WHERE menuItemId = ?
    `,
        [menuItemId]
    );

    // ادخل الجديد
    for (const ing of ingredients) {
        await run(
            `INSERT INTO menu_item_ingredients
            (menuItemId, inventoryItemId, quantitySmallUsed)
            VALUES (?, ?, ?)`,
            [menuItemId, ing.inventoryItemId, ing.quantitySmallUsed]
        );
    }
}
