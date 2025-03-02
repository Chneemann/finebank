import { Pipe, PipeTransform } from '@angular/core';
import { TransactionModel } from '../models/transactions.model';

@Pipe({
  name: 'filterTransactions',
  pure: false,
})
export class FilterTransactionsPipe implements PipeTransform {
  transform(
    transactions: TransactionModel[],
    type: 'all' | 'revenue' | 'expense'
  ): TransactionModel[] {
    if (!transactions) {
      return [];
    }
    if (type === 'all') {
      return transactions;
    }
    return transactions.filter((transaction) => transaction.type === type);
  }
}
