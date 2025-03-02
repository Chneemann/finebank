import { Component, Input } from '@angular/core';
import { OverlayService } from '../../../../core/services/overlay.service';
import { ButtonComponent } from '../../layouts/button/button.component';
import { Observable, Subject, take } from 'rxjs';
import { GoalsService } from '../../../../core/services/goals.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoalModel } from '../../../../core/models/goal.model';

@Component({
  selector: 'app-goals-overlay',
  imports: [FormsModule, CommonModule, ButtonComponent],
  templateUrl: './goals-overlay.component.html',
  styleUrl: './goals-overlay.component.scss',
})
export class GoalsOverlayComponent {
  @Input() overlayData: {
    embedded: string | null;
    docId: string | null;
    collection: string | null;
  } = {
    embedded: null,
    docId: null,
    collection: null,
  };

  private destroy$ = new Subject<void>();
  allGoals$!: Observable<GoalModel[]>;
  currentGoal?: { id: string; goal: string; amount: number; index: number };
  originalAmount!: number;
  errorMessage: string = '';

  constructor(
    private overlayService: OverlayService,
    private goalsService: GoalsService
  ) {}

  ngOnInit(): void {
    this.allGoals$ = this.goalsService.allGoals$;
    this.setCurrentGoal();
  }

  setCurrentGoal() {
    this.allGoals$.pipe(take(1)).subscribe((goals) => {
      if (!goals || !Array.isArray(goals)) return;

      const docId = String(this.overlayData.docId);
      const index = Number(this.overlayData.collection);

      const goal = goals.find(
        (goal) => goal.id === docId && goal.index === index
      );

      if (goal && goal.id) {
        this.currentGoal = { ...goal, id: goal.id, amount: goal.amount / 100 };
        this.originalAmount = this.currentGoal.amount;
      }
    });
  }

  setGoalOverlay(docId: string, collection: string): void {
    this.overlayService.setEmbeddedOverlay({
      embedded: 'goals-overlay',
      docId: docId,
      collection: collection,
    });
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '');

    const numericValue = parseFloat(value);

    if (isNaN(numericValue)) {
      return;
    }

    if (this.currentGoal) {
      if (numericValue > 99999 && this.currentGoal.index === 0) {
        this.errorMessage = 'Error: Amount exceeds 99,999';
      } else if (numericValue > 9999 && this.currentGoal.index >= 1) {
        this.errorMessage = 'Error: Amount exceeds 9,999';
      } else {
        this.errorMessage = '';
        this.currentGoal.amount = numericValue;
      }
    }

    input.value = value;
  }

  onBlur(goalItem: { amount: number }): void {
    if (
      goalItem.amount == null ||
      (this.currentGoal &&
        ((this.currentGoal.index >= 1 && goalItem.amount > 9999) ||
          (this.currentGoal.index === 0 && goalItem.amount > 99999)))
    ) {
      goalItem.amount = this.originalAmount;
    } else {
      goalItem.amount = Math.floor((goalItem.amount / 100) * 100);
    }
  }

  onFocus(goalItem: { amount: number | null }): void {
    goalItem.amount = null;
  }

  saveOverlay() {
    if (this.currentGoal && this.errorMessage === '') {
      this.goalsService
        .updateUserGoalAmount(
          this.currentGoal.index,
          Math.round(this.currentGoal.amount * 100)
        )
        .subscribe({
          error: (err) => console.error('Error during saving:', err),
        });
      this.closeOverlay();
    }
  }

  closeOverlay() {
    this.overlayService.resetEmbeddedOverlay();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
