import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SliderComponent } from './slider/slider.component';
import { CommonModule } from '@angular/common';
import { Observable, Subject, takeUntil, map, combineLatest } from 'rxjs';
import { BalancesService } from '../../../core/services/balances.service';
import { TransactionModel } from '../../../core/models/transactions.model';
import { AccountModel } from '../../../core/models/account.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-balance-overview-card',
  imports: [CommonModule, RouterLink, SliderComponent],
  templateUrl: './balance-overview-card.component.html',
  styleUrl: './balance-overview-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceOverviewCardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  accountsData$!: Observable<AccountModel[]>;
  transactionsData$!: Observable<TransactionModel[]>;

  globalBalance$!: Observable<number>;
  accountsBalances$!: Observable<{ accountId: string; balance: number }[]>;
  currentBalance$!: Observable<number>;

  accounts: AccountModel[] = [];
  currentIndex = 0;
  totalAccounts = 0;

  constructor(private balancesService: BalancesService) {}

  ngOnInit(): void {
    this.loadAllAccounts();
    this.globalBalance$ = this.balancesService.globalBalance$;
    this.accountsBalances$ = this.balancesService.accountsBalances$;
    this.currentBalance$ = this.getCurrentBalance();
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
    });
  }

  private getCurrentBalance(): Observable<number> {
    return combineLatest([this.accountsBalances$, this.accountsData$]).pipe(
      map(
        ([balances, accounts]) =>
          balances.find((b) => b.accountId === accounts[this.currentIndex]?.id)
            ?.balance ?? 0
      )
    );
  }

  changeSlide(index: number): void {
    this.currentIndex = index;
    this.currentBalance$ = this.getCurrentBalance();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
