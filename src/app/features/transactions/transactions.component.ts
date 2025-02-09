import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TransactionsService } from './services/transactions.service';
import { ButtonComponent } from '../../shared/components/layouts/button/button.component';
import { RouterLink, RouterModule } from '@angular/router';
import { TransactionModel } from '../../core/models/transactions.model';

@Component({
  selector: 'app-transactions',
  imports: [RouterLink, RouterModule, ButtonComponent, CommonModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  transactionsData$!: Observable<TransactionModel[]>;

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit() {
    this.loadAllTransactions();
  }

  private loadAllTransactions() {
    this.transactionsData$ = this.transactionsService
      .getAllTransactions()
      .pipe(
        map((transactions) =>
          transactions.map(
            (tx) =>
              new TransactionModel(
                tx.accountId,
                tx.item,
                tx.shop,
                tx.type,
                tx.amount,
                tx.date,
                tx.id
              )
          )
        )
      );
  }
}
