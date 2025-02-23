import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { TransactionsService } from '../../core/services/transactions.service';
import { ButtonComponent } from '../../shared/components/layouts/button/button.component';
import { TransactionModel } from '../../core/models/transactions.model';

@Component({
  selector: 'app-transactions',
  imports: [ButtonComponent, CommonModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  transactionsData$!: Observable<TransactionModel[]>;
  selectedType: 'all' | 'revenue' | 'expense' = 'all';

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit() {
    this.loadAllTransactions();
  }

  private loadAllTransactions() {
    this.transactionsData$ = combineLatest([
      this.transactionsService.getAllTransactionsByType('revenue'),
      this.transactionsService.getAllTransactionsByType('expense'),
    ]).pipe(
      map(([revenue, expenses]) => {
        const transactions = [...revenue, ...expenses];
        return transactions.map(
          (tx) =>
            new TransactionModel(
              tx.accountId,
              tx.item,
              tx.shop,
              tx.type,
              tx.amount,
              tx.date,
              tx.month,
              tx.year,
              tx.id
            )
        );
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
