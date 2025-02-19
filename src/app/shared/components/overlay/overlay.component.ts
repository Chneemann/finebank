import { Component, Input } from '@angular/core';
import { ButtonComponent } from '../layouts/button/button.component';
import { GoalsOverlayComponent } from './goals-overlay/goals-overlay.component';

@Component({
  selector: 'app-overlay',
  imports: [ButtonComponent, GoalsOverlayComponent],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
})
export class OverlayComponent {
  @Input() embedded = '';
}
