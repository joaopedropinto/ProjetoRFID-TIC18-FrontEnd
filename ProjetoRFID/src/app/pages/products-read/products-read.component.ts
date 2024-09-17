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
import { Category } from '../../models/category.model';
import { Supplier } from '../../models/supplier.model';
import { CategoryService } from '../../services/category/category.service';
import { SupplierService } from '../../services/supplier/supplier.service';
import { Packaging } from '../../models/packaging.model';
import { PackagingService } from '../../services/packaging/packaging.service';

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
  History: string[] = []; // Alterado de String[] para string[]
  visibleDialog: boolean = false;
  FormatedManufacDate: string = '';
  FormatedDueDate: string = '';
  isModalOpen = false;
  products!: Product[];
  selectedProduct: Product | null = null;
  actions!: MenuItem[];
  mostrar: boolean = true;
  loading: boolean = false;

  selectedProductCategory!: Category;
  selectedProductSupplier!: Supplier;
  selectedProductDueDate!: string;
  selectedProductPackaging!: Packaging;
  selectedProductManuFacDate!: string;

  constructor(
    private productsService: ReadProductsService,
    private router: Router,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private packagingService: PackagingService
  ) { }

  ngOnInit(): void {
    this.productsService.getProductsByTagRfids().subscribe(response => {
      this.products = response.products;
      console.log(this.products);
      
    });
  }
  
  viewProduct(product: Product) {
    this.selectedProduct = product;
  
    console.log(this.selectedProduct);
    
    this.categoryService.getCategoryById(this.selectedProduct.idCategory).subscribe(response => {
      this.selectedProductCategory = response;
    });

    this.supplierService.getSupplierById(this.selectedProduct.idSupplier).subscribe(response => {
      this.selectedProductSupplier = response;
    });
    
    this.packagingService.getPackagingById(this.selectedProduct.idPackaging).subscribe(response => {
      this.selectedProductPackaging = response; 
    });


    this.selectedProductDueDate = new Date(this.selectedProduct.dueDate).toLocaleDateString('pt-BR');
    this.selectedProductManuFacDate = new Date(this.selectedProduct.manufacDate).toLocaleDateString('pt-BR');
    
    // if (this.selectedProduct) {
    //   this.FormatedManufacDate = this.selectedProduct.manufacDate.toString();
    //   this.FormatedDueDate = this.selectedProduct.dueDate.toString();
    // }
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
  }
  
  globalFilter(table: any, event: Event) {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }
  
  recarregarPagina() {
    this.loading = true; // Ativa a animação de carregamento
  
    // Define o delay em milissegundos (2000 ms = 2 segundos)
    const delay = 500;
    // Adiciona um delay antes de recarregar a rota
    setTimeout(() => {
      // Obtém a URL atual
      const currentUrl = this.router.url;
      // Navega para a rota 'refresh' (navega para a mesma rota e então recarrega)
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
        console.log("Página Recarregada");
        this.loading = false; // Desativa a animação de carregamento
      });
    }, delay);
  }
  
  enviarReadout(tag_list: string[]) {  // Use string[] em vez de String[]
    const readoutDate = new Date().toISOString(); // Data atual formatada como ISO string
    const tags = tag_list; // tags já é do tipo string[]
    this.productsService.postReadout(readoutDate, tags)
      .subscribe({
        next: (response) => {
          console.log('Sucesso:', response);
          this.ToastMessages();
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
    }
  }

  ToastMessages() {
    this.messages = [
      { 
        severity: 'success', 
        detail: `Leitura salva com sucesso no histórico.`
      }
    ];
  }

}

