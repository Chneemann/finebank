import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BalancesService } from '../../../core/services/balances.service';
import { CommonModule } from '@angular/common';
import { catchError, firstValueFrom, of } from 'rxjs';

@Component({
  selector: 'app-line-chart-expenses',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './line-chart-expenses.component.html',
  styleUrl: './line-chart-expenses.component.scss',
})
export class LineChartExpensesComponent implements OnInit, OnChanges {
  @Input() selectedYear = 0;
  @Input() view: [number, number] = [0, 0];
  hasData = false;

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

  constructor(private balancesService: BalancesService) {}

  ngOnInit() {
    this.loadYearlyBalances();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedYear']) {
      const previousYear = changes['selectedYear'].previousValue;
      const currentYear = changes['selectedYear'].currentValue;

      if (previousYear !== currentYear && previousYear !== undefined) {
        this.reloadData();
      }
    }
  }

  async loadYearlyBalances(): Promise<void> {
    const promises = [];
    for (let month = 1; month <= 12; month++) {
      promises.push(this.loadMonthData(month));
    }
    await Promise.all(promises);
    this.saleData = [...this.saleData];
    setTimeout(() => {
      this.hasData = true;
    }, 10);
  }

  async loadMonthData(month: number): Promise<void> {
    try {
      const revenue = await firstValueFrom(
        this.balancesService
          .getBalanceForMonthAndYear(month, +this.selectedYear, 'revenue')
          .pipe(catchError(() => of(0)))
      );
      const expense = await firstValueFrom(
        this.balancesService
          .getBalanceForMonthAndYear(month, +this.selectedYear, 'expense')
          .pipe(catchError(() => of(0)))
      );

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
}
