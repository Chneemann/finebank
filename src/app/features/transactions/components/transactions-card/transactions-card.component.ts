import { Component, OnInit } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { TransactionsService } from '../../services/transactions.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions-card',
  imports: [CommonModule],
  templateUrl: './transactions-card.component.html',
  styleUrl: './transactions-card.component.scss',
})
export class TransactionsCardComponent implements OnInit {
  transactionsData$!: Observable<any[]>;
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
    ]).pipe(map(([revenue, expenses]) => [...revenue, ...expenses]));
  }

  getFilteredTransactions(transactions: any[]): any[] {
    if (this.selectedType === 'all') {
      return transactions.slice(0, this.transactionFetchLimit);
    }
    return transactions.filter((tx) => tx.type === this.selectedType);
  }

  setFilter(type: 'all' | 'revenue' | 'expense') {
    this.selectedType = type;
  }
}
