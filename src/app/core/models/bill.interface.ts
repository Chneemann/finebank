export interface Bill {
  id?: string;
  accountId: string;
  added: number;
  amount: number;
  category: string;
  description: string;
  frequency: string;
  item: string;
  executionDay: number;
  lastExecution: number;
  shop: string;
  userId: string;
}
