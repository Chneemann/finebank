import { Component, OnInit } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { TransactionsService } from '../../../core/services/transactions.service';
import { CommonModule } from '@angular/common';
import { TransactionModel } from '../../../core/models/transactions.model';

@Component({
  selector: 'app-transactions-overview-card',
  imports: [CommonModule],
  templateUrl: './transactions-overview-card.component.html',
  styleUrls: ['./transactions-overview-card.component.scss'],
})
export class TransactionsOverviewCardComponent implements OnInit {
  transactionsData$!: Observable<TransactionModel[]>;
  transactionFetchLimit: number = 5;
  selectedType: 'all' | 'revenue' | 'expense' = 'all';

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit() {
    this.loadLastTransactions();
  }

  private loadLastTransactions() {
    this.transactionsData$ = combineLatest([
      this.transactionsService.getLastTransactionsByType(
        'revenue',
        this.transactionFetchLimit
      ),
      this.transactionsService.getLastTransactionsByType(
        'expense',
        this.transactionFetchLimit
      ),
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
      filteredTransactions = filteredTransactions.filter(
        (tx) => tx.type === this.selectedType
      );
    }

    return filteredTransactions
      .slice(0, this.transactionFetchLimit)
      .sort((a, b) => b.added - a.added);
  }

  setFilter(type: 'all' | 'revenue' | 'expense') {
    this.selectedType = type;
  }
}
