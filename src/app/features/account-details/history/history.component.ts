import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/layouts/button/button.component';
import { CommonModule } from '@angular/common';
import { map, Observable, of, switchMap } from 'rxjs';
import { AccountDetailsService } from '../services/account-details.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-history',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent {
  transactionsData$!: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private accountDetailsService: AccountDetailsService
  ) {}

  ngOnInit() {
    this.loadAccountData();
  }

  private loadAccountData() {
    this.transactionsData$ = this.route.paramMap.pipe(
      map((params) => params.get('id')),
      switchMap((accountId) =>
        accountId
          ? this.accountDetailsService
              .getTransactionDataByAccountId(accountId)
              .pipe()
          : of(null)
      )
    );
  }
}
