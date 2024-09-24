import { Component, OnInit, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Table, TableModule } from 'primeng/table';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/product.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem, SortEvent } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { CategoryService } from '../../services/category/category.service';
import { SupplierService } from '../../services/supplier/supplier.service';
import { Category } from '../../models/category.model';
import { Supplier } from '../../models/supplier.model';
import { PackagingService } from '../../services/packaging/packaging.service';
import { Packaging } from '../../models/packaging.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ButtonModule,
    TooltipModule,
    TieredMenuModule,
    ConfirmDialogModule,
    ToastModule,
    RippleModule,
    DialogModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products!: Product[];
  @ViewChild('table') table!: Table;
  initialValue!: Product[];
  isSorted: boolean | null = null;

  actions!: MenuItem[];

  selectedProduct!: Product;
  selectedProductCategory!: Category;
  selectedProductSupplier!: Supplier;
  selectedProductDueDate!: string;
  selectedProductManuFacDate!: string;
  selectedProductPackaging!: Packaging;

  loading: boolean = true;

  visibleDialog: boolean = false;
  
  constructor(
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private packagingService: PackagingService
  ) { }
  
  ngOnInit(): void {
    this.productService.returnAllActiveProducts().subscribe(response => {
      this.products = response;
      this.loading = false;
      this.initialValue = [...this.products];
    });
    
    this.actions = [
      { 
        label: 'Visualizar', 
        icon: 'pi pi-info-circle',
        command: () => this.viewProduct()
      },
      { 
        label: 'Editar', 
        icon: 'pi pi-pen-to-square',
      },
      { 
        label: 'Excluir', 
        icon: 'pi pi-trash',
        command: () => this.deletionConfirmation(this.selectedProduct)
      }
    ];
    
  }

  setSelectedProduct(product: Product): void {
    this.selectedProduct = product;
    
    this.categoryService.getCategoryById(this.selectedProduct.idCategory).subscribe(category => {
      this.selectedProductCategory = category;
    });

    this.supplierService.getSupplierById(this.selectedProduct.idSupplier).subscribe(supplier => {
      this.selectedProductSupplier = supplier;
    });
    this.packagingService.getPackagingById(this.selectedProduct.idPackaging).subscribe(packaging => {
      this.selectedProductPackaging = packaging;
    });
    

    this.selectedProductDueDate = new Date(this.selectedProduct.dueDate).toLocaleDateString('pt-BR');
    this.selectedProductManuFacDate = new Date(this.selectedProduct.manufacDate).toLocaleDateString('pt-BR');

    const editAction = this.actions.find(action => action.label === 'Editar');

    if (editAction && this.selectedProduct) {
        editAction.routerLink = `/produto/editar/${product.id}`;
    }
    
  }

  deletionConfirmation(product: Product) {
    this.confirmationService.confirm({
        message: `Tem certeza que deseja excluir ${product.name}?`,
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        acceptIcon:"none",
        rejectIcon:"none",
        acceptButtonStyleClass:"p-button-danger p-button-text",
        accept: () => {
            this.deleteProduct(this.selectedProduct);
        },
    });
}

  viewProduct() {
    this.visibleDialog = true;
  }

  closeModal() {
    this.visibleDialog = false;
  }

  deleteProduct(product: Product) {
     this.productService.deleteProduct(product).subscribe(() => {
       this.products = this.products.filter(p => p.id!== product.id);
     })
    this.messageService.add({severity:'secondary', summary: 'Sucesso', detail: `${product.name} excluído com sucesso!`});
  }

  globalFilter(table: any, event: Event) {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }

  customSort(event: SortEvent) {
    if (this.isSorted == null || this.isSorted === undefined) {
        this.isSorted = true;
        this.sortTableData(event);
    } else if (this.isSorted == true) {
        this.isSorted = false;
        this.sortTableData(event);
    } else if (this.isSorted == false) {
        this.isSorted = null;
        this.products = [...this.initialValue];
        this.table.reset();
    }
  }

  sortTableData(event: SortEvent) {
    event.data?.sort((data1, data2) => {
      const field = event.field as string;
        let value1 = data1[field];
        let value2 = data2[field];
        let result = null;
        if (value1 == null && value2 != null) result = -1;
        else if (value1 != null && value2 == null) result = 1;
        else if (value1 == null && value2 == null) result = 0;
        else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
        else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

        return event.order! * result;
    });
  }

}
