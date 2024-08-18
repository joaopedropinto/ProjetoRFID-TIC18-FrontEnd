import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Products } from '../../services/read-service/Products.service';
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
import { ModalDetailingComponent } from '../../shared/modal-detailing/modal-detailing.component';
import { CommonModule } from '@angular/common';
import { elementAt } from 'rxjs';
@Component({
  selector: 'app-products-read',
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
    ModalDetailingComponent,
    CommonModule
  ],
  providers: [ConfirmationService, MessageService, Products],
  templateUrl: './products-read.component.html',
  styleUrl: './products-read.component.css'
})
export class ProductsReadComponent implements OnInit {
  
  isModalOpen = false;
  products!: Product[];
  selectedProduct: any = [];
  actions!: MenuItem[];
  mostrar: boolean = true;
  constructor(
    private Products: Products,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }
  
  ngOnInit(): void {
    // this.productService.getProducts().subscribe(response => {
    //   this.products = response;
    // });
    
    this.Products.getProducts().then((data) => {
      console.log(data);
      
      this.products = data;
  });
  
  }
  viewProduct(product: any) {
    console.log("uma func");
    this.selectedProduct = product;
    console.log(this.selectedProduct)
    this.isModalOpen = true;  // Abre o modal
  }

  closeModal() {
    this.isModalOpen = false;  // Fecha o modal
    this.selectedProduct = null;
  }
}
