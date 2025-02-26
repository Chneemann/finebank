import { Component } from '@angular/core';
import { BalanceOverviewCardComponent } from '../balances/balance-overview-card/balance-overview-card.component';
import { TransactionsOverviewCardComponent } from '../transactions/transactions-overview-card/transactions-overview-card.component';
import { GoalsOverviewCardComponent } from '../goals/goals-overview-card/goals-overview-card.component';

@Component({
  selector: 'app-overview',
  imports: [
    BalanceOverviewCardComponent,
    TransactionsOverviewCardComponent,
    GoalsOverviewCardComponent,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {}
