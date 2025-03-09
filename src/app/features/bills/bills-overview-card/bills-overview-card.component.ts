import { Component, OnInit } from '@angular/core';
import { BillModel } from '../../../core/models/bill.model';
import { Observable } from 'rxjs';
import { BillsService } from '../../../core/services/bills.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bills-overview-card',
  imports: [CommonModule],
  templateUrl: './bills-overview-card.component.html',
  styleUrl: './bills-overview-card.component.scss',
})
export class BillsOverviewCardComponent implements OnInit {
  limitedUserBills$!: Observable<BillModel[]>;

  constructor(private billsService: BillsService) {}

  ngOnInit(): void {
    this.limitedUserBills$ = this.billsService.getLimitedUserBills(2);
  }
}
