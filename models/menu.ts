export interface MenuItem {
    id: number;
    name: string;   
    category: string;  
    sellPrice: number; 
    isActive: boolean;

    createdAt: string;
    updatedAt: string;
}

export interface MenuItemIngredient {
    id: number;
    menuItemId: number;
    inventoryItemId: number;

    // quantity consumed from inventory per ONE unit of menu item
    quantitySmallUsed: number; 
}
