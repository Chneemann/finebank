import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/layouts/button/button.component';
import { ManometerComponent } from './manometer/manometer.component';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { BalancesService } from '../../core/services/balances.service';
import { GoalsService } from '../../core/services/goals.service';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ManometerComponent],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.scss',
})
export class GoalsComponent {
  targetAchieved: number = 0;
  thisMonthTarget: number = 10000;

  private destroy$ = new Subject<void>();
  allGoals$!: Observable<{ goal: string; amount: number }[]>;
  globalBalance$!: Observable<number>;
  accountsBalances$!: Observable<{ accountId: string; balance: number }[]>;

  constructor(
    private balancesService: BalancesService,
    private goalsService: GoalsService
  ) {}

  ngOnInit(): void {
    this.allGoals$ = this.goalsService.allGoals$;
    this.globalBalance$ = this.balancesService.globalBalance$;
    this.accountsBalances$ = this.balancesService.accountsBalances$;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
