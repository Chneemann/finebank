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
import { AccountService } from '../../../core/services/account.service';

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

  constructor(
    private balancesService: BalancesService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.loadAllUserAccounts();
    this.globalBalance$ = this.balancesService.globalBalance$;
    this.accountsBalances$ = this.balancesService.accountsBalances$;
    this.currentBalance$ = this.getCurrentBalance();
  }

  private loadAllUserAccounts(): void {
    this.accountsData$ = this.accountService
      .getAllUserAccounts()
      .pipe(map((accounts) => accounts.map((tx) => new AccountModel(tx))));

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
