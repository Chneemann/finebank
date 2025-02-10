import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
} from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { AccountModel } from '../../../core/models/account.model';
import { TransactionModel } from '../../../core/models/transactions.model';

@Injectable({
  providedIn: 'root',
})
export class BalancesService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);

  private currentGlobalBalanceSubject = new BehaviorSubject<number>(0);
  private currentIndividualBalanceSubject = new BehaviorSubject<number>(0);

  currentGlobalBalance$ = this.currentGlobalBalanceSubject.asObservable();
  currentIndividualBalance$ =
    this.currentIndividualBalanceSubject.asObservable();

  getAllAccounts(): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      const collectionRef = collection(this.firestore, 'accounts');
      return collectionData(collectionRef, { idField: 'id' });
    });
  }

  getAllTransactions(): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      const collectionRef = collection(this.firestore, 'transactions');
      return collectionData(collectionRef, { idField: 'id' });
    });
  }

  // Global Balance Berechnung
  calculateGlobalBalance(transactions: TransactionModel[]): void {
    let balance = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === 'revenue') {
        balance += transaction.amount / 100;
      } else if (transaction.type === 'expense') {
        balance -= transaction.amount / 100;
      }
    });
    this.currentGlobalBalanceSubject.next(balance);
  }

  // Individuellen Saldo für ein Konto berechnen
  calculateIndividualBalance(
    transactions: TransactionModel[],
    account: AccountModel
  ): void {
    let balance = 0;
    transactions.forEach((transaction) => {
      if (transaction.accountId === account.id) {
        if (transaction.type === 'revenue') {
          balance += transaction.amount / 100;
        } else if (transaction.type === 'expense') {
          balance -= transaction.amount / 100;
        }
      }
    });
    this.currentIndividualBalanceSubject.next(balance);
  }
}
