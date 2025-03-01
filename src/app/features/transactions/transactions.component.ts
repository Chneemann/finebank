import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { TransactionsService } from '../../core/services/transactions.service';
import { ButtonComponent } from '../../shared/components/layouts/button/button.component';
import { TransactionModel } from '../../core/models/transactions.model';
import { AccountModel } from '../../core/models/account.model';
import { AccountService } from '../../core/services/account.service';
import { MonthYearPickerComponent } from '../../shared/components/month-year-picker/month-year-picker.component';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-transactions',
  imports: [ButtonComponent, CommonModule, MonthYearPickerComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  @ViewChild(MonthYearPickerComponent)
  monthYearPickerComponent!: MonthYearPickerComponent;

  accountsData$!: Observable<AccountModel[]>;
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
  selectedType: 'all' | 'revenue' | 'expense' = 'all';
  selectedMonth: number = 0;
  selectedYear: number = 0;

  constructor(
    private transactionsService: TransactionsService,
    private accountService: AccountService,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.loadAllTransactions();
    this.loadTransactionPeriodSettings();
    this.accountsData$ = this.accountService.getAllUserAccounts();
  }

  private loadAllTransactions() {
    this.transactionsData$ = combineLatest([
      this.transactionsService.getAllTransactionsByType('revenue'),
      this.transactionsService.getAllTransactionsByType('expense'),
    ]).pipe(
      map(([revenue, expenses]) => {
        const transactions = [...revenue, ...expenses];
        return transactions.map((tx) => new TransactionModel(tx));
      })
    );
  }

  loadTransactionPeriodSettings() {
    this.settingsService.getAllSettings().subscribe((settings) => {
      this.selectedMonth = parseInt(
        settings.selectedTransactionPeriod.slice(0, 2),
        10
      );
      this.selectedYear = parseInt(
        settings.selectedTransactionPeriod.slice(2, 6),
        10
      );
    });
  }

  getFilteredTransactions(
    transactions: TransactionModel[]
  ): TransactionModel[] {
    let filteredTransactions = transactions;

    if (this.selectedType !== 'all') {
      filteredTransactions = transactions.filter(
        (tx) => tx.type === this.selectedType
      );
    }

    return filteredTransactions.sort((a, b) => b.date - a.date);
  }

  setFilter(type: 'all' | 'revenue' | 'expense') {
    this.selectedType = type;
  }

  get selectedMonthName(): string {
    return this.months[this.selectedMonth - 1];
  }

  toggleMonthYearPicker() {
    this.monthYearPickerComponent.togglePicker();
  }
}
