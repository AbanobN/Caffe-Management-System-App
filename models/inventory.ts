export interface InventoryItem {
    id: number;
    name: string;

    bigUnitName: string; 
    smallUnitName: string;
    convertRatio: number; 

    // stock is always stored in the smallest unit
    currentStockSmall: number; 

    purchasePricePerBigUnit: number; 
    purchasePricePerSmallUnit?: number; // optional: cost per gram (derived)

    createdAt: string;
    updatedAt: string;
}

export interface Purchase {
    id: number;
    supplierId?: number | null;
    date: string; 
    totalAmount: number;
    cashPaid: number;   
    debtAmount: number; 
    createdAt: string;
}

export interface PurchaseItem {
    id: number;
    purchaseId: number;
    inventoryItemId: number;

    quantityBig: number;   
    quantitySmall: number; // 0 g (لو اشترى جرامات مباشرة)
    stockAddedSmall: number;  // 10 * 1000 = 10,000 g

    unitPricePerBig: number;  // سعر الكيلو في الفاتورة دي
    unitPricePerSmall?: number; // ممكن تحسبها تلقائيًا 

    lineTotal: number; // اجمالي سطر الفاتورة (quantity * price)      
}
