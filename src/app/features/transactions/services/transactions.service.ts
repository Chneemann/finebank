import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
} from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  limit,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);

  getAllTransactions(): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      const collectionRef = collection(this.firestore, 'transactions');
      return collectionData(collectionRef, { idField: 'id' });
    });
  }

  getLastTransactions(type: string | null = null): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      const collectionRef = collection(this.firestore, 'transactions');
      let q = query(collectionRef, orderBy('date', 'desc'), limit(5));
      if (type) {
        q = query(
          collectionRef,
          orderBy('date', 'desc'),
          where('type', '==', type),
          limit(5)
        );
      }
      return collectionData(q, { idField: 'id' });
    });
  }
}
