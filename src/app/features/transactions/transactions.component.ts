import { Component } from '@angular/core';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';

@Component({
  selector: 'app-transactions',
  imports: [TransactionsListComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  headline = 'Transaction History';
  accountId = '';
}
