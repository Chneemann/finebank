import { Account } from './account.interface';

export class AccountModel implements Account {
  id?: string;
  added: number;
  name: string;
  number: string;
  type: string;

  constructor(data: Partial<Account> = {}) {
    this.id = data.id;
    this.added = data.added ?? 0;
    this.name = data.name ?? '';
    this.number = data.number ?? '';
    this.type = data.type ?? '';
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

  // Getter for the formatted last four digits of the account number
  get maskedNumber(): string {
    return this.number.slice(0, -4) + '****';
  }
}
