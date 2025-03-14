import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../core/services/settings.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { BreakdownComponent } from './breakdown/breakdown.component';
import { MonthYearPickerComponent } from '../transactions/transactions-list/month-year-picker/month-year-picker.component';

@Component({
  selector: 'app-expenses',
  imports: [CommonModule, BreakdownComponent, MonthYearPickerComponent],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
})
export class ExpensesComponent {
  private destroy$ = new Subject<void>();

  @ViewChild(MonthYearPickerComponent)
  monthYearPickerComponent!: MonthYearPickerComponent;

  settingsData$!: Observable<any>;

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.settingsData$ = this.settingsService.settingsData$.pipe(
      takeUntil(this.destroy$)
    );
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
