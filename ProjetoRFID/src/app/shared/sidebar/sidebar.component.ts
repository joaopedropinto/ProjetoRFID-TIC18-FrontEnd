import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SidebarModule,
    ButtonModule,
    PanelMenuModule,
    CardModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() sidebarVisible: boolean = true;
  @Output() hideSidebarEvent = new EventEmitter<boolean>();

  items: MenuItem[] = [
    {
      label: 'Embalagens',
      icon: 'pi pi-inbox',
      routerLink: ['/embalagens/cadastrar'],
    },
    {
      label: 'Produtos',
      icon: 'pi pi-box',
      routerLink: ['/produtos'],
    },
    {
      label: 'Leituras',
      icon: 'pi pi-barcode',
      items: [
        { label: 'Nova Leitura', icon: 'pi pi-plus', routerLink: ['/leituras/realizar'] },
        { label: 'Histórico', icon: 'pi pi-history', routerLink: ['/leituras/historico'] },
      ]
    },
    
  ];
}
