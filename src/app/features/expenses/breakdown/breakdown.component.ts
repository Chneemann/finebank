import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TransactionsService } from '../../../core/services/transactions.service';
import {
  catchError,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { TransactionModel } from '../../../core/models/transactions.model';
import { SettingsService } from '../../../core/services/settings.service';

@Component({
  selector: 'app-breakdown',
  imports: [CommonModule],
  templateUrl: './breakdown.component.html',
  styleUrl: './breakdown.component.scss',
})
export class BreakdownComponent implements OnInit {
  private destroy$ = new Subject<void>();

  settingsData$!: Observable<any>;
  transactionsData$!: Observable<
    { category: string; transactions: TransactionModel[] }[]
  >;

  constructor(
    private transactionsService: TransactionsService,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.settingsData$ = this.settingsService.settingsData$;
    this.loadTransactions();
  }

  private loadTransactions() {
    const categories = [
      'Housing',
      'Food',
      'Transportation',
      'Entertainment',
      'Shopping',
      'Others',
    ];

    this.transactionsData$ = this.settingsData$.pipe(
      takeUntil(this.destroy$),
      switchMap((settings) => {
        if (settings?.selectedExpensesYear != null) {
          const selectedYear = settings.selectedExpensesYear;
          return this.transactionsService.getLastTransactionsByCategories(
            categories,
            selectedYear
          );
        } else {
          return of([]);
        }
      }),
      catchError((err) => {
        console.error('Error when retrieving transactions:', err);
        return of([]);
      })
    );
  }
}
