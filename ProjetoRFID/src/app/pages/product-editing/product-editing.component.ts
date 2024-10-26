import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ProductService } from '../../services/product/product.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Category } from '../../models/category.model';
import { Supplier } from '../../models/supplier.model';
import { CategoryService } from '../../services/category/category.service';
import { SupplierService } from '../../services/supplier/supplier.service';
import { Product } from '../../models/product.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Packaging } from '../../models/packaging.model';
import { PackagingService } from '../../services/packaging/packaging.service';
import { FileUploadModule } from 'primeng/fileupload';
@Component({
  selector: 'app-product-editing',
  standalone: true,
  imports: [
    CardModule,
    InputTextModule,
    FloatLabelModule,
    InputTextareaModule,
    CalendarModule,
    CommonModule,
    DropdownModule,
    InputNumberModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    ToastModule,
    FileUploadModule 
  ],
  providers: [MessageService],
  templateUrl: './product-editing.component.html',
  styleUrl: './product-editing.component.css'
})
export class ProductEditingComponent implements OnInit {

  productForm!: FormGroup;
  uploadedFiles: File[] = [];

  private productId!: string;
  productManuFacDate!: Date;
  productDueDate!: Date;


  categories!: Category[];
  suppliers!: Supplier[];
  packages!: Packaging[];

  onUpload(event: any) {
    this.uploadedFiles.push(...event.files); // Armazena os arquivos enviados
    console.log(this.uploadedFiles); // Para verificar/testar os arquivos no console
  }

  selectedCategory: Category | undefined;
  selectedSupplier: Supplier | undefined;
  selectedPackaging: Packaging | undefined;

  unitsOfMeasurement = [
    { label: 'Kg', value: 'Kg' },
    { label: 'Litros', value: 'Litros' },
    { label: 'Unidades', value: 'Unidades' },
    { label: 'Caixas', value: 'Caixas' }
  ];

