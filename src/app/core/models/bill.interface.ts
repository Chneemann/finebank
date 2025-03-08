export interface Bill {
  id?: string;
  accountId: string;
  added: number;
  amount: number;
  category: string;
  description: string;
  frequency: string;
  item: string;
  executionDate: number;
  lastExecution: number;
  shop: string;
  userId: string;
}
