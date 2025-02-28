export interface Goal {
  id?: string;
  amount: number;
  goal: string;
  selectedYear: number;
  userId: string;
  index: number;
}

export interface DocumentGoal {
  id?: string;
  goal: string[];
  amount: number[];
  selectedYear: number;
  userId: string;
}
