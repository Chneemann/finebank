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

  getTransactionDataByAccountId(accountId: string): Observable<any> {
    return runInInjectionContext(this.injector, () => {
      const transactionsRef = collection(this.firestore, 'transactions');
      const q = query(transactionsRef, where('accountId', '==', accountId));

      return collectionData(q, { idField: 'id' });
    });
  }

  getAllTransactionsByType(type: string): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      const collectionRef = collection(this.firestore, 'transactions');
      let q = query(collectionRef, where('type', '==', type));
      return collectionData(q, { idField: 'id' });
    });
  }

  getLastTransactionsByType(type: string, number: number): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      const collectionRef = collection(this.firestore, 'transactions');
      let q = query(collectionRef, where('type', '==', type), limit(number));
      return collectionData(q, { idField: 'id' });
    });
  }
}
