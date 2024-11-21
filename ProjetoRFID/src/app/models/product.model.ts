import { Category } from "./category.model";

export interface Product {
    id?: string;
    idCategory: string;
    idSupplier: string;
    idPackaging: string;
    name: string;
    rfidTag?: string;
    description?: string;
    category?: Category;
    weight: number;
    manufacDate: Date;
    dueDate: Date;
    unitMeasurement?: string;
    packingType?: string;
    batchNumber?: string;
    quantity: number;
    price: number;
    height: number;
    width: number;
    length: number;
    volume: number;
    imageBase64?: string;
    imageUrl?: string;
    imageObjectName?: string;
    IsDeleted?: boolean;

}
