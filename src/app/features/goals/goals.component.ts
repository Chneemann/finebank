import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/layouts/button/button.component';
import { ManometerComponent } from './manometer/manometer.component';
import { CommonModule } from '@angular/common';
import { combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';
import { BalancesService } from '../../core/services/balances.service';
import { GoalsService } from '../../core/services/goals.service';
import { OverlayService } from '../../core/services/overlay.service';
import { LineChartComponent } from './line-chart/line-chart.component';
import { FormsModule } from '@angular/forms';
import { GoalModel } from '../../core/models/goal.model';
import { SavingsTargetComponent } from './savings-target/savings-target.component';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    ManometerComponent,
    LineChartComponent,
    SavingsTargetComponent,
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
  allDataLoaded$: Observable<boolean> = new Observable();
  allGoals$: Observable<GoalModel[]> = new Observable();
  globalBalance$: Observable<number> = new Observable();

  constructor(
    private balancesService: BalancesService,
    private goalsService: GoalsService,
    private overlayService: OverlayService
  ) {}

  ngOnInit(): void {
    this.initializeObservables();
    this.getSelectedYear();
  }

  onSavingsTargetIdChange(id: string): void {
    this.savingsTargetId = id;
  }

  onSavingsTargetAmountChange(amount: number): void {
    this.savingsTargetAmount = amount;
  }

  initializeObservables(): void {
    this.allGoals$ = this.goalsService.allGoals$.pipe(takeUntil(this.destroy$));
    this.globalBalance$ = this.balancesService.globalBalance$.pipe(
      takeUntil(this.destroy$)
    );

    this.allDataLoaded$ = this.checkAllDataLoaded([
      this.allGoals$,
      this.globalBalance$,
    ]);
  }

  checkAllDataLoaded(
    observables: [Observable<GoalModel[]>, Observable<number>]
  ): Observable<boolean> {
    return combineLatest(observables).pipe(
      map(([allGoals, globalBalance]) => {
        return (
          Array.isArray(allGoals) &&
          allGoals.length > 0 &&
          typeof globalBalance === 'number'
        );
      })
    );
  }

  getSelectedYear() {
    this.allGoals$.subscribe((goals) => {
      if (goals.length > 0) {
        this.selectedYear = goals[0].selectedYear;
      }
    });
  }

  filterGoals(goals: GoalModel[]): GoalModel[] {
    return goals.filter((goal) => goal.id !== '' && goal.goal !== 'Global');
  }

  setSelectedYear(): void {
    this.goalsService.updateUserGoalSelectedYear(this.selectedYear).subscribe({
      error: (err) => console.error('Error updating year:', err),
    });
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
