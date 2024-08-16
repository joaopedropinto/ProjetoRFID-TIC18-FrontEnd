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
import { ProductService } from '../../services/product/product.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Category } from '../../models/category.model';
import { Supplier } from '../../models/supplier.model';
import { CategoryService } from '../../services/category/category.service';
import { SupplierService } from '../../services/supplier/supplier.service';
import { Product } from '../../models/product.model';

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
    RouterLink
  ],
  templateUrl: './product-editing.component.html',
  styleUrl: './product-editing.component.css'
})
export class ProductEditingComponent implements OnInit {

  productForm!: FormGroup;

  private productId!: number;
  productManuFacDate!: Date;
  productDueDate!: Date;


  categories!: Category[];
  suppliers!: Supplier[];

  selectedCategory: Category | undefined;
  selectedSupplier: Supplier | undefined;

  packingTypes = [
    'Plástico',
    'Enlatado',
    'Papel e papelão',
    'Vidro',
    'A vácuo'
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
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
      packingType: [null, [Validators.required]],
      batchNumber: [null, [Validators.required]],
      quantity: [null, [Validators.required, Validators.min(0)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
    });
   }

  ngOnInit(): void {
    this.productId = parseInt(this.route.snapshot.paramMap.get('id')!);

    this.categoryService.getCategories().subscribe(response => {
       this.categories = response;
    })

    this.supplierService.getSuppliers().subscribe(response => {
       this.suppliers = response;
    })

    this.productService.getProductById(this.productId).subscribe(productResponse => {
      this.categoryService.getCategoryById(productResponse.idCategory).subscribe(categoryResponse => {
        this.selectedCategory = categoryResponse;
      });

      this.supplierService.getSupplierById(productResponse.idSupplier).subscribe(supplierResponse => {
        this.selectedSupplier = supplierResponse;
      });

      this.productForm.get('name')?.setValue(productResponse.name);
      this.productForm.get('tag')?.setValue(productResponse.rfidTag);
      this.productForm.get('description')?.setValue(productResponse.description);
      this.productForm.get('weight')?.setValue(productResponse.weight);
      this.productForm.get('manufacDate')?.setValue(new Date(productResponse.manufacDate));
      this.productForm.get('dueDate')?.setValue(new Date(productResponse.dueDate));
      this.productForm.get('unitMeasurement')?.setValue(productResponse.unitMeasurement);
      this.productForm.get('packingType')?.setValue(productResponse.packingType);
      this.productForm.get('batchNumber')?.setValue(productResponse.batchNumber);
      this.productForm.get('quantity')?.setValue(productResponse.quantity);
      this.productForm.get('price')?.setValue(productResponse.price);
    })
  }

  onSubmit() {
    const updatedProduct: Product = {
      id: this.productId,
      name: this.productForm.get('name')?.value,
      idCategory: this.productForm.get('category')?.value.id,
      idSupplier: this.productForm.get('supplier')?.value.id,
      rfidTag: this.productForm.get('tag')?.value,
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
      console.log(this.productForm.value);
      this.productService.putProduct(updatedProduct).subscribe(() => {
        alert('Produto atualizado com sucesso!'); // TODO: Implementar componente p-Toast do PrimeNG.
        this.router.navigate(['produtos'])
      });
    }
  }

}
