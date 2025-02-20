import { Component, Input } from '@angular/core';
import { GoalsOverlayComponent } from './goals-overlay/goals-overlay.component';

@Component({
  selector: 'app-overlay',
  imports: [GoalsOverlayComponent],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
})
export class OverlayComponent {
  @Input() overlayData: {
    embedded: string | null;
    docId: string | null;
    collection: string | null;
  } = {
    embedded: null,
    docId: null,
    collection: null,
  };
}
