import { Goal } from './goal.interface';

export class GoalModel implements Goal {
  id?: string;
  amount: number;
  goal: string;
  selectedYear: number;
  userId: string;
  index: number;

  constructor(
    amount: number,
    goal: string,
    selectedYear: number,
    userId: string,
    index: number,
    id?: string
  ) {
    this.amount = amount;
    this.goal = goal;
    this.selectedYear = selectedYear;
    this.userId = userId;
    this.index = index;
    this.id = id;
  }
}
