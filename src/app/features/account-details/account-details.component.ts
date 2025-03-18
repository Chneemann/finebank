import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { AccountService } from '../../core/services/account.service';
import { CommonModule } from '@angular/common';
import { catchError, filter, map, Observable, of, switchMap, tap } from 'rxjs';
import { AccountModel } from '../../core/models/account.model';
import { TransactionsListComponent } from '../transactions/transactions-list/transactions-list.component';
import { HeadlineComponent } from '../../shared/components/layouts/headline/headline.component';

@Component({
  selector: 'app-account-details',
  imports: [
    CommonModule,
    DetailsComponent,
    TransactionsListComponent,
    HeadlineComponent,
  ],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss',
})
export class AccountDetailsComponent {
  currentAccountData$!: Observable<AccountModel>;

  headline = 'Transactions History';
  accountId = '';
  accountExists = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService
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
                  this.accountId = accountId;
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

  private redirectToBalance() {
    this.router.navigate(['/balances']);
  }
}
