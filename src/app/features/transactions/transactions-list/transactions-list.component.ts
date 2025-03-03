import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { TransactionsService } from '../../../core/services/transactions.service';
import { ButtonComponent } from '../../../shared/components/layouts/button/button.component';
import { TransactionModel } from '../../../core/models/transactions.model';
import { AccountModel } from '../../../core/models/account.model';
import { AccountService } from '../../../core/services/account.service';
import { MonthYearPickerComponent } from './month-year-picker/month-year-picker.component';
import { SettingsService } from '../../../core/services/settings.service';
import { FilterTransactionsPipe } from '../../../core/pipes/filter-transactions.pipe';
import { TRANSACTIONS_PER_PAGE } from '../../../core/config/settings';

@Component({
  selector: 'app-transactions-list',
  imports: [
    ButtonComponent,
    CommonModule,
    MonthYearPickerComponent,
    FilterTransactionsPipe,
  ],
  templateUrl: './transactions-list.component.html',
  styleUrl: './transactions-list.component.scss',
})
export class TransactionsListComponent {
  @Input() headline: string = '';
  @Input() accountId: string = '';

  @ViewChild(MonthYearPickerComponent)
  monthYearPickerComponent!: MonthYearPickerComponent;

  accountsData$!: Observable<AccountModel[]>;
  settingsData$!: Observable<any>;
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
    this.settingsData$ = this.settingsService.settingsData$;
    this.accountsData$ = this.accountService.getAllUserAccounts();
    this.transactionsData$ = this.loadTransactions();
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

  private setMonthAndYear(settings: any): void {
    if (settings && settings.selectedTransactionPeriod) {
      this.selectedMonth = parseInt(
        settings.selectedTransactionPeriod.slice(0, 2),
        10
      );
      this.selectedYear = parseInt(
        settings.selectedTransactionPeriod.slice(2, 6),
        10
      );
    }
    this.loadNumberOfTransactions();
  }

  private fetchAndProcessTransactions(): Observable<TransactionModel[]> {
    return this.transactionsService
      .getTransactionsByTypeAndMonthYearLimit(
        'revenue',
        this.selectedMonth,
        this.selectedYear,
        this.limitTransactions,
        this.accountId
      )
      .pipe(
        switchMap((revenue) =>
          this.transactionsService
            .getTransactionsByTypeAndMonthYearLimit(
              'expense',
              this.selectedMonth,
              this.selectedYear,
              this.limitTransactions,
              this.accountId
            )
            .pipe(
              map((expenses) => [...revenue, ...expenses]),
              map((transactions) =>
                transactions.map((tx) => new TransactionModel(tx))
              ),
              map((transactions) =>
                transactions.sort((a, b) => b.date - a.date)
              )
            )
        )
      );
  }

  setFilter(type: 'all' | 'revenue' | 'expense') {
    this.selectedType = type;
  }

  trackByTransactionId(transaction: TransactionModel): string {
    return transaction.id || 'unknown';
  }

  getSettingsMonth(settings: any): number {
    return settings?.selectedTransactionPeriod
      ? parseInt(settings.selectedTransactionPeriod.slice(0, 2), 10)
      : 1;
  }

  getSettingsMonthName(settings: any): string {
    const month = settings?.selectedTransactionPeriod
      ? parseInt(settings.selectedTransactionPeriod.slice(0, 2), 10)
      : 1;
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return monthNames[month - 1];
  }

  getSettingsYear(settings: any): number {
    return settings?.selectedTransactionPeriod
      ? parseInt(settings.selectedTransactionPeriod.slice(2, 6), 10)
      : new Date().getFullYear();
  }

  loadMoreTransactions() {
    this.limitTransactions += TRANSACTIONS_PER_PAGE;
    this.transactionsData$ = this.loadTransactions();
  }

  toggleMonthYearPicker() {
    this.monthYearPickerComponent.toggleDatePicker();
  }
}
