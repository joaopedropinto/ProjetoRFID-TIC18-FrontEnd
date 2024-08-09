export interface Product {
    id: number;
    categoryId: number;
    supplierId: number;
    tagId: number;
    name: string;
    description?: string;
    weight: number;
    manufacDate: Date;
    dueDate: Date;
    unitMeasurement?: string;
    packingType?: string;
    batchNumber?: string;
    quantity: number;
    price: number;
}
