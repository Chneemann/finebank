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

  selectedMonth: number = 0;
  selectedYear: number = new Date().getFullYear();

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
          this.setMonthAndYear(settings);

          return this.transactionsService.getLastTransactionsByCategories(
            categories,
            this.selectedMonth,
            this.selectedYear
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

  private setMonthAndYear(settings: any): void {
    if (settings && settings.selectedTransactionPeriod) {
      const monthString = settings.selectedTransactionPeriod.slice(0, 2);
      this.selectedYear = parseInt(
        settings.selectedTransactionPeriod.slice(2, 6),
        10
      );

      if (monthString === '00') {
        this.selectedMonth = 0;
      } else {
        this.selectedMonth = parseInt(monthString, 10);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
