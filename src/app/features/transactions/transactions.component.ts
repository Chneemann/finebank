import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { catchError, combineLatest, map, Observable, of } from 'rxjs';
import { TransactionsService } from '../../core/services/transactions.service';
import { ButtonComponent } from '../../shared/components/layouts/button/button.component';
import { TransactionModel } from '../../core/models/transactions.model';
import { AccountModel } from '../../core/models/account.model';
import { AccountService } from '../../core/services/account.service';
import { BalancesService } from '../../core/services/balances.service';

@Component({
  selector: 'app-transactions',
  imports: [ButtonComponent, CommonModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  accountsData$!: Observable<AccountModel[]>;
  transactionsData$!: Observable<TransactionModel[]>;
  selectedType: 'all' | 'revenue' | 'expense' = 'all';

  constructor(
    private transactionsService: TransactionsService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.loadAllTransactions();
    this.accountsData$ = this.accountService.getAllUserAccounts();
  }

  private loadAllTransactions() {
    this.transactionsData$ = combineLatest([
      this.transactionsService.getAllTransactionsByType('revenue'),
      this.transactionsService.getAllTransactionsByType('expense'),
    ]).pipe(
      map(([revenue, expenses]) => {
        const transactions = [...revenue, ...expenses];
        return transactions.map((tx) => new TransactionModel(tx));
      })
    );
  }

  getFilteredTransactions(
    transactions: TransactionModel[]
  ): TransactionModel[] {
    let filteredTransactions = transactions;

    if (this.selectedType !== 'all') {
      filteredTransactions = transactions.filter(
        (tx) => tx.type === this.selectedType
      );
    }

    return filteredTransactions.sort((a, b) => b.date - a.date);
  }

  setFilter(type: 'all' | 'revenue' | 'expense') {
    this.selectedType = type;
  }
}
