import { Component } from '@angular/core';
import { OverviewCardBalancesComponent } from '../balances/components/overview-card/overview-card.component';

@Component({
  selector: 'app-overview',
  imports: [OverviewCardBalancesComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {}
