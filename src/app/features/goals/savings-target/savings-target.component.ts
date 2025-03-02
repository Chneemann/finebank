import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';
import { GoalModel } from '../../../core/models/goal.model';
import { BalancesService } from '../../../core/services/balances.service';
import { GoalsService } from '../../../core/services/goals.service';
import { OverlayService } from '../../../core/services/overlay.service';

@Component({
  selector: 'app-savings-target',
  imports: [CommonModule],
  templateUrl: './savings-target.component.html',
  styleUrl: './savings-target.component.scss',
})
export class SavingsTargetComponent {
  @Output() savingsTargetAmountChange = new EventEmitter<number>();
  @Output() savingsTargetIdChange = new EventEmitter<string>();

  targetAchieved: number = 0;
  savingsTargetId: string = '';
  savingsTargetAmount: number = 0;
  selectedYear: number = new Date().getFullYear();
  years: number[] = [2024, 2025];

  private destroy$ = new Subject<void>();
  allDataLoaded$: Observable<boolean> = new Observable();
  allGoals$: Observable<GoalModel[]> = new Observable();
  globalBalance$: Observable<number> = new Observable();
  accountsBalances$: Observable<{ accountId: string; balance: number }[]> =
    new Observable();

  constructor(
    private balancesService: BalancesService,
    private goalsService: GoalsService,
    private overlayService: OverlayService
  ) {}

  ngOnInit(): void {
    this.initializeObservables();
    this.setSavingsTargetData();
    this.getSelectedYear();
  }

  initializeObservables(): void {
    this.allGoals$ = this.goalsService.allGoals$.pipe(takeUntil(this.destroy$));
    this.globalBalance$ = this.balancesService.globalBalance$.pipe(
      takeUntil(this.destroy$)
    );
    this.accountsBalances$ = this.balancesService.accountsBalances$.pipe(
      takeUntil(this.destroy$)
    );

    this.allDataLoaded$ = this.checkAllDataLoaded([
      this.allGoals$,
      this.globalBalance$,
      this.accountsBalances$,
    ]);
  }

  checkAllDataLoaded(
    observables: [
      Observable<GoalModel[]>,
      Observable<number>,
      Observable<{ accountId: string; balance: number }[]>
    ]
  ): Observable<boolean> {
    return combineLatest(observables).pipe(
      map(([allGoals, globalBalance, accountsBalances]) => {
        return (
          Array.isArray(allGoals) &&
          allGoals.length > 0 &&
          typeof globalBalance === 'number' &&
          Array.isArray(accountsBalances) &&
          accountsBalances.length > 0
        );
      })
    );
  }

  setSavingsTargetData() {
    this.allGoals$.pipe(takeUntil(this.destroy$)).subscribe((goals) => {
      const { id = '', amount = 0 } = goals.length > 0 ? goals[0] : {};
      this.savingsTargetId = id;
      this.savingsTargetAmount = amount / 100;

      this.savingsTargetIdChange.emit(this.savingsTargetId);
      this.savingsTargetAmountChange.emit(this.savingsTargetAmount);
    });
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
