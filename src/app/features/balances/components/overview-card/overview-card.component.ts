import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SliderComponent } from './slider/slider.component';
import { CommonModule } from '@angular/common';
import { Observable, Subject, takeUntil, catchError, of, map } from 'rxjs';
import { BalancesService } from '../../services/balances.service';
import { TransactionsService } from '../../../transactions/services/transactions.service';
import { TransactionModel } from '../../../../core/models/transactions.model';

@Component({
  selector: 'app-overview-card-balances',
  imports: [CommonModule, SliderComponent],
  templateUrl: './overview-card.component.html',
  styleUrl: './overview-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewCardBalancesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  accountsData$!: Observable<any[]>;
  transactionsData$!: Observable<TransactionModel[]>;

  currentGlobalBalance$!: Observable<number>;
  currentIndividualBalance$!: Observable<number>;

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
    this.accountsData$ = this.balancesService.getAllAccounts().pipe(
      catchError((error) => {
        console.error(error);
        return of([]);
      })
    );

    this.accountsData$.pipe(takeUntil(this.destroy$)).subscribe((accounts) => {
      this.accounts = accounts;
      this.totalAccounts = accounts.length;
      this.calculateCurrentIndividualBalance();
    });
  }

  private loadAllTransactions(): void {
    this.transactionsData$ = this.transactionsService.getAllTransactions().pipe(
      catchError((error) => {
        console.error(error);
        return of([]);
      }),
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

    this.transactionsData$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.calculateCurrentGlobalBalance();
    });
  }

  private calculateCurrentGlobalBalance(): void {
    this.currentGlobalBalance$ = this.transactionsData$.pipe(
      map((transactions) =>
        this.balancesService.calculateGlobalBalance(transactions)
      )
    );
  }

  private calculateCurrentIndividualBalance(): void {
    this.currentIndividualBalance$ = this.transactionsData$.pipe(
      map((transactions) =>
        this.balancesService.calculateIndividualBalance(
          transactions,
          this.accounts[this.currentIndex]
        )
      )
    );
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
