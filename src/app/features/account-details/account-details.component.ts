import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { HistoryComponent } from './history/history.component';

@Component({
  selector: 'app-account-details',
  imports: [DetailsComponent, HistoryComponent],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss',
})
export class AccountDetailsComponent {
  accountId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.accountId = params.get('id');
    });
  }
}
