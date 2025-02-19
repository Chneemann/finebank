import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { OverlayComponent } from '../../shared/components/overlay/overlay.component';
import { OverlayService } from '../services/overlay.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    OverlayComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  embeddedOverlay$!: Observable<string>;

  constructor(private overlayService: OverlayService) {}

  ngOnInit(): void {
    this.embeddedOverlay$ = this.overlayService.embeddedOverlay$;
  }
}
