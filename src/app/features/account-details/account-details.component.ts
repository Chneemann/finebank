import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { HistoryComponent } from './history/history.component';
import { AccountService } from '../../core/services/account.service';
import { CommonModule } from '@angular/common';
import {
  BehaviorSubject,
  catchError,
  filter,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { AccountModel } from '../../core/models/account.model';
import { TransactionModel } from '../../core/models/transactions.model';
import { BalancesService } from '../../core/services/balances.service';

@Component({
  selector: 'app-account-details',
  imports: [CommonModule, DetailsComponent, HistoryComponent],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss',
})
export class AccountDetailsComponent {
  currentAccountData$!: Observable<AccountModel>;
  currentTransactionsData$!: Observable<TransactionModel[]>;
  currentBalance$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  accountExists = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private balancesService: BalancesService
  ) {}

  ngOnInit() {
    this.checkAccountExistence();
  }

  private checkAccountExistence() {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        switchMap((accountId) =>
          accountId
            ? this.accountService.existAccountId(accountId).pipe(
                tap((exists) => {
                  this.accountExists = exists;
                  if (!exists) this.redirectToBalance();
                }),
                catchError((error) => {
                  console.error('Error checking account existence', error);
                  return of(false);
                })
              )
            : of(false)
        ),
        filter((exists) => exists),
        map(() => this.route.snapshot.paramMap.get('id')!)
      )
      .subscribe((accountId) => {
        if (accountId) {
          this.loadAccountData(accountId);
          this.loadTransactionsData(accountId);
        }
      });
  }

  private loadAccountData(accountId: string) {
    this.currentAccountData$ = this.accountService
      .getAccountDataById(accountId)
      .pipe(
        map(
          (tx) => new AccountModel(tx.id, tx.added, tx.name, tx.number, tx.type)
        ),
        catchError((error) => {
          console.error('Error loading account data', error);
          return of({} as AccountModel);
        })
      );
  }

  private loadTransactionsData(accountId: string) {
    this.currentTransactionsData$ = this.accountService
      .getTransactionDataByAccountId(accountId)
      .pipe(
        tap((transactions) => {
          if (transactions && transactions.length > 0) {
            this.updateBalance(transactions, accountId);
          }
        }),
        catchError((error) => {
          console.error('Error loading transaction data', error);
          return of([]);
        })
      );
  }

  private updateBalance(transactions: TransactionModel[], accountId: string) {
    this.balancesService.calculateIndividualBalance(transactions, {
      id: accountId,
    } as AccountModel);

    this.balancesService.currentIndividualBalance$.subscribe((balance) => {
      this.currentBalance$.next(balance);
    });
  }

  private redirectToBalance() {
    this.router.navigate(['/balances']);
  }
}
