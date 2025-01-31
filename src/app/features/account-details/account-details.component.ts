import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '../../shared/components/layouts/button/button.component';

@Component({
  selector: 'app-account-details',
  imports: [ButtonComponent],
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
