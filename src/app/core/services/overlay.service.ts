import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  private embeddedOverlaySubject = new BehaviorSubject<string | null>(null);
  embeddedOverlay$ = this.embeddedOverlaySubject.asObservable();

  setEmbeddedOverlay(value: string | null) {
    this.embeddedOverlaySubject.next(value);
  }
}
