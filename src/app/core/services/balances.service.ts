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
import { BehaviorSubject, Observable, switchMap, combineLatest } from 'rxjs';
import { TransactionModel } from '../models/transactions.model';

@Injectable({
  providedIn: 'root',
})
export class BalancesService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);

  private globalBalanceSubject = new BehaviorSubject<number>(0);
  private accountsBalancesSubject = new BehaviorSubject<
    { accountId: string; balance: number }[]
  >([]);

  globalBalance$ = this.globalBalanceSubject.asObservable();
  accountsBalances$ = this.accountsBalancesSubject.asObservable();

  constructor() {
    this.loadBalances('lsui7823kmbndks9037hjdsd'); // TODO: Placeholder
  }

  private loadBalances(currentUserId: string): void {
    this.getUserAccountIds(currentUserId).subscribe((accountIds) => {
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

  getAllAccounts(): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      const collectionRef = collection(this.firestore, 'accounts');
      return collectionData(collectionRef, { idField: 'id' });
    });
  }

  getUserAccountIds(currentUserId: string): Observable<string[]> {
    return runInInjectionContext(this.injector, () => {
      const collectionRef = collection(this.firestore, 'accounts');
      const q = query(collectionRef, where('userId', '==', currentUserId));
      return collectionData(q, { idField: 'id' }).pipe(
        switchMap((accounts) => {
          if (accounts.length > 0) {
            return [accounts.map((account) => account.id)];
          } else {
            throw new Error('Kein Account gefunden');
          }
        })
      );
    });
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
}
