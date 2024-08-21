import { Injectable } from '@angular/core';

@Injectable()
export class Products {
  getProductsData() {
    return [
      {
        id: 123,
        categoryId: 5,
        supplierId: 10,
        tagId: 7,
        name: 'Chocolate Barra',
        description: 'Chocolate ao leite com recheio de caramelo',
        weight: 0.150,
        manufacDate: new Date('2024-08-13'),
        dueDate: new Date('2025-02-13'),
        unitMeasurement: 'gramas',
        packingType: 'Plástico',
        batchNumber: 'CHOCO240813A',
        quantity: 100,
        price: 8.99
      },
      {
        id: 123,
        categoryId: 5,
        supplierId: 10,
        tagId: 7,
        name: 'Chocolate Barra 2',
        description: 'Chocolate ao leite com recheio de caramelo',
        weight: 0.150,
        manufacDate: new Date('2024-08-13'),
        dueDate: new Date('2025-02-13'),
        unitMeasurement: 'gramas',
        packingType: 'Plástico',
        batchNumber: 'CHOCO240813A',
        quantity: 100,
        price: 8.99
      }
    ];
  }

  getProductsMini() {
    return Promise.resolve(this.getProductsData().slice(0, 5));
  }

  getProductsSmall() {
    return Promise.resolve(this.getProductsData().slice(0, 10));
  }

  getProducts() {
    return Promise.resolve(this.getProductsData());
  }
};
