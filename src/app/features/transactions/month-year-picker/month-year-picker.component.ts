import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../../core/services/settings.service';
import { TransactionsService } from '../../../core/services/transactions.service';

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
export class MonthYearPickerComponent implements OnChanges {
  @Input() selectedMonth: number = 1;
  @Input() selectedYear: number = new Date().getFullYear();

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
  transferredYear = 0;
  confirmedDate: Date | null = null;
  filteredMonths: Months[] = [];
  yearsWithMonths: YearMonths[] = [];

  constructor(
    private settingsService: SettingsService,
    private transactionsService: TransactionsService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedYear'] || changes['selectedMonth']) {
      this.transferredYear = this.selectedYear;
    }
    this.getAllAccountsTransactionsPeriods();
  }

  getAllAccountsTransactionsPeriods() {
    this.transactionsService
      .getAllAccountsTransactionsPeriods()
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
        .saveSettings('selectedTransactionPeriod', formattedDate)
        .subscribe({
          error: (err: string) =>
            console.error('Failed to update settings:', err),
        });
    }
    this.toggleDatePicker();
  }

  toggleDatePicker(): void {
    this.yearSelected = false;
    this.pickerOpen = !this.pickerOpen;
  }
}
