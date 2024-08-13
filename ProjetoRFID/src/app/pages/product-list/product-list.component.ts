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

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
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
  
  constructor(
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }
  
  ngOnInit(): void {
    // this.productService.getProducts().subscribe(response => {
    //   this.products = response;
    // });

    const product: Product = {
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
    };
    

    this.products = [product];

    this.actions = [
      { 
        label: 'Visualizar', 
        icon: 'pi pi-info-circle',
        command: (event) => this.viewProduct(product) 
      },
      { 
        label: 'Editar', 
        icon: 'pi pi-pen-to-square', 
        command: (event) => this.editProduct(product) 
      },
      { 
        label: 'Excluir', 
        icon: 'pi pi-trash',
        command: (event) => this.deleteProduct(product) 
      }
    ];
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
