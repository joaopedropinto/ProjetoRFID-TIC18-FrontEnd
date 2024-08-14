import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  ],
  templateUrl: './product-register.component.html',
  styleUrl: './product-register.component.css'
})
export class ProductRegisterComponent implements OnInit {

  productForm!: FormGroup;

  categories!: Category[];
  suppliers!: Supplier[];

  packingTypes = [
    'Plástico',
    'Enlatado',
    'Papel e papelão',
    'Vidro',
    'A vácuo'
  ];

  // packingTypes = [
  //   { type: 'Plástico' }, 
  //   { type: 'Enlatado' }, 
  //   { type: 'Papel e papelão' }, 
  //   { type: 'Vidro' } , 
  //   { type: 'A vácuo' }
  // ];

  constructor(
    private formBuilder: FormBuilder, 
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
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
      packingType: [null, [Validators.required]],
      batchNumber: [null, [Validators.required]],
      quantity: [null, [Validators.required, Validators.min(0)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
    })
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(response => {
       this.categories = response;
    })

    this.supplierService.getSuppliers().subscribe(response => {
       this.suppliers = response;
    })
  }

  onSubmit(): void {
    const newProduct: Product = {
      name: this.productForm.get('name')?.value,
      idCategory: this.productForm.get('category')?.value.id,
      idSupplier: this.productForm.get('supplier')?.value.id,
      idTag: this.productForm.get('tag')?.value, 
      description: this.productForm.get('description')?.value,
      weight: this.productForm.get('weight')?.value,
      manufacDate: this.productForm.get('manufacDate')?.value.toISOString(),
      dueDate: this.productForm.get('dueDate')?.value.toISOString(),
      unitMeasurement: this.productForm.get('unitMeasurement')?.value,
      packingType: this.productForm.get('packingType')?.value,
      batchNumber: this.productForm.get('batchNumber')?.value,
      quantity: this.productForm.get('quantity')?.value,
      price: this.productForm.get('price')?.value,
    }

    if(this.productForm.valid) {
      console.log(newProduct);
      this.productService.postProduct(newProduct).subscribe(() => {
        alert('Produto cadastrado com sucesso!'); // TODO: Implementar componente p-Toast do PrimeNG.
        this.productForm.reset();
      });
    }

  }
}
