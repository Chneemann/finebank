import { Component, Input } from '@angular/core';
import { OverlayService } from '../../../../core/services/overlay.service';
import { ButtonComponent } from '../../layouts/button/button.component';
import { BehaviorSubject, map, Observable, Subject, take } from 'rxjs';
import { GoalsService } from '../../../../core/services/goals.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  allGoals$!: Observable<
    { id: string; goal: string; amount: number; index: number }[]
  >;
  currentGoal?: { id: string; goal: string; amount: number; index: number };
  originalAmount!: number;

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

      if (goal) {
        this.currentGoal = { ...goal, amount: goal.amount / 100 };
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
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  onBlur(goalItem: { amount: number }): void {
    if (goalItem.amount == null) {
      goalItem.amount = this.originalAmount;
    } else {
      let value = goalItem.amount / 100;
      value = parseFloat(value.toFixed(2));
      goalItem.amount = value * 100;
    }
  }

  onFocus(goalItem: { amount: number | null }): void {
    goalItem.amount = null;
  }

  saveOverlay() {
    if (this.currentGoal) {
      this.goalsService
        .updateGoalAmount(
          this.currentGoal.id,
          this.currentGoal.index,
          Math.round(this.currentGoal.amount * 100)
        )
        .catch((error) => console.error('Error during saving:', error));
    }
    this.closeOverlay();
  }

  closeOverlay() {
    this.overlayService.resetEmbeddedOverlay();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
