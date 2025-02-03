import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionsService } from './services/transactions.service';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  transactionsData$!: Observable<any>;

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit() {
    this.loadAllTransactions();
  }

  private loadAllTransactions() {
    this.transactionsData$ = this.transactionsService.getAllTransactions();
  }
}
