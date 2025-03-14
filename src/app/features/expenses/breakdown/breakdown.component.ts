import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class BreakdownComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  settingsData$!: Observable<any>;
  transactionsData$!: Observable<
    { category: string; transactions: TransactionModel[] }[]
  >;
  totalTransactionsData$!: Observable<
    { category: string; totalAmount: number }[]
  >;

  selectedMonth = 0;
  selectedYear = new Date().getFullYear();

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

    this.transactionsData$ = this.loadData(
      categories,
      this.transactionsService.getTransactionsByCategory,
      2
    );
    this.totalTransactionsData$ = this.loadData(
      categories,
      this.transactionsService.getTotalAmountByCategory
    );
  }

  private loadData<T>(
    categories: string[],
    dataFn: (
      categories: string[],
      month: number,
      year: number,
      limit?: number
    ) => Observable<T>,
    limit?: number
  ): Observable<T> {
    return this.settingsData$.pipe(
      takeUntil(this.destroy$),
      switchMap((settings) => {
        if (!settings?.selectedExpensesYear) {
          return of([] as T);
        }

        this.setMonthAndYear(settings);
        return dataFn.call(
          this.transactionsService,
          categories,
          this.selectedMonth,
          this.selectedYear,
          limit
        );
      }),
      catchError((err) => {
        console.error('Error loading data:', err);
        return of([] as T);
      })
    );
  }

  private setMonthAndYear(settings: any): void {
    if (settings?.selectedTransactionPeriod) {
      const monthString = settings.selectedTransactionPeriod.slice(0, 2);
      this.selectedYear = parseInt(
        settings.selectedTransactionPeriod.slice(2, 6),
        10
      );
      this.selectedMonth = monthString === '00' ? 0 : parseInt(monthString, 10);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
