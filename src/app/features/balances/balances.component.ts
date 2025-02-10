import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Observable,
  Subject,
  takeUntil,
  map,
  take,
  combineLatest,
  BehaviorSubject,
} from 'rxjs';
import { ButtonComponent } from '../../shared/components/layouts/button/button.component';
import { RouterLink } from '@angular/router';
import { AccountModel } from '../../core/models/account.model';
import { TransactionModel } from '../../core/models/transactions.model';
import { BalancesService } from '../../core/services/balances.service';
import { TransactionsService } from '../../core/services/transactions.service';

@Component({
  selector: 'app-balances',
  standalone: true,
  imports: [CommonModule, ButtonComponent, RouterLink],
  templateUrl: './balances.component.html',
  styleUrl: './balances.component.scss',
})
export class BalancesComponent {
  private destroy$ = new Subject<void>();
  accountsData$!: Observable<AccountModel[]>;
  transactionsData$!: Observable<TransactionModel[]>;

  individualBalances$ = new Map<string, BehaviorSubject<number>>();

  constructor(
    private balancesService: BalancesService,
    private transactionsService: TransactionsService
  ) {}

  ngOnInit(): void {
    this.loadAllAccounts();
    this.loadAllTransactions();
  }

  private loadAllAccounts(): void {
    this.accountsData$ = this.balancesService
      .getAllAccounts()
      .pipe(
        map((accounts) =>
          accounts.map(
            (tx) =>
              new AccountModel(tx.id, tx.added, tx.name, tx.number, tx.type)
          )
        )
      );
  }

  private loadAllTransactions(): void {
    this.transactionsData$ = this.transactionsService
      .getAllTransactions()
      .pipe(
        map((transactions) =>
          transactions.map(
            (tx) =>
              new TransactionModel(
                tx.accountId,
                tx.item,
                tx.shop,
                tx.type,
                tx.amount,
                tx.date,
                tx.id
              )
          )
        )
      );

    combineLatest([this.accountsData$, this.transactionsData$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([accounts, transactions]) => {
        this.balancesService.calculateGlobalBalance(transactions);
        this.updateIndividualBalances(accounts, transactions);
      });
  }

  private updateIndividualBalances(
    accounts: AccountModel[],
    transactions: TransactionModel[]
  ): void {
    accounts.forEach((account) => {
      if (!this.individualBalances$.has(account.id!)) {
        this.individualBalances$.set(
          account.id!,
          new BehaviorSubject<number>(0)
        );
      }

      this.balancesService.calculateIndividualBalance(transactions, account);
      this.balancesService.currentIndividualBalance$
        .pipe(take(1))
        .subscribe((balance) => {
          this.individualBalances$.get(account.id!)!.next(balance);
        });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
