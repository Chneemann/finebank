import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { HistoryComponent } from './history/history.component';
import { AccountService } from '../../core/services/account.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-account-details',
  imports: [CommonModule, DetailsComponent, HistoryComponent],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss',
})
export class AccountDetailsComponent {
  accountExists = false;
  accountData$!: Observable<any>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.checkAccountExistence();
  }

  private checkAccountExistence() {
    this.route.paramMap.subscribe((params) => {
      const accountId = params.get('id');
      if (accountId) {
        this.accountService.existAccountId(accountId).subscribe((exists) => {
          this.accountExists = exists;
          if (!exists) {
            this.redirectToBalance();
          }
        });
      } else {
        this.redirectToBalance();
      }
    });
  }

  private redirectToBalance() {
    this.router.navigate(['/balances']);
  }

  receiveAccountData(accountData$: Observable<any>) {
    this.accountData$ = accountData$;
  }
}
