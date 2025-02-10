import { Component, Input } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/layouts/button/button.component';
import { CommonModule } from '@angular/common';
import { map, Observable, of, Subscription, switchMap } from 'rxjs';
import { AccountService } from '../../../core/services/account.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-history',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent {
  @Input() accountData$!: Observable<any>;
  transactionsData$!: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.loadTransactionsData();
  }

  private loadTransactionsData() {
    this.transactionsData$ = this.route.paramMap.pipe(
      map((params) => params.get('id')),
      switchMap((accountId) =>
        accountId
          ? this.accountService.getTransactionDataByAccountId(accountId).pipe()
          : of(null)
      )
    );
  }
}
