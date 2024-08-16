import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/product.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

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
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products!: Product[];

  actions!: MenuItem[];

  selectedProduct!: Product;
  
  constructor(
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }
  
  ngOnInit(): void {
    this.productService.getProducts().subscribe(response => {
      this.products = response;
      console.log(this.products);
    });

    this.actions = [
      { 
        label: 'Visualizar', 
        icon: 'pi pi-info-circle',
      },
      { 
        label: 'Editar', 
        icon: 'pi pi-pen-to-square',
      },
      { 
        label: 'Excluir', 
        icon: 'pi pi-trash',
      }
    ];
  }

  setSelectedProduct(product: Product): void {
    this.selectedProduct = product;
    const editAction = this.actions.find(action => action.label === 'Editar');

    if (editAction && this.selectedProduct) {
        editAction.routerLink = `/produto/editar/${product.id}`;
    }
  }

  deletionConfirmation(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Tem certeza que deseja excluir esse produto?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon:"none",
        rejectIcon:"none",
        rejectButtonStyleClass:"p-button-text",
        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
}

  viewProduct(product: Product) {
    
  }

  editProduct(product: Product) {
    
  }

  deleteProduct(product: Product) {
    
  }

}
