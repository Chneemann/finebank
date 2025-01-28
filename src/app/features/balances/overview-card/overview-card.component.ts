import { Component } from '@angular/core';
import { SliderComponent } from './slider/slider.component';

@Component({
  selector: 'app-overview-card-balances',
  imports: [SliderComponent],
  templateUrl: './overview-card.component.html',
  styleUrl: './overview-card.component.scss',
})
export class OverviewCardBalancesComponent {}
