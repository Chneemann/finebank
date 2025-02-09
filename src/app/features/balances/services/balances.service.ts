import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
} from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BalancesService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);

  getAllAccounts(): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      const collectionRef = collection(this.firestore, 'accounts');
      return collectionData(collectionRef, { idField: 'id' });
    });
  }

  // Calculation of the global balance
  calculateGlobalBalance(transactions: any[]): number {
    let balance = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === 'revenue') {
        balance += transaction.amount / 100;
      } else if (transaction.type === 'expense') {
        balance -= transaction.amount / 100;
      }
    });
    return balance;
  }

  // Calculation of the individual balance for an account
  calculateIndividualBalance(transactions: any[], account: any): number {
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

    return balance;
  }
}
