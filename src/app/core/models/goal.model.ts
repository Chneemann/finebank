import { Goal } from './goal.interface';

export class GoalModel implements Goal {
  id?: string;
  amount: number[];
  goal: string[];
  selectedYear: string;
  userId: string;

  constructor(
    id: string,
    amount: number[],
    goal: string[],
    selectedYear: string,
    userId: string
  ) {
    this.id = id;
    this.amount = amount;
    this.goal = goal;
    this.selectedYear = selectedYear;
    this.userId = userId;
  }
}
