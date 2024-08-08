import { Component, Input } from '@angular/core';
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

  items: MenuItem[] = [
    {
      label: 'Produtos',
      icon: 'pi pi-box',
      items: [
        { label: 'Cadastrar', icon: 'pi pi-plus', routerLink: ['/produtos/adicionar'] },
        { label: 'Listar', icon: 'pi pi-list', routerLink: ['/produtos'] },
      ]
    },
    {
      label: 'Leituras',
      icon: 'pi pi-barcode',
      items: [
        { label: 'Nova Leitura', icon: 'pi pi-plus', routerLink: ['/leituras/realizar'] },
        { label: 'Histórico', icon: 'pi pi-history', routerLink: ['/leituras/historico'] },
      ]
    }
  ];
}
