import { Component, Input } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/layouts/button/button.component';
import { combineLatest, map, Observable, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AccountModel } from '../../../core/models/account.model';
import { BalancesService } from '../../../core/services/balances.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  @Input() currentAccountData$!: Observable<AccountModel>;

  private destroy$ = new Subject<void>();
  accountsBalances$!: Observable<{ accountId: string; balance: number }[]>;
  currentBalance$!: Observable<number>;

  constructor(private balancesService: BalancesService) {}

  ngOnInit(): void {
    this.accountsBalances$ = this.balancesService.accountsBalances$;
    this.currentBalance$ = this.getCurrentBalance();
  }

  private getCurrentBalance(): Observable<number> {
    return combineLatest([
      this.accountsBalances$,
      this.currentAccountData$,
    ]).pipe(
      map(
        ([balances, account]) =>
          balances.find((b) => b.accountId === account.id)?.balance ?? 0
      )
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
