import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { TransactionsService } from '../../services/transactions.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions-card',
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './transactions-card.component.html',
  styleUrl: './transactions-card.component.scss',
})
export class TransactionsCardComponent implements OnInit {
  transactionsData$!: Observable<any[]>;

  constructor(
    private transactionsService: TransactionsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadFilteredTransactions();
  }

  private loadFilteredTransactions() {
    this.transactionsData$ = this.route.url.pipe(
      map((segments) => segments.map((s) => s.path).join('/')),
      switchMap((path) => {
        const type = path.includes('revenue')
          ? 'revenue'
          : path.includes('expenses')
          ? 'expense'
          : null;

        return this.transactionsService.getLastTransactions(type);
      })
    );
  }
}
