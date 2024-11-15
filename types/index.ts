import { ProductType } from '@/constants';

export interface UsageRecord {
    id: string;
    productType: ProductType;
    insertedAt: number; // timestamp
    removedAt?: number; // timestamp
}

export interface ActiveProduct {
    productType: ProductType;
    insertedAt: number;
    shouldRemoveAt: number;
}
