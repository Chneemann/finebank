import { Transactions } from './transactions.interface';

export class TransactionModel implements Transactions {
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

  constructor(data: {
    accountId: string;
    item: string;
    shop: string;
    type: string;
    amount: number;
    category: string;
    date: number;
    month: number;
    year: number;
    id: string;
  }) {
    this.accountId = data.accountId;
    this.item = data.item;
    this.shop = data.shop;
    this.type = data.type;
    this.amount = data.amount;
    this.category = data.category;
    this.date = data.date;
    this.month = data.month;
    this.year = data.year;
    this.id = data.id;
  }

  // Getter for the formatted date
  // Example: 'Sep 8, 2024'
  get formattedDate(): string {
    const date = new Date(this.date);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  // Getter for the formatted amount (in USD)
  // Example: '$10.00'
  get formattedAmount(): string {
    const amountInUSD = this.amount / 100;
    return `$${amountInUSD.toFixed(2)}`;
  }
}
