import { Component, OnInit, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Table, TableModule } from 'primeng/table';
import { ReadProductsService } from '../../services/read-service/read-products.service';
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
  visibleImageDialog: boolean = false;
  selectedImageUrl: string | null = null;
  FormatedManufacDate: string = '';
  FormatedDueDate: string = '';
  isModalOpen = false;
  products!: Product[];
  @ViewChild('table') table!: Table;
  initialValue!: Product[];
  selectedProduct: Product | null = null;
  actions!: MenuItem[];
  mostrar: boolean = true;
  loading: boolean = false;
  orderedColumn: string | null = null;
  isSorted: boolean | null = null;

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

      for(let product of this.products) {
        this.packagingService.getPackagingById(product.idPackaging).subscribe(packaging => {
          product.packingType = packaging.name;
        });
      }

      this.initialValue = [...this.products];
    });

  }
  
  viewProduct(product: Product) {
    this.selectedProduct = product;
  
    this.categoryService.getCategoryById(this.selectedProduct.idCategory).subscribe(response => {
      this.selectedProductCategory = response;
    });

    this.supplierService.getSupplierById(this.selectedProduct.idSupplier).subscribe(response => {
      this.selectedProductSupplier = response;
    });
    
    this.packagingService.getPackagingById(this.selectedProduct.idPackaging).subscribe(response => {
      this.selectedProductPackaging = response; 
    });
    
    if (this.selectedProduct) {
      this.productsService.getImageUrl(this.selectedProduct.imageObjectName!).subscribe(url => {
        this.selectedProduct!.imageUrl = url || 'default-image-url';
        console.log(this.selectedProduct!.imageUrl);
      });
    }
    
    


    this.selectedProductDueDate = new Date(this.selectedProduct.dueDate).toLocaleDateString('pt-BR');
    this.selectedProductManuFacDate = new Date(this.selectedProduct.manufacDate).toLocaleDateString('pt-BR');

    this.visibleDialog = true;
  }
  async saveHistory() {
    this.History = [];
    this.NonProductTags = [];
  
    let verify = await this.productsService.getProductsByTag();
  
    if ('error' in verify) {
      console.log(verify.error);  // Lida com o erro, se houver
    } else {
      
      // Atribui os valores para as listas
      this.History = verify.products?.map(item => item.rfidTag) || [];
      this.NonProductTags = verify.notFoundResponses?.map(item => item.rfidTag) || [];
    }
    /*Permite ou não o salvamento do historico juntamente com a menssagem do porque não,
    sobe a condição de todas as tag possuirem produtos cadastrados*/
    if (this.NonProductTags.length !== 0) {
      this.Message();
    }
    if (this.NonProductTags.length === 0 && this.History.length > 0) {
      this.enviarReadout(this.History);
    }
  }
  
  closeModal() {
    this.visibleDialog = false;
  }
  
  globalFilter(table: any, event: Event) {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }
   // Fechar o modal de detalhes
   openImageModal(productId: string): void {
    this.productsService.getImageUrl(productId).subscribe(
      (url: string) => {
        this.selectedImageUrl = url;  // Define a URL da imagem
        this.visibleImageDialog = true; // Abre o modal
      },
      
    );
  }
  
  
  closeImageModal(): void {
    this.visibleImageDialog = false;  // Fecha o modal
         // Limpa a URL da imagem
  }
  
  recarregarPagina() {
    this.loading = true;
  
    const delay = 500;
    setTimeout(() => {
      const currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
        this.loading = false;
      });
    }, delay);
  }
  
  enviarReadout(tag_list: string[]) {
    const readoutDate = new Date().toISOString();
    const tags = tag_list;
    this.productsService.postReadout(readoutDate, tags)
      .subscribe({
        next: (response) => {
          this.ToastMessages();
        },
        error: (error) => {
        }
      });
  }
  
  Message() {
    if (this.NonProductTags.length > 0) {
      const tagsNaoEncontradas = this.NonProductTags.join(", "); 
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
  customSort(event: SortEvent) {
    if(event.field != this.orderedColumn) {
      this.isSorted = true;
      this.sortTableData(event);
    } else {
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
  }

  sortTableData(event: SortEvent) {
    event.data?.sort((data1, data2) => {
      const field = event.field as string;
        this.orderedColumn = field;
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

  sortIconClass(fieldName: string): string {
    if(this.orderedColumn == fieldName) {
      if(this.isSorted) 
        return "pi pi-sort-up-fill";
  
      else if(this.isSorted == false) 
        return "pi pi-sort-down-fill";
    }
    
    return "pi pi-sort";
  }

}

