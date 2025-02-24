import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/layouts/button/button.component';
import { ManometerComponent } from './manometer/manometer.component';
import { CommonModule } from '@angular/common';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { BalancesService } from '../../core/services/balances.service';
import { GoalsService } from '../../core/services/goals.service';
import { OverlayService } from '../../core/services/overlay.service';
import { LineChartComponent } from './line-chart/line-chart.component';
import { FormsModule } from '@angular/forms';
import { GoalModel } from '../../core/models/goal.model';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  selectedYear: number = new Date().getFullYear();
  years: number[] = [2024, 2025];

  private destroy$ = new Subject<void>();
  allGoals$!: Observable<GoalModel[]>;
  globalBalance$!: Observable<number>;
  accountsBalances$!: Observable<{ accountId: string; balance: number }[]>;

  constructor(
    private balancesService: BalancesService,
    private goalsService: GoalsService,
    private overlayService: OverlayService
  ) {}

  ngOnInit(): void {
    this.allGoals$ = this.goalsService.allGoals$.pipe(takeUntil(this.destroy$));
    this.globalBalance$ = this.balancesService.globalBalance$.pipe(
      takeUntil(this.destroy$)
    );
    this.accountsBalances$ = this.balancesService.accountsBalances$.pipe(
      takeUntil(this.destroy$)
    );
    this.setSavingsTargetData();
    this.getSelectedYear();
  }

  setSavingsTargetData() {
    this.allGoals$
      .pipe(
        map((goals) =>
          goals.length > 0
            ? { id: goals[0].id ?? '', amount: goals[0].amount } // Standardwert für id
            : { id: '', amount: 0 }
        )
      )
      .subscribe(({ id, amount }) => {
        this.savingsTargetId = id; // id wird hier nie undefined sein
        this.savingsTargetAmount = amount / 100;
      });
  }

  getSelectedYear() {
    this.goalsService.allGoals$.subscribe((goals) => {
      if (goals.length > 0) {
        this.selectedYear = goals[0].selectedYear;
      }
    });
  }

  setSelectedYear(): void {
    this.goalsService
      .updateSelectedYear(this.selectedYear)
      .catch((err) => console.error('Error updating year:', err));
  }

  setGoalOverlay(docId: string, collection: number): void {
    this.overlayService.setEmbeddedOverlay({
      embedded: 'goals-overlay',
      docId: docId,
      collection: collection,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
