import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
} from '@angular/core';
import {
  Firestore,
  QueryConstraint,
  collection,
  collectionData,
  doc,
  docData,
  getDoc,
  limit,
  query,
  where,
} from '@angular/fire/firestore';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
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

  // Transaction periods

  countAllTransactions(
    month: number,
    year: number,
    accountId?: string
  ): Observable<number> {
    return this.withUserId((userId) => {
      return runInInjectionContext(this.injector, () => {
        const collectionRef = collection(this.firestore, 'transactions');
        let q = query(
          collectionRef,
          where('userId', '==', userId),
          where('month', '==', month),
          where('year', '==', year)
        );

        if (accountId) {
          q = query(q, where('accountId', '==', accountId));
        }

        return collectionData(q).pipe(
          map((transactions) => transactions.length)
        );
      });
    });
  }

  getTransactionsByFilters(
    type: string,
    year: number,
    quantity: number,
    month?: number,
    accountId?: string
  ): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      const collectionRef = collection(this.firestore, 'transactions');
      let queryConstraints: QueryConstraint[] = [
        where('type', '==', type),
        where('year', '==', year),
        limit(quantity),
      ];

      if (month !== undefined && month !== null && month !== 0) {
        queryConstraints.push(where('month', '==', month));
      }

      if (accountId) {
        queryConstraints.push(where('accountId', '==', accountId));
      }

      const q = query(collectionRef, ...queryConstraints);
      return collectionData(q, { idField: 'id' });
    });
  }

  getTransactionsPeriodsByAccount(accountId: string): Observable<string[]> {
    return runInInjectionContext(this.injector, () => {
      const accountDocRef = doc(this.firestore, 'accounts', accountId);
      return from(getDoc(accountDocRef)).pipe(
        map((docSnapshot) => {
          if (docSnapshot.exists()) {
            const accountData = docSnapshot.data();
            const transactionPeriods: string[] =
              accountData['transactionPeriods'] || [];
            return transactionPeriods;
          } else {
            return [];
          }
        })
      );
    });
  }

  getTransactionPeriods(accountId?: string): Observable<string[]> {
    return this.withUserId((userId) => {
      return runInInjectionContext(this.injector, () => {
        if (accountId) {
          const docRef = doc(this.firestore, `accounts/${accountId}`);
          return docData(docRef).pipe(
            map((account: any) => {
              const periods: string[] = account?.transactionPeriods || [];
              return [...new Set(periods)];
            })
          );
        } else {
          const collectionRef = collection(this.firestore, 'accounts');
          const q = query(collectionRef, where('userId', '==', userId));
          return collectionData(q, { idField: 'id' }).pipe(
            map((accounts: any[]) => {
              const allPeriods: string[] = [];
              accounts.forEach((account) => {
                if (Array.isArray(account?.transactionPeriods)) {
                  allPeriods.push(...account.transactionPeriods);
                }
              });
              return [...new Set(allPeriods)];
            })
          );
        }
      });
    });
  }
}
