import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-transactions-card',
  imports: [RouterLink, RouterModule],
  templateUrl: './transactions-card.component.html',
  styleUrl: './transactions-card.component.scss',
})
export class TransactionsCardComponent {}
