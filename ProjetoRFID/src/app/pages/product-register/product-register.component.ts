import { Component } from '@angular/core';
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
export class ProductRegisterComponent {

  productForm!: FormGroup;

  categories: string[] = [];
  suppliers: string[] = [];

  packingTypes = [
    { type: 'Plástico' }, 
    { type: 'Enlatado' }, 
    { type: 'Papel e papelão' }, 
    { type: 'Vidro' } , 
    { type: 'A vácuo' }
  ];

  constructor(private formBuilder: FormBuilder, private productService: ProductService) {
    this.productForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      category: [null],
      supplier: [null],
      description: [null],
      weight: [null, [Validators.required, Validators.min(0.01)]],
      manufacDate: [null, [Validators.required]],
      dueDate: [null, [Validators.required]],
      unitMeasurement: [null],
      packingType: [null],
      batchNumber: [null],
      quantity: [null, [Validators.required, Validators.min(0)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
    })
  }

  onSubmit(): void {
    const newProduct: Product = {
      name: this.productForm.get('name')?.value,
      categoryId: this.productForm.get('category')?.value,
      supplierId: this.productForm.get('supplier')?.value,
      description: this.productForm.get('description')?.value,
      weight: this.productForm.get('weight')?.value,
      manufacDate: this.productForm.get('manufacDate')?.value,
      dueDate: this.productForm.get('dueDate')?.value,
      unitMeasurement: this.productForm.get('unitMeasurement')?.value,
      packingType: this.productForm.get('packingType')?.value,
      batchNumber: this.productForm.get('batchNumber')?.value,
      quantity: this.productForm.get('quantity')?.value,
      price: this.productForm.get('price')?.value,
    }

    this.productService.postProduct(newProduct).subscribe(() => {
      alert('Produto cadastrado com sucesso!'); // TODO: Implementar componente p-Toast do PrimeNG.
      this.productForm.reset();
    });
  }
}
