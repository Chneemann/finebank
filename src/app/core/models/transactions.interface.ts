export interface Transaction {
  id?: string;
  accountId: string;
  item: string;
  shop: string;
  type: string;
  amount: number;
  category: string;
  date: number;
  month: number;
  year: number;
}
