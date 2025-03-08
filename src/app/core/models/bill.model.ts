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

  // Hilfsmethode für die Datumformatierung
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

  // Getter für das formatierte Hinzufügedatum
  get formattedAddedDate(): string {
    return this.formatDate(this.added);
  }

  // Getter für das formatierte Last Execution Datum
  get formattedLastExecution(): string {
    return this.formatDate(this.lastExecution);
  }

  // Getter für den formatierten Betrag (in USD)
  get formattedAmount(): string {
    const amountInUSD = this.amount / 100;
    return `$${amountInUSD.toFixed(2)}`;
  }

  // Berechne den nächsten fälligen Monat, wenn die frequency "monthly" ist
  get nextExecutionDate(): string {
    if (this.frequency === 'monthly') {
      const currentExecutionDate = new Date(this.executionDay);
      currentExecutionDate.setMonth(currentExecutionDate.getMonth() + 1);

      const month = currentExecutionDate.toLocaleString('en-US', {
        month: 'short',
      });
      return `${month}`;
    }

    return this.formatDate(this.executionDay);
  }
}
