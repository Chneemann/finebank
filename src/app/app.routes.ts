import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { OverviewComponent } from './features/overview/overview.component';
import { BalancesComponent } from './features/balances/balances.component';
import { TransactionsComponent } from './features/transactions/transactions.component';
import { AccountDetailsComponent } from './features/account-details/account-details.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'balances', component: BalancesComponent },
      { path: 'account-details/:id', component: AccountDetailsComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'bills', component: OverviewComponent },
      { path: 'expenses', component: OverviewComponent },
      { path: 'goals', component: OverviewComponent },
      { path: 'settings', component: OverviewComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
