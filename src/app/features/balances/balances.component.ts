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
import { AccountService } from '../../core/services/account.service';

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

  globalBalance$!: Observable<number>;
  accountsBalances$!: Observable<{ accountId: string; balance: number }[]>;

  constructor(
    private balancesService: BalancesService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.loadAllUserAccounts();
    this.globalBalance$ = this.balancesService.globalBalance$;
    this.accountsBalances$ = this.balancesService.accountsBalances$;
  }

  private loadAllUserAccounts(): void {
    this.accountsData$ = this.accountService
      .getAllUserAccounts()
      .pipe(map((accounts) => accounts.map((tx) => new AccountModel(tx))));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
