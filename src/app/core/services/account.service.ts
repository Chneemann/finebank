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
  doc,
  docData,
  getDoc,
  query,
  where,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { AccountModel } from '../models/account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);

  private userId = 'lsui7823kmbndks9037hjdsd';

  getAccountById(accountId: string): Observable<any> {
    return runInInjectionContext(this.injector, () =>
      docData(doc(this.firestore, `accounts/${accountId}`), { idField: 'id' })
    );
  }

  getAccountsByUserId(): Observable<AccountModel[]> {
    return runInInjectionContext(this.injector, () => {
      const transactionsRef = collection(this.firestore, 'accounts');
      const q = query(transactionsRef, where('userId', '==', this.userId));

      return collectionData(q, { idField: 'id' }).pipe(
        map((accounts) => accounts.map((acc) => new AccountModel(acc)))
      );
    });
  }

  countUserAccounts(): Observable<number> {
    return runInInjectionContext(this.injector, () => {
      const accountsRef = collection(this.firestore, 'accounts');
      const q = query(accountsRef, where('userId', '==', this.userId));

      return collectionData(q).pipe(map((accounts: any[]) => accounts.length));
    });
  }

  accountExists(accountId: string): Observable<boolean> {
    return runInInjectionContext(this.injector, () => {
      const docRef = doc(this.firestore, `accounts/${accountId}`);

      return from(getDoc(docRef)).pipe(map((docSnap) => docSnap.exists()));
    });
  }
}
