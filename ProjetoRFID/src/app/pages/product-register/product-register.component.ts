import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product/product.service';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../models/category.model';
import { Supplier } from '../../models/supplier.model';
import { SupplierService } from '../../services/supplier/supplier.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';
import { PackagingService } from '../../services/packaging/packaging.service'; // Importação do novo serviço
import { Packaging } from '../../models/packaging.model';
import { FileUploadModule } from 'primeng/fileupload';


@Component({
  selector: 'app-product-register',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    InputTextModule,
    FloatLabelModule,
    InputTextareaModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    InputNumberModule,
    ButtonModule,
    ToastModule,
    RippleModule,
    FileUploadModule,
  ],
  providers: [MessageService],
  templateUrl: './product-register.component.html',
  styleUrls: ['./product-register.component.css'] // Corrigido de styleUrl para styleUrls
})
export class ProductRegisterComponent implements OnInit {

  productForm!: FormGroup;

  categories!: Category[];
  suppliers!: Supplier[];
  packages!: Packaging[]; // Adicionado novo atributo

  unitsOfMeasurement = [
    { label: 'Kg', value: 'Kg' },
    { label: 'Litros', value: 'Litros' },
    { label: 'Unidades', value: 'Unidades' },
    { label: 'Caixas', value: 'Caixas' }
  ];
 

  constructor(
    private formBuilder: FormBuilder, 
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private packagingService: PackagingService, 
    private messageService: MessageService,
    private router: Router
  ) {
    this.productForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      category: [null, [Validators.required]],
      supplier: [null, [Validators.required]],
      tag: [null, [Validators.required]],
      description: [null, [Validators.required]],
      weight: [null, [Validators.required, Validators.min(0.01)]],
      manufacDate: [null, [Validators.required]],
      dueDate: [null, [Validators.required]],
      unitMeasurement: [null, [Validators.required]],
      packages: [null, [Validators.required]],
      batchNumber: [null, [Validators.required]],
      quantity: [null, [Validators.required, Validators.min(0)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      height: [null, [Validators.required, Validators.min(0.1)]],
      width: [null, [Validators.required, Validators.min(0.1)]],
      length: [null, [Validators.required, Validators.min(0.1)]],
    })
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(response => {
      this.categories = response;
    });

    this.supplierService.getSuppliers().subscribe(response => {
      this.suppliers = response;
    });

    this.packagingService.getPackagingTypes().subscribe(response => {
      this.packages = response; 
    });

    const manufacDateControl = this.productForm.get('manufacDate');
    const dueDateControl = this.productForm.get('dueDate');

    if (manufacDateControl && dueDateControl) {
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
    const file = (event.target as HTMLInputElement).files![0];
    if (file) {
      const reader = new FileReader();  

      reader.onload = () => {
        const base64Image = reader.result as string;
            this.productForm.patchValue({ imageBase64: base64Image });
          };
          reader.readAsDataURL(file);  
        }
      }

  onSubmit(): void {
    const newProduct: Product = {
      name: this.productForm.get('name')?.value,
      idCategory: this.productForm.get('category')?.value.id,
      idSupplier: this.productForm.get('supplier')?.value.id,
      rfidTag: this.productForm.get('tag')?.value,
      description: this.productForm.get('description')?.value,
      weight: this.productForm.get('weight')?.value,
      manufacDate: this.productForm.get('manufacDate')?.value.toISOString(),
      dueDate: this.productForm.get('dueDate')?.value.toISOString(),
      unitMeasurement: this.productForm.get('unitMeasurement')?.value,
      idPackaging: this.productForm.get('packages')?.value.id,
      batchNumber: this.productForm.get('batchNumber')?.value,
      quantity: this.productForm.get('quantity')?.value,
      price: this.productForm.get('price')?.value,
      height: this.productForm.get('height')?.value,
      width: this.productForm.get('width')?.value,
      length: this.productForm.get('length')?.value,
      volume: this.productForm.get('height')?.value * this.productForm.get('width')?.value * this.productForm.get('length')?.value,
      imageBase64: this.productForm.get('imageBase64')?.value
    }
    console.log(newProduct);
    if (this.productForm.valid) {
      this.productService.postProduct(newProduct).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto cadastrado com sucesso!' });
        this.productForm.reset();
        setTimeout(() => {
          this.router.navigate(['produtos'])
        }, 2000);
      });
    }
  }
}
