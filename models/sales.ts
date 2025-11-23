export interface Sale {
    id: number;
    date: string; // ISO
    totalAmount: number;
    paidAmount: number;
    debtorId?: number | null;
}

export interface SaleItem {
    id: number;
    saleId: number;
    menuItemId: number;
    quantity: number;       
    unitPrice: number;      
    lineTotal: number;      
}
