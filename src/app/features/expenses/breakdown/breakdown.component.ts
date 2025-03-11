import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TransactionsService } from '../../../core/services/transactions.service';
import { Observable } from 'rxjs';
import { TransactionModel } from '../../../core/models/transactions.model';

@Component({
  selector: 'app-breakdown',
  imports: [CommonModule],
  templateUrl: './breakdown.component.html',
  styleUrl: './breakdown.component.scss',
})
export class BreakdownComponent {
  transactionsData$!: Observable<
    { category: string; transactions: TransactionModel[] }[]
  >;

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit() {
    const categories = [
      'Housing',
      'Food',
      'Transportation',
      'Entertainment',
      'Shopping',
      'Others',
    ];
    this.transactionsData$ =
      this.transactionsService.getLastTransactionsByCategories(categories);
  }
}
