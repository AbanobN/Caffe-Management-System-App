import type { Product } from "../models/product";

export const products: Product[] = [
    {
        id: 1,
        name: "Bondok Coffee Beans 1kg",
        bigUnitName: "Bag",
        smallUnitName: "Gram",
        bigUnitQuantity: 1,
        smallUnitQuantity: 1000,
        bigUnitPrice: 300,
        smallUnitPrice: 0.3,
        totalPrice: 300,
        totalQuantity: 1000,
    },
    {
        id: 2,
        name: "Sugar 1kg",
        bigUnitName: "Bag",
        smallUnitName: "Gram",
        bigUnitQuantity: 1,
        smallUnitQuantity: 1000,
        bigUnitPrice: 40,
        smallUnitPrice: 0.04,
        totalPrice: 40,
        totalQuantity: 1000,
    },
];
