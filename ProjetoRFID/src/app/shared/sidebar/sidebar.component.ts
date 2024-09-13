import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SidebarModule,
    ButtonModule,
    PanelMenuModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() sidebarVisible!: boolean;
  @Output() hideSidebarEvent = new EventEmitter<boolean>();

  items: MenuItem[] = [
    {
      label: 'Produtos',
      icon: 'pi pi-box',
      routerLink: ['/produtos'],
      command: () => { this.hideSidebar() } },
    {
      label: 'Leituras',
      icon: 'pi pi-barcode',
      items: [
        { label: 'Nova Leitura', icon: 'pi pi-plus', routerLink: ['/leituras/realizar'], command: () => { this.hideSidebar() } },
        { label: 'Histórico', icon: 'pi pi-history', routerLink: ['/leituras/historico'], command: () => { this.hideSidebar() } },
      ]
    },
    {
      label: 'Embalagens',
      icon: 'pi pi-inbox',
      routerLink: ['/embalagens/cadastrar'],
      command: () => { this.hideSidebar() }
    }
  ];

  hideSidebar(): void {
    this.sidebarVisible = false;
    this.hideSidebarEvent.emit(this.sidebarVisible);
  }
}
