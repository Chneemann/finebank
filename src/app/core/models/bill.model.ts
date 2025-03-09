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
  executionDay: number;
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
    this.executionDay = data.executionDay ?? 1;
    this.lastExecution = data.lastExecution ?? 0;
    this.shop = data.shop ?? '';
    this.userId = data.userId ?? '';
  }

  // Auxiliary method for date formatting
  private formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  }

  // Auxiliary method for date formatting (short)
  private formatDateShort(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  // Getter for the formatted add date
  get formattedAddedDate(): string {
    return this.formatDate(this.added);
  }

  // Getter for the formatted last execution date
  get formattedLastExecution(): string {
    return this.formatDate(this.lastExecution);
  }

  // Getter for the formatted last execution date (short)
  get formattedLastExecutionShort(): string {
    return this.formatDateShort(this.lastExecution);
  }

  // Getter for the formatted amount (in USD)
  get formattedAmount(): string {
    const amountInUSD = this.amount / 100;
    return `$${amountInUSD.toFixed(0)}`;
  }

  // Calculate the next month due if the frequency is “monthly” or “yearly”
  get nextExecutionDate(): string {
    const currentExecutionDate = new Date(this.lastExecution);

    if (this.frequency === 'monthly') {
      currentExecutionDate.setMonth(currentExecutionDate.getMonth() + 1);
    }

    if (this.frequency === 'yearly') {
      currentExecutionDate.setFullYear(currentExecutionDate.getFullYear() + 1);
      currentExecutionDate.setMonth(currentExecutionDate.getMonth() + 1);
    }

    const month = currentExecutionDate.toLocaleString('en-US', {
      month: 'short',
    });

    return month;
  }
}
