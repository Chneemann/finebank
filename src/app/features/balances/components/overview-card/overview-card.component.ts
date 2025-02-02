import { Component, OnDestroy, OnInit } from '@angular/core';
import { SliderComponent } from './slider/slider.component';
import { CommonModule } from '@angular/common';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { BalancesService } from '../../services/balances.service';

@Component({
  selector: 'app-overview-card-balances',
  imports: [CommonModule, SliderComponent],
  templateUrl: './overview-card.component.html',
  styleUrl: './overview-card.component.scss',
})
export class OverviewCardBalancesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  allAccounts$!: Observable<any[]>;
  accounts: any[] = [];
  currentIndex = 0;
  totalAccounts = 0;

  constructor(private balancesService: BalancesService) {}

  ngOnInit(): void {
    this.loadAllAccounts();
  }

  private loadAllAccounts(): void {
    this.allAccounts$ = this.balancesService.getAllAccounts();

    this.allAccounts$.pipe(takeUntil(this.destroy$)).subscribe((accounts) => {
      this.accounts = accounts;
      this.totalAccounts = accounts.length;
    });
  }

  changeSlide(index: number): void {
    this.currentIndex = index;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
