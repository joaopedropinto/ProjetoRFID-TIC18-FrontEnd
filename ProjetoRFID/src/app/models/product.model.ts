export interface Product {
    id?: number;
    idCategory: number;
    idSupplier: number;
    name: string;
    rfidTag?: string;
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
