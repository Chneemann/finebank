import { Component, OnInit } from '@angular/core';
import { BillsService } from '../../core/services/bills.service';
import { Observable } from 'rxjs';
import { BillModel } from '../../core/models/bill.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bills',
  imports: [CommonModule],
  templateUrl: './bills.component.html',
  styleUrl: './bills.component.scss',
})
export class BillsComponent implements OnInit {
  allUserBills$!: Observable<BillModel[]>;

  constructor(private billsService: BillsService) {}

  ngOnInit(): void {
    this.allUserBills$ = this.billsService.allUserBills$;
  }
}
