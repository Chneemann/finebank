import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../../core/services/settings.service';

@Component({
  selector: 'app-month-year-picker',
  imports: [CommonModule, FormsModule],
  templateUrl: './month-year-picker.component.html',
  styleUrl: './month-year-picker.component.scss',
})
export class MonthYearPickerComponent implements OnInit {
  @Input() selectedYear: number = 0;
  @Input() selectedMonth: number = 0;

  years: number[] = [];
  months: { name: string; value: number }[] = [
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

  confirmedDate: Date | null = null;

  yearSelected: boolean = false;
  filteredMonths: { name: string; value: number; disabled: boolean }[] = [];
  availableYears = [2020, 2021, 2022, 2023, 2024, 2025];

  pickerOpen: boolean = true;

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.generateYears();
    this.loadDate();
  }

  loadDate() {
    const serverResponse = {
      year: this.selectedYear,
      month: this.selectedMonth,
    };

    this.selectedYear = serverResponse.year;
    this.selectedMonth = serverResponse.month;

    this.onMonthSelect(this.selectedMonth ?? 0);
  }

  generateYears() {
    this.years = this.availableYears;
  }

  onYearSelect(year: number) {
    this.selectedYear = year;
    this.yearSelected = true;
    this.confirmedDate = null;
    this.filterMonths();
  }

  filterMonths() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (this.selectedYear === currentYear) {
      this.filteredMonths = this.months.map((month) => ({
        ...month,
        disabled: month.value > currentMonth,
      }));
    } else {
      this.filteredMonths = this.months.map((month) => ({
        ...month,
        disabled: false,
      }));
    }
  }

  onMonthSelect(month: number) {
    this.selectedMonth = month;
    if (this.selectedYear && this.selectedMonth) {
      this.confirmedDate = new Date(
        this.selectedYear,
        this.selectedMonth - 1,
        1
      );
      const formattedDate =
        this.selectedMonth < 10
          ? `0${this.selectedMonth}${this.selectedYear}`
          : `${this.selectedMonth}${this.selectedYear}`;
      this.settingsService
        .saveSettings('selectedTransactionPeriod', formattedDate)
        .subscribe({
          error: (err) => console.error('Failed to update settings:', err),
        });
    }

    this.togglePicker();
  }

  togglePicker() {
    this.yearSelected = false;
    this.pickerOpen = !this.pickerOpen;
  }
}
