import { Component, OnDestroy, OnInit } from '@angular/core';
import { SliderComponent } from './slider/slider.component';
import { CommonModule } from '@angular/common';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { BalancesService } from '../../services/balances.service';
import { TransactionsService } from '../../../transactions/services/transactions.service';

@Component({
  selector: 'app-overview-card-balances',
  imports: [CommonModule, SliderComponent],
  templateUrl: './overview-card.component.html',
  styleUrl: './overview-card.component.scss',
})
export class OverviewCardBalancesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  accountsData$!: Observable<any[]>;
  transactionsData$!: Observable<any>;
  currentBalance$!: Observable<number>;

  accounts: any[] = [];
  currentIndex = 0;
  totalAccounts = 0;

  constructor(
    private balancesService: BalancesService,
    private transactionsService: TransactionsService
  ) {}

  ngOnInit(): void {
    this.loadAllAccounts();
    this.loadAllTransactions();
  }

  private loadAllAccounts(): void {
    this.accountsData$ = this.balancesService.getAllAccounts();

    this.accountsData$.pipe(takeUntil(this.destroy$)).subscribe((accounts) => {
      this.accounts = accounts;
      this.totalAccounts = accounts.length;
    });
  }

  private loadAllTransactions(): void {
    this.transactionsData$ = this.transactionsService.getAllTransactions();

    this.calculateCurrentBalance();
  }

  private calculateCurrentBalance(): void {
    this.currentBalance$ = this.transactionsData$.pipe(
      map((transactions) => this.calculateAccountBalance(transactions))
    );
  }

  private calculateAccountBalance(transactions: any[]): number {
    let balance = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === 'revenue') {
        balance += transaction.amount / 100;
      } else if (transaction.type === 'expense') {
        balance -= transaction.amount / 100;
      }
    });
    return balance;
  }

  changeSlide(index: number): void {
    this.currentIndex = index;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
