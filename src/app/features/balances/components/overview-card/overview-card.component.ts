import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SliderComponent } from './slider/slider.component';
import { CommonModule } from '@angular/common';
import { Observable, Subject, takeUntil, map, take } from 'rxjs';
import { BalancesService } from '../../../../core/services/balances.service';
import { TransactionsService } from '../../../../core/services/transactions.service';
import { TransactionModel } from '../../../../core/models/transactions.model';
import { AccountModel } from '../../../../core/models/account.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-overview-card-balances',
  imports: [CommonModule, RouterLink, SliderComponent],
  templateUrl: './overview-card.component.html',
  styleUrl: './overview-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewCardBalancesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  accountsData$!: Observable<AccountModel[]>;
  transactionsData$!: Observable<TransactionModel[]>;

  currentGlobalBalance$!: Observable<number>;
  currentIndividualBalance$!: Observable<number>;

  accounts: AccountModel[] = [];
  currentIndex = 0;
  totalAccounts = 0;

  constructor(
    private balancesService: BalancesService,
    private transactionsService: TransactionsService
  ) {}

  ngOnInit(): void {
    this.loadAllAccounts();
    this.loadAllTransactions();
    this.loadBalances();
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

    this.accountsData$.pipe(takeUntil(this.destroy$)).subscribe((accounts) => {
      this.accounts = accounts;
      this.totalAccounts = accounts.length;
      this.calculateCurrentIndividualBalance();
    });
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

    this.transactionsData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((transactions) => {
        this.balancesService.calculateGlobalBalance(transactions);
        this.calculateCurrentIndividualBalance();
      });
  }

  private calculateCurrentIndividualBalance(): void {
    this.transactionsData$.pipe(take(1)).subscribe((transactions) => {
      const account = this.accounts[this.currentIndex];
      account?.id &&
        this.balancesService.calculateIndividualBalance(transactions, account);
    });
  }

  private loadBalances() {
    this.currentGlobalBalance$ = this.balancesService.currentGlobalBalance$;
    this.currentIndividualBalance$ =
      this.balancesService.currentIndividualBalance$;
  }

  changeSlide(index: number): void {
    this.currentIndex = index;
    this.calculateCurrentIndividualBalance();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
