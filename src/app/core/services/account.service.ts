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
import { catchError, filter, from, map, Observable, of, switchMap } from 'rxjs';
import { AccountModel } from '../models/account.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);
  private readonly authService = inject(AuthService);

  private readonly userId$: Observable<string | null>;

  constructor() {
    this.userId$ = this.authService.getUserId();
  }

  // Auxiliary method for repeated logic with userId$
  private withUserId<T>(
    operation: (userId: string) => Observable<T>
  ): Observable<T> {
    return this.userId$.pipe(
      switchMap((userId) => {
        if (!userId) {
          return of(null as T);
        }
        return operation(userId);
      }),
      catchError((error) => {
        console.error('Operation failed:', error);
        return of(null as T);
      })
    );
  }

  getSpecificUserAccount(accountId: string): Observable<AccountModel> {
    return this.withUserId((userId) =>
      runInInjectionContext(this.injector, () => {
        const accountRef = doc(this.firestore, `accounts/${accountId}`);
        return docData(accountRef, { idField: 'id' }).pipe(
          filter((account: any) => account?.userId === userId),
          map((account) => new AccountModel(account))
        );
      })
    );
  }

  getAllUserAccounts(): Observable<AccountModel[]> {
    return this.withUserId((userId) =>
      runInInjectionContext(this.injector, () => {
        const accountsRef = collection(this.firestore, 'accounts');
        const q = query(accountsRef, where('userId', '==', userId));

        return collectionData(q, { idField: 'id' }).pipe(
          map((accounts) => accounts.map((acc) => new AccountModel(acc)))
        );
      })
    );
  }

  countAllUserAccounts(): Observable<number> {
    return this.withUserId((userId) =>
      runInInjectionContext(this.injector, () => {
        const accountsRef = collection(this.firestore, 'accounts');
        const q = query(accountsRef, where('userId', '==', userId));

        return collectionData(q).pipe(
          map((accounts: any[]) => accounts.length)
        );
      })
    );
  }

  accountExists(accountId: string): Observable<boolean> {
    return runInInjectionContext(this.injector, () => {
      const docRef = doc(this.firestore, `accounts/${accountId}`);

      return from(getDoc(docRef)).pipe(
        map((docSnap) => docSnap.exists()),
        catchError((error) => {
          console.error('Failed to check if account exists:', error);
          return of(false);
        })
      );
    });
  }
}
