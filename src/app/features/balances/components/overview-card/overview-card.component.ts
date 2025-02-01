import { Component } from '@angular/core';
import { SliderComponent } from './slider/slider.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview-card-balances',
  imports: [CommonModule, SliderComponent],
  templateUrl: './overview-card.component.html',
  styleUrl: './overview-card.component.scss',
})
export class OverviewCardBalancesComponent {}
