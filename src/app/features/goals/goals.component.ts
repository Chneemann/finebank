import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/layouts/button/button.component';
import { ManometerComponent } from './manometer/manometer.component';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { BalancesService } from '../../core/services/balances.service';

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
  globalBalance$!: Observable<number>;
  accountsBalances$!: Observable<{ accountId: string; balance: number }[]>;

  constructor(private balancesService: BalancesService) {}

  ngOnInit(): void {
    this.globalBalance$ = this.balancesService.globalBalance$;
    this.accountsBalances$ = this.balancesService.accountsBalances$;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
