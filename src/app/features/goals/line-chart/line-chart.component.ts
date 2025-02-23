import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BalancesService } from '../../../core/services/balances.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent implements OnInit {
  private loadedMonths = 0;

  saleData = [
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 0 },
    { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 },
    { name: 'May', value: 0 },
    { name: 'Jun', value: 0 },
    { name: 'Jul', value: 0 },
    { name: 'Aug', value: 0 },
    { name: 'Sep', value: 0 },
    { name: 'Oct', value: 0 },
    { name: 'Nov', value: 0 },
    { name: 'Dec', value: 0 },
  ];

  constructor(private balancesService: BalancesService) {}

  ngOnInit() {
    this.loadYearlyBalances(2024);
  }

  loadYearlyBalances(year: number): void {
    for (let month = 1; month <= 12; month++) {
      this.balancesService
        .getBalanceForMonthAndYear(month, year)
        .subscribe((balance) => {
          this.saleData[month - 1].value = balance / 100;
          this.loadedMonths++;

          if (this.loadedMonths === 12) {
            this.saleData = [...this.saleData];
          }
        });
    }
  }

  reloadData() {
    this.loadedMonths = 0;
    this.loadYearlyBalances(2024);
  }

  customColors = () => {
    return '#299d91';
  };

  get hasData(): boolean {
    return this.loadedMonths === 12;
  }
}
