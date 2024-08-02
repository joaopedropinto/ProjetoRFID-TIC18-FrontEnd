import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ToolbarModule,
    ButtonModule,
    SidebarComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  sidebarVisible: boolean = false;

  toggleSidebar(): void {
    this.sidebarVisible =! this.sidebarVisible;
  }
}
