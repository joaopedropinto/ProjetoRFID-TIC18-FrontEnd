import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ReadProductsService } from '../../services/read-service/read-products.service';
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
import { Product } from '../../models/product.model';
import { Dialog, DialogModule } from 'primeng/dialog';
import { Route, Router } from '@angular/router';
import { routes } from '../../app.routes';

interface ProductResponse {
  products: any[];
  notFoundResponses: any[];
}
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
    CommonModule,
    DialogModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './products-read.component.html',
  styleUrl: './products-read.component.css'
})
export class ProductsReadComponent implements OnInit {
  
  visibleDialog: boolean = false;
  FormatedManufacDate: any;
  FormatedDueDate: any;
  isModalOpen = false;
  products!: any[];
  selectedProduct: any = [];
  actions!: MenuItem[];
  mostrar: boolean = true;
  constructor(private Products: ReadProductsService, private router: Router) { }

  ngOnInit(): void {
    this.Products.getProductsByTagRfids().subscribe((response: ProductResponse) => {
      this.products = response.products;
      console.log(this.products);
    });
    console.log(this.products);
  }
  formatDate(dateString: String): string {
    // Regex para extrair o dia, mês e ano da string
    const regex = /(\w{3}) (\w{3}) (\d{2}) (\d{4})/;
    const match = dateString.match(regex);

    if (!match) {
      throw new Error("Formato de data inválido");
    }
    const day = match[3];
    const month = match[2];
    const year = match[4]; // Pega apenas os últimos 2 dígitos do ano

    // Converte o nome do mês para o número correspondente
    const monthMap: { [key: string]: string } = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12"
    };
    let formattedDate: string = `${day}/${monthMap[month]}/${year}`;
    return formattedDate;
  }
  viewProduct(product: any) {
    console.log("viewProduct Processes");
    this.selectedProduct = product;
    console.log(this.selectedProduct) // verificando se o produto foi selecionado
    this.FormatedManufacDate = this.formatDate(this.selectedProduct.manufacDate.toDateString());
    this.FormatedDueDate = this.formatDate(this.selectedProduct.dueDate.toDateString());
    console.log(this.FormatedManufacDate) // verificando se a  a data de fabricação foi selecionada e formatada
    console.log(this.FormatedDueDate) // verificando se a  a data de validade foi selecionada e formatada
    this.visibleDialog = true; // Abre o modal
  }

  closeModal() {
    this.visibleDialog = false; // Fecha o modal
    this.selectedProduct = null;
  }
  
  globalFilter(table: any, event: Event) {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }
  
  recarregarPagina() {
    // Define o delay em milissegundos (2000 ms = 2 segundos)
    const delay = 500;
    // Adiciona um delay antes de recarregar a rota
    setTimeout(() => {
      const currentUrl = this.router.url;
      this.router.navigate([currentUrl]).then(() => {
        console.log("Página Recarregada");
      });
    }, delay);
  }
}
