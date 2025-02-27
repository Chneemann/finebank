import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { OverviewComponent } from './features/overview/overview.component';
import { BalancesComponent } from './features/balances/balances.component';
import { TransactionsComponent } from './features/transactions/transactions.component';
import { AccountDetailsComponent } from './features/account-details/account-details.component';
import { GoalsComponent } from './features/goals/goals.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'balances', component: BalancesComponent },
      { path: 'account-details/:id', component: AccountDetailsComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'bills', component: OverviewComponent },
      { path: 'expenses', component: OverviewComponent },
      { path: 'goals', component: GoalsComponent },
      { path: 'settings', component: OverviewComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
