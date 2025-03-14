import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BalancesService } from '../../../core/services/balances.service';
import { CommonModule } from '@angular/common';
import {
  catchError,
  firstValueFrom,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { SettingsService } from '../../../core/services/settings.service';

@Component({
  selector: 'app-line-chart-statistic',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './line-chart-statistic.component.html',
  styleUrl: './line-chart-statistic.component.scss',
})
export class LineChartStatisticComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() view: [number, number] = [0, 0];

  settingsData$!: Observable<any>;

  hasData = false;
  selectedYear: number = 0;
  saleData = [
    {
      name: 'Jan',
      series: [
        { name: 'Revenue', value: 0 },
        { name: 'Expense', value: 0 },
      ],
    },
    {
      name: 'Feb',
      series: [
        { name: 'Revenue', value: 0 },
        { name: 'Expense', value: 0 },
      ],
    },
    {
      name: 'Mar',
      series: [
        { name: 'Revenue', value: 0 },
        { name: 'Expense', value: 0 },
      ],
    },
    {
      name: 'Apr',
      series: [
        { name: 'Revenue', value: 0 },
        { name: 'Expense', value: 0 },
      ],
    },
    {
      name: 'May',
      series: [
        { name: 'Revenue', value: 0 },
        { name: 'Expense', value: 0 },
      ],
    },
    {
      name: 'Jun',
      series: [
        { name: 'Revenue', value: 0 },
        { name: 'Expense', value: 0 },
      ],
    },
    {
      name: 'Jul',
      series: [
        { name: 'Revenue', value: 0 },
        { name: 'Expense', value: 0 },
      ],
    },
    {
      name: 'Aug',
      series: [
        { name: 'Revenue', value: 0 },
        { name: 'Expense', value: 0 },
      ],
    },
    {
      name: 'Sep',
      series: [
        { name: 'Revenue', value: 0 },
        { name: 'Expense', value: 0 },
      ],
    },
    {
      name: 'Oct',
      series: [
        { name: 'Revenue', value: 0 },
        { name: 'Expense', value: 0 },
      ],
    },
    {
      name: 'Nov',
      series: [
        { name: 'Revenue', value: 0 },
        { name: 'Expense', value: 0 },
      ],
    },
    {
      name: 'Dec',
      series: [
        { name: 'Revenue', value: 0 },
        { name: 'Expense', value: 0 },
      ],
    },
  ];

  constructor(
    private balancesService: BalancesService,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.settingsData$ = this.settingsService.settingsData$;
    this.initializeSettings();
  }

  initializeSettings() {
    this.settingsData$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((settings) => {
          if (settings?.selectedExpensesYear != null) {
            this.selectedYear = settings.selectedExpensesYear;
            this.loadYearlyBalances();
            return of(settings);
          } else {
            return of([]);
          }
        }),
        catchError((err) => {
          console.error('Error when retrieving settings:', err);
          return of([]);
        })
      )
      .subscribe();
  }

  async loadYearlyBalances(): Promise<void> {
    this.hasData = false;
    const promises = [];
    for (let month = 1; month <= 12; month++) {
      promises.push(this.loadMonthData(month));
    }
    await Promise.all(promises);
    this.saleData = [...this.saleData];
    this.hasData = true;
  }

  async loadMonthData(month: number): Promise<void> {
    try {
      const [revenue, expense] = await Promise.all([
        firstValueFrom(
          this.balancesService
            .getBalanceForMonthAndYear(month, +this.selectedYear, 'revenue')
            .pipe(catchError(() => of(0)))
        ),
        firstValueFrom(
          this.balancesService
            .getBalanceForMonthAndYear(month, +this.selectedYear, 'expense')
            .pipe(catchError(() => of(0)))
        ),
      ]);

      this.saleData[month - 1].series[0].value = Math.abs(revenue / 100);
      this.saleData[month - 1].series[1].value = Math.abs(expense / 100);
    } catch (error) {
      console.error('Error loading month data:', error);
    }
  }

  reloadData() {
    this.hasData = false;
    this.loadYearlyBalances();
  }

  customColors = () => {
    return '#299d91';
  };

  formatYAxisTick(value: number): string {
    return '$' + value.toLocaleString('en-US');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
