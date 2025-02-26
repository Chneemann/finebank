import { Goal } from './goal.interface';

export class GoalModel implements Goal {
  id?: string;
  amount: number;
  goal: string;
  selectedYear: number;
  userId: string;
  index: number;

  constructor(data: {
    amount: number;
    goal: string;
    selectedYear: number;
    userId: string;
    index: number;
    id?: string;
  }) {
    this.amount = data.amount;
    this.goal = data.goal;
    this.selectedYear = data.selectedYear;
    this.userId = data.userId;
    this.index = data.index;
    this.id = data.id;
  }
}
