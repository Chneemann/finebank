import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../../core/services/settings.service';
import { TransactionModel } from '../../../core/models/transactions.model';

export interface Months {
  name: string;
  value: number;
  disabled?: boolean;
}

export interface YearMonths {
  year: number;
  months: number[];
}

@Component({
  selector: 'app-month-year-picker',
  imports: [CommonModule, FormsModule],
  templateUrl: './month-year-picker.component.html',
  styleUrl: './month-year-picker.component.scss',
})
export class MonthYearPickerComponent implements OnChanges {
  @Input() selectedYear = 0;
  @Input() selectedMonth = 0;
  @Input() allTransactions: TransactionModel[] = [];

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

  constructor(private settingsService: SettingsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedYear'] || changes['selectedMonth']) {
      this.transferredYear = this.selectedYear;
    }
    if (changes['allTransactions']?.currentValue) {
      this.updateAvailableYearsAndMonths();
    }
  }

  private updateAvailableYearsAndMonths(): void {
    if (!this.allTransactions?.length) {
      this.yearsWithMonths = [];
      this.years = [];
      return;
    }

    const yearMonthMap = this.createYearMonthMap();
    this.mapYearsToMonths(yearMonthMap);
  }

  private createYearMonthMap(): Map<number, Set<number>> {
    const yearMonthMap = new Map<number, Set<number>>();

    for (const { year, month } of this.allTransactions) {
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
