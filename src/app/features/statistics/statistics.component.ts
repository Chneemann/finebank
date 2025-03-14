import { Component } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SettingsService } from '../../core/services/settings.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LineChartStatisticComponent } from './line-chart-statistic/line-chart-statistic.component';

@Component({
  selector: 'app-statistics',
  imports: [CommonModule, FormsModule, LineChartStatisticComponent],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent {
  private destroy$ = new Subject<void>();

  selectedYear: number = new Date().getFullYear();
  years: number[] = [2024, 2025];

  settingsData$!: Observable<any>;

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.settingsData$ = this.settingsService.settingsData$.pipe(
      takeUntil(this.destroy$)
    );
  }

  getSelectedYear() {
    this.settingsData$.subscribe((data) => {
      if (
        data &&
        data.selectedStatisticYear !== undefined &&
        data.selectedStatisticYear !== null
      ) {
        this.selectedYear = data.selectedStatisticYear;
      } else {
        this.selectedYear = new Date().getFullYear();
      }
    });
  }

  setSelectedYear(): void {
    this.settingsService
      .saveSettings('selectedStatisticYear', +this.selectedYear)
      .subscribe({
        error: (err) => console.error('Error updating year:', err),
      });
  }
}
