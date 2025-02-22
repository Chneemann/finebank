import { Component, Input } from '@angular/core';
import { GoalsOverlayComponent } from './goals-overlay/goals-overlay.component';
import { OverlayService } from '../../../core/services/overlay.service';

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

  constructor(private overlayService: OverlayService) {}

  closeOverlay() {
    this.overlayService.resetEmbeddedOverlay();
  }
}
