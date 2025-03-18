import { Component } from '@angular/core';
import { BalanceOverviewCardComponent } from '../balances/balance-overview-card/balance-overview-card.component';
import { TransactionsOverviewCardComponent } from '../transactions/transactions-overview-card/transactions-overview-card.component';
import { GoalsOverviewCardComponent } from '../goals/goals-overview-card/goals-overview-card.component';
import { LineChartStatisticComponent } from '../statistics/line-chart-statistic/line-chart-statistic.component';
import { BillsOverviewCardComponent } from '../bills/bills-overview-card/bills-overview-card.component';
import { RouterLink } from '@angular/router';
import { HeadlineComponent } from '../../shared/components/layouts/headline/headline.component';

@Component({
  selector: 'app-overview',
  imports: [
    RouterLink,
    BalanceOverviewCardComponent,
    TransactionsOverviewCardComponent,
    GoalsOverviewCardComponent,
    LineChartStatisticComponent,
    BillsOverviewCardComponent,
    HeadlineComponent,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {}
