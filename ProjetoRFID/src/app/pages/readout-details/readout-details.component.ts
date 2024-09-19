import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product/product.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { CategoryService } from '../../services/category/category.service';
import { SupplierService } from '../../services/supplier/supplier.service';
import { Category } from '../../models/category.model';
import { Supplier } from '../../models/supplier.model';
import { Readout } from '../../models/readout.model';
import { ReadingService } from '../../services/reading/reading.service';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TooltipModule } from 'primeng/tooltip';
import { PackagingService } from '../../services/packaging/packaging.service';

@Component({
  selector: 'app-readout-details',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
    DialogModule,
    RouterLink,
    RippleModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    TooltipModule
  ],
  templateUrl: './readout-details.component.html',
  styleUrl: './readout-details.component.css'
})
export class ReadoutDetailsComponent implements OnInit {

  readoutId!: string;
  readout!: Readout;
  products: Product[] = [];
  selectedProduct!: Product;
  selectedProductCategory!: Category;
  selectedProductSupplier!: Supplier;
  selectedProductManuFacDate!: string;
  selectedProductDueDate!: string;
  visibleDialog: boolean = false;

  constructor(
    private productsService: ProductService,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private readingService: ReadingService,
    private packagingService: PackagingService
  ) { }

  ngOnInit(): void {
    this.readoutId = this.route.snapshot.paramMap.get('id')!;

    if(this.readoutId != null) {
      this.readingService.getReadoutById(this.readoutId).subscribe(response => {
        this.readout = response;
        for(let tag of this.readout.tags) {
          this.productsService.getProductByRfid(tag).subscribe(product => {
            this.products.push(product);

            this.packagingService.getPackagingById(product.idPackaging).subscribe(packaging => {
              product.packingType = packaging.name;
            });
          });
        }
      });
    }
  }

  setSelectedProduct(product: Product): void {
    this.selectedProduct = product;

    this.categoryService.getCategoryById(this.selectedProduct.idCategory).subscribe(category => {
      this.selectedProductCategory = category;
    });

    this.supplierService.getSupplierById(this.selectedProduct.idSupplier).subscribe(supplier => {
      this.selectedProductSupplier = supplier;
    });

    this.selectedProductDueDate = new Date(this.selectedProduct.dueDate).toLocaleDateString('pt-BR');
    this.selectedProductManuFacDate = new Date(this.selectedProduct.manufacDate).toLocaleDateString('pt-BR');
  }

  openModal(): void {
    this.visibleDialog = true;
  }

  closeModal(): void {
    this.visibleDialog = false;
  }

  globalFilter(table: any, event: Event) {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }
}
