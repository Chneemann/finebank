import { Bill } from './bill.interface';

export class BillModel implements Bill {
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

  constructor(data: Partial<Bill> = {}) {
    this.id = data.id;
    this.accountId = data.accountId ?? '';
    this.added = data.added ?? Date.now();
    this.amount = data.amount ?? 0;
    this.category = data.category ?? 'Others';
    this.description = data.description ?? '';
    this.frequency = data.frequency ?? 'monthly';
    this.item = data.item ?? '';
    this.executionDate = data.executionDate ?? 1;
    this.lastExecution = data.lastExecution ?? 0;
    this.shop = data.shop ?? '';
    this.userId = data.userId ?? '';
  }

  // Getter for the formatted date
  get formattedAddedDate(): string {
    const date = new Date(this.added);

    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  }

  // Getter for the formatted amount (in USD)
  // Example: '$10.00'
  get formattedAmount(): string {
    const amountInUSD = this.amount / 100;

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amountInUSD);
  }
}
