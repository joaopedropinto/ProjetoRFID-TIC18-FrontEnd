import { Component, OnInit } from '@angular/core';
import { Product } from '../interfaces/Product';
import { Products } from '../services/Products.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-lista-produtos',
  standalone: true,
  imports: [TableModule, CommonModule],
  providers: [Products],
  templateUrl: './lista-produtos.component.html',
  styleUrl: './lista-produtos.component.css'
})
export class ListaProdutosComponent {
  products!: Product[];

  constructor(private productService: Products) { }

  ngOnInit() {
    this.productService.getProductsMini().then((data) => {
      this.products = data;
    });
  }
}
