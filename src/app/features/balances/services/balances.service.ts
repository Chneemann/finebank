import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BalancesService {
  private firestore: Firestore = inject(Firestore);

  getAllAccounts(): Observable<any[]> {
    const collectionRef = collection(this.firestore, 'accounts');
    return collectionData(collectionRef, { idField: 'id' });
  }
}
