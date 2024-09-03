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
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';

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
    DialogModule,
    MessagesModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './products-read.component.html',
  styleUrls: ['./products-read.component.css']
})
export class ProductsReadComponent implements OnInit {
  messages: Message[] = [];
  NonProductTags: string[] = [];
  History: String[] = [];
  visibleDialog: boolean = false;
  FormatedManufacDate: string = '';
  FormatedDueDate: string = '';
  isModalOpen = false;
  products: Product[] = [];
  selectedProduct: Product | null = null;
  actions!: MenuItem[];
  mostrar: boolean = true;

  constructor(private productsService: ReadProductsService, private router: Router) { }

  ngOnInit(): void {
    this.productsService.getProductsByTagRfids().subscribe(response => {
      this.products = response.products;
      console.log(this.products);
    });
  }
  
  viewProduct(product: Product) {
    console.log("viewProduct Processes");
    this.selectedProduct = product;
    console.log(this.selectedProduct); // verificando se o produto foi selecionado
    if (this.selectedProduct) {
      this.FormatedManufacDate = this.selectedProduct.manufacDate.toString();
      this.FormatedDueDate = this.selectedProduct.dueDate.toString();
    }
    console.log(this.FormatedManufacDate); // verificando se a data de fabricação foi selecionada e formatada
    console.log(this.FormatedDueDate); // verificando se a data de validade foi selecionada e formatada
    this.visibleDialog = true; // Abre o modal
  }
  async saveHistory() {
    
    this.History = [];
    this.NonProductTags = [];
    
    const promises = this.products.map(async product => {
      let verify = await this.productsService.getProductsByTag(product.rfidTag!);
      if (verify === '200') {
        this.History.push(product.rfidTag!);
      } else {
        this.NonProductTags.push(product.rfidTag!);
      }
    });
      
    await Promise.all(promises);
  
    console.log("Tags com itens: ", this.History);
    console.log("Tags sem itens: ", this.NonProductTags);
    console.log(this.NonProductTags.length);
      
    if (this.NonProductTags.length !== 0) {
      this.Message();  
    }
      
    if (this.NonProductTags.length === 0 && this.History.length > 0) {
      this.enviarReadout(this.History);
    }
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
      // Obtém a URL atual
    const currentUrl = this.router.url;
    // Navega para a rota 'refresh' (navega para a mesma rota e então recarrega)
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
        console.log("Página Recarregada");
      });
    }, delay);
  }
  enviarReadout(tag_list: String[]) {
    const readoutDate = new Date().toISOString(); // Data atual formatada como ISO string
    const tags = tag_list; // Substitua pelas tags reais
    this.productsService.postReadout(readoutDate, tags)
      .subscribe({
        next: (response) => {
          console.log('Sucesso:', response);
        },
        error: (error) => {
          console.error('Erro:', error);
        }
      });
  }
  Message() {
    if (this.NonProductTags.length > 0) {
      const tagsNaoEncontradas = this.NonProductTags.join(', '); 
      this.messages = [
        { 
          severity: 'error', 
          detail: `Não foi possível salvar a leitura. As seguintes tags apresentam produtos não cadastrados: ${tagsNaoEncontradas}`
        }
      ];
    } else {
      this.messages = [
        { 
          severity: 'error', 
          detail: `Não foi possível salvar a leitura. Alguma tag apresenta um produto não cadastrado.`
        }
      ];
  
  
}}}
