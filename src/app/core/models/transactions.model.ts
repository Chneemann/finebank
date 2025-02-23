import { Transactions } from './transactions.interface';

export class TransactionModel implements Transactions {
  id?: string;
  accountId: string;
  item: string;
  shop: string;
  type: string;
  amount: number;
  date: number;
  month: number;
  year: number;

  constructor(
    accountId: string,
    item: string,
    shop: string,
    type: string,
    amount: number,
    date: number,
    month: number,
    year: number,
    id?: string
  ) {
    this.accountId = accountId;
    this.item = item;
    this.shop = shop;
    this.type = type;
    this.amount = amount;
    this.date = date;
    this.month = month;
    this.year = year;
    this.id = id;
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
