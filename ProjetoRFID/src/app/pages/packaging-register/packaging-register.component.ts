import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PackagingService } from '../../services/packaging/packaging.service';
import { Packaging } from '../../models/packaging.model';
import { MessageService } from 'primeng/api';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-packaging-register',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    CardModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    ToastModule,
    RippleModule,
  ],
  providers: [MessageService],
  templateUrl: './packaging-register.component.html',
  styleUrl: './packaging-register.component.css'
})
export class PackagingRegisterComponent {

  packagingForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private packagingService: PackagingService,
    private messageService: MessageService,
  ) {
    this.packagingForm = this.formBuilder.group({
      name: [null, [Validators.required]],
    })
  }

  postPackaging() {
    const packaging: Packaging = {
      name: this.packagingForm.get('name')?.value,
    }
    
    this.packagingService.postPackaging(packaging).subscribe(() => {
      this.messageService.add({ severity:'success', summary: 'Sucesso', detail: 'Embalagem cadastrada com sucesso!' });
      this.packagingForm.reset();
    });
  }

}
