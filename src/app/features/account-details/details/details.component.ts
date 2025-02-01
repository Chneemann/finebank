import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/layouts/button/button.component';
import { AccountDetailsService } from '../services/account-details.service';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  @Output() accountDataEmitter = new EventEmitter<Observable<any>>();

  accountData$!: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private accountDetailsService: AccountDetailsService
  ) {}

  ngOnInit() {
    this.loadAccountData();
  }

  private loadAccountData() {
    this.accountData$ = this.route.paramMap.pipe(
      map((params) => params.get('id')),
      switchMap((accountId) =>
        accountId
          ? this.accountDetailsService.getAccountDataById(accountId).pipe()
          : of(null)
      )
    );
    this.accountDataEmitter.emit(this.accountData$);
  }
}
