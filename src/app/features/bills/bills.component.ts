import { Component, OnInit } from '@angular/core';
import { BillsService } from '../../core/services/bills.service';
import { Observable } from 'rxjs';
import { BillModel } from '../../core/models/bill.model';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../core/services/account.service';
import { AccountModel } from '../../core/models/account.model';
import { FormsModule } from '@angular/forms';
import { HeadlineComponent } from '../../shared/components/layouts/headline/headline.component';

@Component({
  selector: 'app-bills',
  imports: [CommonModule, FormsModule, HeadlineComponent],
  templateUrl: './bills.component.html',
  styleUrl: './bills.component.scss',
})
export class BillsComponent implements OnInit {
  userBills$!: Observable<BillModel[]>;
  accountsData$!: Observable<AccountModel[]>;

  selectedAccount: string = '';

  constructor(
    private billsService: BillsService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.userBills$ = this.billsService.userBills$;
    this.accountsData$ = this.accountService.getAllUserAccounts();

    this.accountsData$.subscribe((accounts) => {
      if (accounts && accounts.length > 0) {
        if (this.selectedAccount === '') {
          this.selectedAccount = '';
        } else {
          this.selectedAccount = accounts[0].id ?? '';
        }
      }
    });
  }

  setSelectedAccount(): void {
    this.selectedAccount;
  }
}
