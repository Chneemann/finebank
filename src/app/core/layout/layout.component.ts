import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { OverlayComponent } from '../../shared/components/overlay/overlay.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, OverlayComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}
