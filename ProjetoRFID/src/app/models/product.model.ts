export interface Product {
    id?: number;
    idCategory?: number;
    idSupplier?: number;
    idTag?: number;
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
