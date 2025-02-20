import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  private embeddedOverlaySubject = new BehaviorSubject<any>({
    embedded: null,
    docId: null,
    collection: null,
  });

  embeddedOverlay$ = this.embeddedOverlaySubject.asObservable();

  setEmbeddedOverlay(data: any) {
    this.embeddedOverlaySubject.next(data);
  }

  resetEmbeddedOverlay() {
    this.embeddedOverlaySubject.next({
      embedded: null,
      docId: null,
      collection: null,
    });
  }
}
