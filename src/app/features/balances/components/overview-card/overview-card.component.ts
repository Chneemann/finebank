import { Component } from '@angular/core';
import { SliderComponent } from './slider/slider.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { BalancesService } from '../../services/balances.service';

@Component({
  selector: 'app-overview-card-balances',
  imports: [CommonModule, SliderComponent],
  templateUrl: './overview-card.component.html',
  styleUrl: './overview-card.component.scss',
})
export class OverviewCardBalancesComponent {
  allAccounts$: Observable<any[]>;
  currentIndex = 0;
  totalAccounts = 0;

  constructor(private balancesService: BalancesService) {
    this.allAccounts$ = this.balancesService.getAllAccounts();

    this.allAccounts$.subscribe((accounts) => {
      this.totalAccounts = accounts.length;
    });
  }

  changeSlide(index: number) {
    this.currentIndex = index;
  }
}
