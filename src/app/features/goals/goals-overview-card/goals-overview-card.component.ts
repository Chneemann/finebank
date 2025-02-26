import { Component } from '@angular/core';
import { SavingsTargetComponent } from '../savings-target/savings-target.component';
import { ManometerComponent } from '../manometer/manometer.component';
import { combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';
import { GoalModel } from '../../../core/models/goal.model';
import { GoalsService } from '../../../core/services/goals.service';
import { BalancesService } from '../../../core/services/balances.service';
import { OverlayService } from '../../../core/services/overlay.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-goals-overview-card',
  imports: [
    CommonModule,
    FormsModule,
    SavingsTargetComponent,
    ManometerComponent,
  ],
  templateUrl: './goals-overview-card.component.html',
  styleUrl: './goals-overview-card.component.scss',
})
export class GoalsOverviewCardComponent {
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

  checkAllDataLoaded(observables: Observable<any>[]): Observable<boolean> {
    return combineLatest(observables).pipe(
      map((values) => values.every((value) => !!value))
    );
  }

  getSelectedYear() {
    this.goalsService.allGoals$.subscribe((goals) => {
      if (goals.length > 0) {
        this.selectedYear = goals[0].selectedYear;
      }
    });
  }

  filterGoals(goals: GoalModel[]): GoalModel[] {
    return goals.filter((goal) => goal.id !== '' && goal.goal !== 'Global');
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
