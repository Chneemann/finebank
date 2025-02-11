import { Component, Input } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/layouts/button/button.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-history',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent {
  @Input() currentAccountData$!: Observable<any>;
  @Input() currentTransactionsData$!: Observable<any>;

  constructor() {}
}
