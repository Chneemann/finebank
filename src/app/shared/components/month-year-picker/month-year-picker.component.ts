import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../../core/services/settings.service';
import { TransactionsService } from '../../../core/services/transactions.service';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

interface Months {
  name: string;
  value: number;
  disabled?: boolean;
}

interface YearMonths {
  year: number;
  months: number[];
}

@Component({
  selector: 'app-month-year-picker',
  imports: [CommonModule, FormsModule],
  templateUrl: './month-year-picker.component.html',
  styleUrls: ['./month-year-picker.component.scss'],
})
export class MonthYearPickerComponent {
  @Input() accountId: string = '';
  @Input() transactionTypeFilter: string | undefined = undefined;
  @Input() hideSelectAllMonths: boolean = false;

  private destroy$ = new Subject<void>();
  settingsData$!: Observable<any>;

  years: number[] = [];
  months: Months[] = [
    { name: 'Jan', value: 1 },
    { name: 'Feb', value: 2 },
    { name: 'Mar', value: 3 },
    { name: 'Apr', value: 4 },
    { name: 'May', value: 5 },
    { name: 'Jun', value: 6 },
    { name: 'Jul', value: 7 },
    { name: 'Aug', value: 8 },
    { name: 'Sep', value: 9 },
    { name: 'Oct', value: 10 },
    { name: 'Nov', value: 11 },
    { name: 'Dec', value: 12 },
  ];

  pickerOpen = false;
  yearSelected = false;
  confirmedDate: Date | null = null;
  filteredMonths: Months[] = [];
  yearsWithMonths: YearMonths[] = [];

  selectedMonth = 1;
  selectedYear = new Date().getFullYear();
  transferredYear = 0;

  constructor(
    private settingsService: SettingsService,
    private transactionsService: TransactionsService
  ) {}

  ngOnInit() {
    this.initializeSettings();
  }

  initializeSettings() {
    this.settingsData$ = this.settingsService.settingsData$.pipe(
      takeUntil(this.destroy$),
      tap((settings) => {
        this.selectedMonth = this.getSettingsMonth(settings);
        this.selectedYear = this.getSettingsYear(settings);
        this.transferredYear = this.getSettingsYear(settings);
        this.getTransactionPeriods();
      })
    );
  }

  getTransactionPeriods() {
    const validTypes: ('expense' | 'revenue')[] = ['expense', 'revenue'];
    const typeFilter = validTypes.includes(this.transactionTypeFilter as any)
      ? (this.transactionTypeFilter as 'expense' | 'revenue')
      : undefined;

    this.transactionsService
      .getTransactionPeriods(this.accountId, typeFilter)
      .subscribe((periods: string[]) => {
        const yearMonthMap = this.createYearMonthMap(periods);
        this.mapYearsToMonths(yearMonthMap);
      });
  }

  private createYearMonthMap(periods: string[]): Map<number, Set<number>> {
    const yearMonthMap = new Map<number, Set<number>>();

    for (const period of periods) {
      const month = parseInt(period.substring(0, 2), 10);
      const year = parseInt(period.substring(2), 10);
      if (!yearMonthMap.has(year)) {
        yearMonthMap.set(year, new Set());
      }
      yearMonthMap.get(year)?.add(month);
    }

    return yearMonthMap;
  }

  private mapYearsToMonths(yearMonthMap: Map<number, Set<number>>): void {
    this.yearsWithMonths = Array.from(yearMonthMap.entries()).map(
      ([year, months]) => ({
        year,
        months: Array.from(months).sort((a, b) => a - b),
      })
    );

    this.years = this.yearsWithMonths
      .map(({ year }) => year)
      .sort((a, b) => a - b);

    if (this.selectedMonth === 0 && this.hideSelectAllMonths) {
      const lastEntry = this.yearsWithMonths[this.yearsWithMonths.length - 1];
      this.selectedYear = lastEntry.year;
      this.transferredYear = lastEntry.year;
      this.selectedMonth = lastEntry.months[lastEntry.months.length - 1];
      this.handleMonthSelection(this.selectedMonth);
      this.toggleDatePicker();
    }
  }

  private updateFilteredMonths(): void {
    const availableMonths =
      this.yearsWithMonths.find(({ year }) => year === this.selectedYear)
        ?.months || [];
    this.filteredMonths = this.months.map((month) => ({
      ...month,
      disabled: !availableMonths.includes(month.value),
    }));
  }

  handleYearSelection(year: number): void {
    this.yearSelected = true;
    this.selectedYear = year;
    this.confirmedDate = null;
    this.updateFilteredMonths();
  }

  handleMonthSelection(month: number): void {
    this.selectedMonth = month;
    if (this.selectedYear && this.selectedMonth) {
      this.confirmedDate = new Date(
        this.selectedYear,
        this.selectedMonth - 1,
        1
      );
      const formattedDate = `${String(this.selectedMonth).padStart(2, '0')}${
        this.selectedYear
      }`;
      this.settingsService
        .saveSettings('selectedPickerMonthYear', formattedDate)
        .subscribe({
          error: (err: string) =>
            console.error('Failed to update settings:', err),
        });
    }
    this.toggleDatePicker();
  }

  handleSelectAllMonths(): void {
    const formattedDate = `00${this.selectedYear}`;
    this.settingsService
      .saveSettings('selectedPickerMonthYear', formattedDate)
      .subscribe({
        error: (err: string) =>
          console.error('Failed to update settings:', err),
      });
    this.toggleDatePicker();
  }

  toggleDatePicker(): void {
    this.yearSelected = false;
    this.pickerOpen = !this.pickerOpen;
  }

  getSettingsMonth(settings: any): number {
    return settings?.selectedPickerMonthYear
      ? parseInt(settings.selectedPickerMonthYear.slice(0, 2), 10)
      : 1;
  }

  getSettingsMonthName(settings: any): string {
    const month = settings?.selectedPickerMonthYear
      ? parseInt(settings.selectedPickerMonthYear.slice(0, 2), 10)
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
    return settings?.selectedPickerMonthYear
      ? parseInt(settings.selectedPickerMonthYear.slice(2, 6), 10)
      : new Date().getFullYear();
  }
}
