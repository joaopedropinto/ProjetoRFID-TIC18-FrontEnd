import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product/product.service';
import { ActivatedRoute } from '@angular/router';

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
  ],
  templateUrl: './product-editing.component.html',
  styleUrl: './product-editing.component.css'
})
export class ProductEditingComponent implements OnInit {

  productForm!: FormGroup;
  private productId!: string;

  categories: string[] = [];
  suppliers: string[] = [];

  packingTypes = [
    'Plástico',
    'Enlatado',
    'Papel e papelão',
    'Vidro',
    'A vácuo'
  ];

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
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
    });
   }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;

    this.productService.getProductById(this.productId).subscribe(productResponse => {
      this.productForm.get('name')?.setValue(productResponse.name);
      this.productForm.get('category')?.setValue(productResponse.idCategory);
      this.productForm.get('supplier')?.setValue(productResponse.idSupplier);
      // this.productForm.get('tag')?.setValue(productResponse.idTag);
      this.productForm.get('tag')?.setValue(productResponse.rfidTag);
      this.productForm.get('description')?.setValue(productResponse.description);
      this.productForm.get('weight')?.setValue(productResponse.weight);
      this.productForm.get('manufacDate')?.setValue(productResponse.manufacDate);
      this.productForm.get('dueDate')?.setValue(productResponse.dueDate);
      this.productForm.get('unitMeasurement')?.setValue(productResponse.unitMeasurement);
      this.productForm.get('packingType')?.setValue(productResponse.packingType);
      this.productForm.get('batchNumber')?.setValue(productResponse.batchNumber);
      this.productForm.get('quantity')?.setValue(productResponse.quantity);
      this.productForm.get('price')?.setValue(productResponse.price);
    })
  }

  onSubmit() {

  }

}
