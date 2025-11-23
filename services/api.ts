// services/api.ts
import { products } from "../db/products";
import { shifts } from "../db/shifts";
import { suppliers } from "../db/suppliers";
import type { Product } from "../models/product";
import type { Shift } from "../models/shift";
import type { Supplier } from "../models/supplier";

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Products
export async function getProducts(): Promise<Product[]> {
    await delay(200);
    return products;
}

export async function getProductById(id: number): Promise<Product | undefined> {
    await delay(200);
    return products.find((p) => p.id === id);
}

// Suppliers
export async function getSuppliers(): Promise<Supplier[]> {
    await delay(200);
    return suppliers;
}

// Shifts
export async function getShifts(): Promise<Shift[]> {
    await delay(200);
    return shifts;
}

let shiftIdCounter = shifts.length + 1;

export async function createShift(data: {
    workerName: string;
    cash: number;
}): Promise<Shift> {
    await delay(200);
    const newShift: Shift = {
        id: shiftIdCounter++,
        workerName: data.workerName,
        startTime: new Date().toISOString(),
        cash: data.cash,
    };
    shifts.push(newShift);
    return newShift;
}
