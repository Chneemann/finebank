import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  private embeddedOverlaySubject = new BehaviorSubject<string>('');
  embeddedOverlay$ = this.embeddedOverlaySubject.asObservable();

  setEmbeddedOverlay(value: string) {
    this.embeddedOverlaySubject.next(value);
  }
}
