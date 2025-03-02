import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { TransactionsService } from '../../core/services/transactions.service';
import { ButtonComponent } from '../../shared/components/layouts/button/button.component';
import { TransactionModel } from '../../core/models/transactions.model';
import { AccountModel } from '../../core/models/account.model';
import { AccountService } from '../../core/services/account.service';
import { MonthYearPickerComponent } from './month-year-picker/month-year-picker.component';
import { SettingsService } from '../../core/services/settings.service';
import { FilterTransactionsPipe } from '../../core/pipes/filter-transactions.pipe';

@Component({
  selector: 'app-transactions',
  imports: [
    ButtonComponent,
    CommonModule,
    MonthYearPickerComponent,
    FilterTransactionsPipe,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  @ViewChild(MonthYearPickerComponent)
  monthYearPickerComponent!: MonthYearPickerComponent;

  accountsData$!: Observable<AccountModel[]>;
  settingsData$!: Observable<any[]>;
  transactionsData$!: Observable<TransactionModel[]>;

  months: string[] = [
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
  noTransactionsAvailable: boolean = false;
  loadMoreDisabled: boolean = false;
  selectedType: 'all' | 'revenue' | 'expense' = 'all';
  limitTransactions: number = 1;
  selectedMonth: number = 0;
  selectedYear: number = 0;

  constructor(
    private transactionsService: TransactionsService,
    private accountService: AccountService,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.accountsData$ = this.accountService.getAllUserAccounts();
    this.transactionsData$ = this.loadTransactions();
  }

  private loadTransactions(): Observable<TransactionModel[]> {
    return this.settingsService.settingsData$.pipe(
      tap((settings) => this.setMonthAndYear(settings)),
      switchMap(() => this.fetchAndProcessTransactions()),
      tap((transactions) => this.updateFlags(transactions)),
      catchError((error) => {
        console.error('Error loading transactions:', error);
        return of([]);
      })
    );
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
  }

  private fetchAndProcessTransactions(): Observable<TransactionModel[]> {
    return combineLatest([
      this.transactionsService.getTransactionsByTypeAndMonthYearLimit(
        'revenue',
        this.selectedMonth,
        this.selectedYear,
        this.limitTransactions
      ),
      this.transactionsService.getTransactionsByTypeAndMonthYearLimit(
        'expense',
        this.selectedMonth,
        this.selectedYear,
        this.limitTransactions
      ),
    ]).pipe(
      map(([revenue, expenses]) =>
        [...revenue, ...expenses].map((tx) => new TransactionModel(tx))
      ),
      map((transactions) => transactions.sort((a, b) => b.date - a.date))
    );
  }

  private updateFlags(transactions: TransactionModel[]): void {
    this.noTransactionsAvailable = transactions.length === 0;
    this.loadMoreDisabled = transactions.length <= 8;
  }

  setFilter(type: 'all' | 'revenue' | 'expense') {
    this.selectedType = type;
  }

  get selectedMonthName(): string {
    return this.months[this.selectedMonth - 1];
  }

  toggleMonthYearPicker() {
    this.monthYearPickerComponent.toggleDatePicker();
  }
}
