import { Account } from './account.interface';

export class AccountModel implements Account {
  id?: string;
  added: number;
  name: string;
  number: string;
  type: string;

  constructor(
    id: string | undefined,
    added: number,
    name: string,
    number: string,
    type: string
  ) {
    this.id = id;
    this.added = added;
    this.name = name;
    this.number = number;
    this.type = type;
  }

  // Getter for the formatted date
  get formattedAddedDate(): string {
    const date = new Date(this.added);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  // Getter for the formatted last four digits of the account number
  get maskedNumber(): string {
    return this.number.slice(0, -4) + '****';
  }
}
