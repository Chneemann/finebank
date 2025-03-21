import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import {
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { TransactionsService } from '../../../core/services/transactions.service';
import { ButtonComponent } from '../../../shared/components/layouts/button/button.component';
import { TransactionModel } from '../../../core/models/transactions.model';
import { AccountModel } from '../../../core/models/account.model';
import { AccountService } from '../../../core/services/account.service';
import { MonthYearPickerComponent } from '../../../shared/components/month-year-picker/month-year-picker.component';
import { SettingsService } from '../../../core/services/settings.service';
import { FilterTransactionsPipe } from '../../../core/pipes/filter-transactions.pipe';
import { TRANSACTIONS_PER_PAGE } from '../../../core/config/settings';
import { Settings } from '../../../core/models/settings.interface';
import { HeadlineComponent } from '../../../shared/components/layouts/headline/headline.component';

@Component({
  selector: 'app-transactions-list',
  imports: [
    ButtonComponent,
    CommonModule,
    MonthYearPickerComponent,
    FilterTransactionsPipe,
    HeadlineComponent,
  ],
  templateUrl: './transactions-list.component.html',
  styleUrl: './transactions-list.component.scss',
})
export class TransactionsListComponent {
  @Input() headline: string = '';
  @Input() accountId: string = '';

  private destroy$ = new Subject<void>();
  accountsData$!: Observable<AccountModel[]>;
  settingsData$!: Observable<Settings>;
  transactionsData$!: Observable<TransactionModel[]>;

  isLoading: boolean = false;
  errorMessage: string = '';
  selectedType: 'all' | 'revenue' | 'expense' = 'all';
  limitTransactions: number = TRANSACTIONS_PER_PAGE;
  selectedMonth: number = 0;
  selectedYear: number = new Date().getFullYear();

  numberOfAllTransactions: any;

  constructor(
    private transactionsService: TransactionsService,
    private accountService: AccountService,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.initializeSettings();
    this.accountsData$ = this.accountService.getAllUserAccounts();
    this.transactionsData$ = this.loadTransactions();
  }

  initializeSettings() {
    this.settingsData$ = this.settingsService.settingsData$.pipe(
      takeUntil(this.destroy$),
      tap((settings) => {
        this.selectedMonth = this.getSettingsMonth(settings);
        this.selectedYear = this.getSettingsYear(settings);
      })
    );
  }

  getSettingsMonth(settings: Settings): number {
    return settings?.selectedPickerMonthYear
      ? parseInt(settings.selectedPickerMonthYear.slice(0, 2), 10)
      : 1;
  }

  getSettingsYear(settings: Settings): number {
    return settings?.selectedPickerMonthYear
      ? parseInt(settings.selectedPickerMonthYear.slice(2, 6), 10)
      : new Date().getFullYear();
  }

  private loadTransactions(): Observable<TransactionModel[]> {
    this.isLoading = true;
    return this.settingsData$.pipe(
      tap((settings) => this.setMonthAndYear(settings)),
      switchMap(() => this.fetchAndProcessTransactions()),
      tap(() => {
        this.isLoading = false;
        this.errorMessage = '';
      }),
      catchError(() => {
        this.isLoading = false;
        this.errorMessage = 'Error when loading the transactions';
        return of([]);
      })
    );
  }

  private loadNumberOfTransactions() {
    if (this.selectedMonth !== 0) {
      this.transactionsService
        .countAllTransactions(
          this.selectedMonth,
          this.selectedYear,
          this.accountId
        )
        .subscribe((count) => {
          this.numberOfAllTransactions = count;
        });
    }
  }

  private setMonthAndYear(settings: Settings): void {
    if (settings && settings.selectedPickerMonthYear) {
      const monthString = settings.selectedPickerMonthYear.slice(0, 2);
      this.selectedYear = parseInt(
        settings.selectedPickerMonthYear.slice(2, 6),
        10
      );

      if (monthString === '00') {
        this.selectedMonth = 0;
      } else {
        this.selectedMonth = parseInt(monthString, 10);
      }
    }
    this.loadNumberOfTransactions();
  }

  private fetchAndProcessTransactions(): Observable<TransactionModel[]> {
    const fetchTransactions = (type: string) => {
      return this.transactionsService.getTransactionsByFilters(
        type,
        this.selectedYear,
        this.limitTransactions,
        this.selectedMonth === 0 ? undefined : this.selectedMonth,
        this.accountId
      );
    };

    return combineLatest([
      fetchTransactions('revenue'),
      fetchTransactions('expense'),
    ]).pipe(
      map(([revenue, expense]) => [...revenue, ...expense]),
      map((transactions) => transactions.map((tx) => new TransactionModel(tx))),
      map((transactions) => transactions.sort((a, b) => b.added - a.added))
    );
  }

  setFilter(type: 'all' | 'revenue' | 'expense') {
    this.selectedType = type;
  }

  trackByTransactionId(transaction: TransactionModel): string {
    return transaction.id || 'unknown';
  }

  loadMoreTransactions() {
    this.limitTransactions += TRANSACTIONS_PER_PAGE;
    this.transactionsData$ = this.loadTransactions();
  }
}
