import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/layouts/button/button.component';
import { ManometerComponent } from './manometer/manometer.component';
import { CommonModule } from '@angular/common';
import { map, Observable, Subject } from 'rxjs';
import { BalancesService } from '../../core/services/balances.service';
import { GoalsService } from '../../core/services/goals.service';
import { OverlayService } from '../../core/services/overlay.service';
import { LineChartComponent } from './line-chart/line-chart.component';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    ManometerComponent,
    LineChartComponent,
  ],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.scss',
})
export class GoalsComponent {
  targetAchieved: number = 0;
  savingsTargetId: string = '';
  savingsTargetAmount: number = 0;

  private destroy$ = new Subject<void>();
  allGoals$!: Observable<
    { id: string; goal: string; amount: number; index: number }[]
  >;
  globalBalance$!: Observable<number>;
  accountsBalances$!: Observable<{ accountId: string; balance: number }[]>;

  constructor(
    private balancesService: BalancesService,
    private goalsService: GoalsService,
    private overlayService: OverlayService
  ) {}

  ngOnInit(): void {
    this.allGoals$ = this.goalsService.allGoals$;
    this.globalBalance$ = this.balancesService.globalBalance$;
    this.accountsBalances$ = this.balancesService.accountsBalances$;
    this.setSavingsTargetData();
  }

  setGoalOverlay(docId: string, collection: number): void {
    this.overlayService.setEmbeddedOverlay({
      embedded: 'goals-overlay',
      docId: docId,
      collection: collection,
    });
  }

  setSavingsTargetData() {
    this.allGoals$
      .pipe(
        map((goals) =>
          goals.length > 0
            ? { id: goals[0].id, amount: goals[0].amount }
            : { id: '', amount: 0 }
        )
      )
      .subscribe(({ id, amount }) => {
        this.savingsTargetId = id;
        this.savingsTargetAmount = amount / 100;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
