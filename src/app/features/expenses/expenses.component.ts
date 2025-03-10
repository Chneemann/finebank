import { Component } from '@angular/core';
import { LineChartExpensesComponent } from './line-chart-expenses/line-chart-expenses.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../core/services/settings.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { BreakdownComponent } from './breakdown/breakdown.component';

@Component({
  selector: 'app-expenses',
  imports: [
    CommonModule,
    FormsModule,
    LineChartExpensesComponent,
    BreakdownComponent,
  ],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
})
export class ExpensesComponent {
  private destroy$ = new Subject<void>();

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
}
