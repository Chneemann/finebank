import { Component } from '@angular/core';
import { ButtonComponent } from '../layouts/button/button.component';

@Component({
  selector: 'app-overlay',
  imports: [ButtonComponent],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
})
export class OverlayComponent {}
