import { Component } from '@angular/core';

@Component({
  selector: 'app-modal-detailing',
  standalone: true,
  imports: [],
  templateUrl: './modal-detailing.component.html',
  styleUrl: './modal-detailing.component.css'
})
export class ModalDetailingComponent {
  mostrar: boolean = false;
  toggle () {
    this.mostrar = !this.mostrar;
  }
}
