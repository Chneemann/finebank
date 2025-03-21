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
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import {
  catchError,
  combineLatest,
  from,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { AuthService } from './auth.service';
import { TransactionModel } from '../models/transactions.model';

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

  getTransactionPeriods(
    accountId?: string,
    type?: 'expense' | 'revenue'
  ): Observable<string[]> {
    return this.withUserId((userId) => {
      return runInInjectionContext(this.injector, () => {
        let transactionsQuery = collection(this.firestore, 'transactions');
        let conditions = [where('userId', '==', userId)];

        if (accountId) {
          conditions.push(where('accountId', '==', accountId));
        }

        if (type) {
          conditions.push(where('type', '==', type));
        }

        return collectionData(query(transactionsQuery, ...conditions)).pipe(
          map((transactions: any[]) => {
            const periods = transactions.map(
              (t) => `${t.month.toString().padStart(2, '0')}${t.year}`
            );
            return [...new Set(periods)].sort();
          })
        );
      });
    });
  }

  getTransactionsByCategory(
    categories: string[] = [],
    year: number,
    month?: number,
    limitCount?: number
  ): Observable<{ category: string; transactions: TransactionModel[] }[]> {
    return this.withUserId((userId) => {
      return runInInjectionContext(this.injector, () => {
        const collectionRef = collection(this.firestore, 'transactions');

        const observables = categories.map((category) => {
          let queryRef = query(
            collectionRef,
            where('userId', '==', userId),
            where('category', '==', category),
            where('year', '==', year)
          );

          if (month) {
            queryRef = query(queryRef, where('month', '==', month));
          }

          if (limitCount) {
            queryRef = query(queryRef, limit(limitCount));
          }

          return collectionData(queryRef, { idField: 'id' }).pipe(
            map((transactions) => ({
              category,
              transactions: transactions.map((t) => new TransactionModel(t)),
            })),
            catchError(() => of({ category, transactions: [] }))
          );
        });

        return combineLatest(observables);
      });
    });
  }

  getTotalAmountByCategory(
    categories: string[] = [],
    year: number,
    month?: number
  ): Observable<{ category: string; totalAmount: number }[]> {
    return this.getTransactionsByCategory(
      categories,
      year,
      month,
      undefined
    ).pipe(
      map((results) =>
        results.map(({ category, transactions }) => ({
          category,
          totalAmount: transactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
          ),
        }))
      )
    );
  }
}
