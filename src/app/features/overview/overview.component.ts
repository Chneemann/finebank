import { Component } from '@angular/core';
import { OverviewCardBalancesComponent } from '../balances/components/overview-card/overview-card.component';
import { TransactionsCardComponent } from '../transactions/components/transactions-card/transactions-card.component';

@Component({
  selector: 'app-overview',
  imports: [OverviewCardBalancesComponent, TransactionsCardComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {}
