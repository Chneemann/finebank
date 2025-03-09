import { Goal } from './goal.interface';

export class GoalModel implements Goal {
  id?: string;
  amount: number;
  goal: string;
  selectedYear: number;
  userId: string;
  index: number;

  constructor(data: Partial<Goal> = {}) {
    this.id = data.id;
    this.amount = data.amount ?? 0;
    this.goal = data.goal ?? '';
    this.selectedYear = data.selectedYear ?? 0;
    this.userId = data.userId ?? '';
    this.index = data.index ?? 0;
  }

  // Getter for the formatted amount (in USD)
  get formattedAmount(): string {
    const amountInUSD = this.amount / 100;
    return `$${amountInUSD.toLocaleString()}`;
  }
}
