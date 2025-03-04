import { Component } from '@angular/core';
import { LineChartExpensesComponent } from './line-chart-expenses/line-chart-expenses.component';
import { CommonModule } from '@angular/common';
import { GoalsService } from '../../core/services/goals.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expenses',
  imports: [CommonModule, FormsModule, LineChartExpensesComponent],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
})
export class ExpensesComponent {
  selectedYear: number = new Date().getFullYear();
  years: number[] = [2024, 2025];

  constructor(private goalsService: GoalsService) {}

  setSelectedYear(): void {
    this.goalsService.updateUserGoalSelectedYear(this.selectedYear).subscribe({
      error: (err) => console.error('Error updating year:', err),
    });
  }
}
