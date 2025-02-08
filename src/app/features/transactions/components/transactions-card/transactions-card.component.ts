import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { TransactionsService } from '../../services/transactions.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions-card',
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './transactions-card.component.html',
  styleUrl: './transactions-card.component.scss',
})
export class TransactionsCardComponent {
  transactionsData$!: Observable<any>;

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit() {
    this.loadLastTransactions();
  }

  private loadLastTransactions() {
    this.transactionsData$ = this.transactionsService.getLastTransactions();
  }
}
