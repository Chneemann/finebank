import { Component, ViewChild } from '@angular/core';
import { LineChartExpensesComponent } from './line-chart-expenses/line-chart-expenses.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../core/services/settings.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { BreakdownComponent } from './breakdown/breakdown.component';
import { MonthYearPickerComponent } from '../transactions/transactions-list/month-year-picker/month-year-picker.component';

@Component({
  selector: 'app-expenses',
  imports: [
    CommonModule,
    FormsModule,
    LineChartExpensesComponent,
    BreakdownComponent,
    MonthYearPickerComponent,
  ],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
})
export class ExpensesComponent {
  private destroy$ = new Subject<void>();

  @ViewChild(MonthYearPickerComponent)
  monthYearPickerComponent!: MonthYearPickerComponent;

  selectedYear: number = new Date().getFullYear();
  years: number[] = [2024, 2025];

  settingsData$!: Observable<any>;

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.settingsData$ = this.settingsService.settingsData$.pipe(
      takeUntil(this.destroy$)
    );
    this.getSelectedYear();
  }

  getSelectedYear() {
    this.settingsData$.subscribe((data) => {
      if (
        data &&
        data.selectedExpensesYear !== undefined &&
        data.selectedExpensesYear !== null
      ) {
        this.selectedYear = data.selectedExpensesYear;
      } else {
        this.selectedYear = new Date().getFullYear();
      }
    });
  }

  setSelectedYear(): void {
    this.settingsService
      .saveSettings('selectedExpensesYear', +this.selectedYear)
      .subscribe({
        error: (err) => console.error('Error updating year:', err),
      });
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

  toggleMonthYearPicker() {
    this.monthYearPickerComponent.toggleDatePicker();
  }
}
