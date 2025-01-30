import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/layouts/button/button.component';
import { Observable } from 'rxjs';
import { BalancesService } from './services/balances.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-balances',
  standalone: true,
  imports: [CommonModule, ButtonComponent, RouterLink],
  templateUrl: './balances.component.html',
  styleUrl: './balances.component.scss',
})
export class BalancesComponent {
  allAccounts$: Observable<any[]>;

  constructor(private balancesService: BalancesService) {
    this.allAccounts$ = this.balancesService.getAllAccounts();
  }
}
