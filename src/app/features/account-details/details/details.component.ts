import { Component, Input } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/layouts/button/button.component';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AccountModel } from '../../../core/models/account.model';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  @Input() currentBalance$!: Observable<number>;
  @Input() currentAccountData$!: Observable<AccountModel>;

  constructor() {}
}
