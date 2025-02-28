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
  query,
  where,
} from '@angular/fire/firestore';
import {
  BehaviorSubject,
  Observable,
  switchMap,
  combineLatest,
  map,
  catchError,
  of,
} from 'rxjs';
import { TransactionModel } from '../models/transactions.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class BalancesService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);
  private readonly authService = inject(AuthService);

  private readonly userId$: Observable<string | null>;

  private globalBalanceSubject = new BehaviorSubject<number>(0);
  private accountsBalancesSubject = new BehaviorSubject<
    { accountId: string; balance: number }[]
  >([]);

  globalBalance$ = this.globalBalanceSubject.asObservable();
  accountsBalances$ = this.accountsBalancesSubject.asObservable();

  constructor() {
    this.userId$ = this.authService.getUserId();
    this.loadAllUserBalances();
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

  // Balances

  private loadAllUserBalances(): void {
    this.getUserAccountIds().subscribe((accountIds) => {
      const transactions$ = accountIds.map((accountId) =>
        this.getAllTransactionsForAccount(accountId).pipe(
          switchMap((transactions) => {
            const balance = this.calculateAccountBalance(transactions);
            return [{ accountId, balance }];
          })
        )
      );

      combineLatest(transactions$).subscribe((accountBalancesArrays) => {
        const allAccountBalances = accountBalancesArrays.flat();
        this.accountsBalancesSubject.next(allAccountBalances);

        const globalBalance = allAccountBalances.reduce(
          (acc, account) => acc + account.balance,
          0
        );
        this.globalBalanceSubject.next(globalBalance / 100);
      });
    });
  }

  getUserAccountIds(): Observable<string[]> {
    return this.withUserId((userId) =>
      runInInjectionContext(this.injector, () => {
        const collectionRef = collection(this.firestore, 'accounts');
        const q = query(collectionRef, where('userId', '==', userId));
        return collectionData(q, { idField: 'id' }).pipe(
          map((accounts) => {
            if (accounts.length > 0) {
              return accounts.map((account) => account.id);
            }
            return [];
          })
        );
      })
    );
  }

  getAllTransactionsForAccount(accountId: string): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      const collectionRef = collection(this.firestore, 'transactions');
      const q = query(collectionRef, where('accountId', '==', accountId));
      return collectionData(q, { idField: 'id' });
    });
  }

  calculateAccountBalance(transactions: TransactionModel[]): number {
    return transactions.reduce((balance, transaction) => {
      if (transaction.type === 'revenue') {
        return balance + transaction.amount;
      } else if (transaction.type === 'expense') {
        return balance - transaction.amount;
      }
      return balance;
    }, 0);
  }

  // Specific month and year balance

  getBalanceForMonthAndYear(month: number, year: number): Observable<number> {
    return this.getUserAccountIds().pipe(
      switchMap((accountIds) =>
        combineLatest(
          accountIds.map((accountId) =>
            this.getTransactionsForMonthAndYear(accountId, month, year).pipe(
              map((transactions) => this.calculateAccountBalance(transactions))
            )
          )
        )
      ),
      map((balances) => balances.reduce((total, balance) => total + balance, 0))
    );
  }

  private getTransactionsForMonthAndYear(
    accountId: string,
    month: number,
    year: number
  ): Observable<any[]> {
    return this.withUserId((userId) =>
      runInInjectionContext(this.injector, () => {
        const collectionRef = collection(this.firestore, 'transactions');

        const q = query(
          collectionRef,
          where('accountId', '==', accountId),
          where('userId', '==', userId),
          where('year', '==', year),
          where('month', '==', month)
        );

        return collectionData(q, { idField: 'id' });
      })
    );
  }
}
