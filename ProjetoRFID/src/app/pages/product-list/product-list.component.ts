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
import { RippleModule } from 'primeng/ripple';

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
    RippleModule
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
        command: () => this.deletionConfirmation(this.selectedProduct)
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

  viewProduct(product: Product) {
    
  }

  deleteProduct(product: Product) {
    // this.productService.deleteProduct(product).subscribe(() => {
    //   this.products = this.products.filter(p => p.id!== product.id);
    // })
    this.messageService.add({severity:'secondary', summary: 'Sucesso', detail: `${product.name} excluído com sucesso!`});
  }

}
