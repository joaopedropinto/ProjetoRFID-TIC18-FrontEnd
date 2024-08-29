export interface Product {
    id?: string;
    idCategory: string;
    idSupplier: string;
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
