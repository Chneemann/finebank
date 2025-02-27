import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { HistoryComponent } from './history/history.component';
import { AccountService } from '../../core/services/account.service';
import { CommonModule } from '@angular/common';
import { catchError, filter, map, Observable, of, switchMap, tap } from 'rxjs';
import { AccountModel } from '../../core/models/account.model';
import { TransactionModel } from '../../core/models/transactions.model';
import { TransactionsService } from '../../core/services/transactions.service';

@Component({
  selector: 'app-account-details',
  imports: [CommonModule, DetailsComponent, HistoryComponent],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss',
})
export class AccountDetailsComponent {
  currentAccountData$!: Observable<AccountModel>;
  currentTransactionsData$!: Observable<TransactionModel[]>;

  accountExists = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private transactionsService: TransactionsService
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
            ? this.accountService.accountExists(accountId).pipe(
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
      .getSpecificUserAccount(accountId)
      .pipe(
        catchError((error) => {
          console.error('Error loading account data', error);
          return of(new AccountModel());
        })
      );
  }

  private loadTransactionsData(accountId: string) {
    this.currentTransactionsData$ = this.transactionsService
      .getTransactionDataByAccountId(accountId)
      .pipe(
        map((transactions: TransactionModel[]) =>
          transactions.sort(
            (a: TransactionModel, b: TransactionModel) => b.date - a.date
          )
        ),
        catchError((error) => {
          console.error('Error loading transaction data', error);
          return of([]);
        })
      );
  }

  private redirectToBalance() {
    this.router.navigate(['/balances']);
  }
}
