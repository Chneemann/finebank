import { Component, Input } from '@angular/core';
import { OverlayService } from '../../../../core/services/overlay.service';
import { ButtonComponent } from '../../layouts/button/button.component';

@Component({
  selector: 'app-goals-overlay',
  imports: [ButtonComponent],
  templateUrl: './goals-overlay.component.html',
  styleUrl: './goals-overlay.component.scss',
})
export class GoalsOverlayComponent {
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

  saveOverlay() {
    this.closeOverlay();
  }

  closeOverlay() {
    this.overlayService.resetEmbeddedOverlay();
  }
}
