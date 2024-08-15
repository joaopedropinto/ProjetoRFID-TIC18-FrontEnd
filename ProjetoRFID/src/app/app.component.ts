import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DividerModule } from 'primeng/divider';
import { ProductsReadComponent } from './pages/products-read/products-read.component';
import { ModalDetailingComponent } from './shared/modal-detailing/modal-detailing.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    DividerModule,
    ProductsReadComponent,
    ModalDetailingComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ProjetoRFID';
}