  enableButtons: boolean = true;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private packagingService: PackagingService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router, 
    private messageService: MessageService
  ) {
    this.productForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      category: [null, [Validators.required]],
      supplier: [null, [Validators.required]],
      description: [null, [Validators.required]],
      weight: [null, [Validators.required, Validators.min(0.01)]],
      manufacDate: [null, [Validators.required]],
      dueDate: [null, [Validators.required]],
      unitMeasurement: [null, [Validators.required]],
      packages: [null, [Validators.required]],
      batchNumber: [null, [Validators.required]],
      quantity: [null, [Validators.required, Validators.min(0)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      height : [null, [Validators.required, Validators.min(0.1)]],
      width : [null, [Validators.required, Validators.min(0.1)]],
      length : [null, [Validators.required, Validators.min(0.1)]],
      imageBase64: [null, ],
    });
   }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;

    this.categoryService.getCategories().subscribe(response => {
       this.categories = response;
    });

    this.supplierService.getSuppliers().subscribe(response => {
       this.suppliers = response;
    })

    this.packagingService.getPackagingTypes().subscribe(response => {
      this.packages = response; 
    });

    this.productService.getProductById(this.productId).subscribe(productResponse => {
      this.categoryService.getCategoryById(productResponse.idCategory).subscribe(categoryResponse => {
        this.selectedCategory = categoryResponse;
      });

      this.supplierService.getSupplierById(productResponse.idSupplier).subscribe(supplierResponse => {
        this.selectedSupplier = supplierResponse;
      });
      this.packagingService.getPackagingById(productResponse.idPackaging).subscribe(packagingResponse => {
        this.selectedPackaging = packagingResponse;
      })

      this.productForm.get('name')?.setValue(productResponse.name);
      this.productForm.get('description')?.setValue(productResponse.description);
      this.productForm.get('weight')?.setValue(productResponse.weight);
      this.productForm.get('manufacDate')?.setValue(new Date(productResponse.manufacDate));
      this.productForm.get('dueDate')?.setValue(new Date(productResponse.dueDate));
      this.productForm.get('unitMeasurement')?.setValue(productResponse.unitMeasurement);
      this.productForm.get('packages')?.setValue(productResponse.packingType);
      this.productForm.get('batchNumber')?.setValue(productResponse.batchNumber);
      this.productForm.get('quantity')?.setValue(productResponse.quantity);
      this.productForm.get('price')?.setValue(productResponse.price);
      this.productForm.get('height')?.setValue(productResponse.height);
      this.productForm.get('width')?.setValue(productResponse.width);
      this.productForm.get('length')?.setValue(productResponse.length);
      this.productForm.get('volume')?.setValue(productResponse.height * productResponse.width * productResponse.length);});
      

    const manufacDateControl = this.productForm.get('manufacDate');
    const dueDateControl = this.productForm.get('dueDate');

    if(manufacDateControl && dueDateControl) {
      dueDateControl.addValidators([
        this.compareDatesValidator(manufacDateControl)
      ]);
      dueDateControl.updateValueAndValidity();
    }
  }

  compareDatesValidator(manufacDateControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const dueDate = control.value;
      const manufacDate = manufacDateControl.value;

      if (dueDate && manufacDate && new Date(dueDate) <= new Date(manufacDate)) {
        return { 'invalidDateComparison': true };
      }
      return null;
    };
  }
  onFileSelect(event: any): void {
    const files = event.files; 

    
    if (files && files.length > 0) {
        const file = files[0]; 

        // testa se é imagem
        if (!file.type.startsWith('image/')) {
            console.error('Por favor, selecione um arquivo de imagem válido.');
            return;
        }

        // testa tamanho do arquivo
        const MAX_SIZE = 2 * 1024 * 1024; 
        if (file.size > MAX_SIZE) {
            console.error('O arquivo é muito grande. Selecione um arquivo menor que 2MB.');
            return;
        }

        const reader = new FileReader();

        
        reader.onload = () => {
            const base64Image = reader.result as string; // converte a imagem para Base64
            this.productForm.patchValue({ imageBase64: base64Image }); // Atualiza o formulário
            
            // log teste
            console.log('Imagem em Base64:', this.productForm.get('imageBase64')?.value);
        };

        // leitura
        reader.readAsDataURL(file); 
    } else {
        console.error('Nenhum arquivo foi selecionado.');
    }
    
    // teste loh
    console.log('base fora do método', this.productForm.get('imageBase64')?.value);
}
onFileRemove(event: any): void {
    // Limpa o valor da imagem no formulário ao remover o arquivo
    this.productForm.patchValue({ imageBase64: null });
    
    // Log de teste
    console.log('Arquivo removido');
}

  onSubmit() {
    const updatedProduct: Product = {
      id: this.productId,
      name: this.productForm.get('name')?.value,
      idCategory: this.productForm.get('category')?.value.id,
      idSupplier: this.productForm.get('supplier')?.value.id,
      idPackaging: this.productForm.get('packages')?.value.id,
      description: this.productForm.get('description')?.value,
      weight: this.productForm.get('weight')?.value,
      manufacDate: this.productForm.get('manufacDate')?.value.toISOString(),
      dueDate: this.productForm.get('dueDate')?.value.toISOString(),
      unitMeasurement: this.productForm.get('unitMeasurement')?.value,
      batchNumber: this.productForm.get('batchNumber')?.value,
      quantity: this.productForm.get('quantity')?.value,
      price: this.productForm.get('price')?.value,
      height: this.productForm.get('height')?.value, 
      width: this.productForm.get('width')?.value,
      length: this.productForm.get('length')?.value,
      volume: this.productForm.get('height')?.value * this.productForm.get('width')?.value * this.productForm.get('length')?.value, 
      imageBase64: this.productForm.get('imageBase64')?.value
    }
  
    if (this.productForm.valid) {
      this.productService.putProduct(updatedProduct).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto atualizado com sucesso!' });
        this.enableButtons = false;
        setTimeout(() => {
          this.router.navigate(['produtos']);
        }, 2000);
      });
    }
  }
  

}
