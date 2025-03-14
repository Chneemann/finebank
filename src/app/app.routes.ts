import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { OverviewComponent } from './features/overview/overview.component';
import { BalancesComponent } from './features/balances/balances.component';
import { TransactionsComponent } from './features/transactions/transactions.component';
import { AccountDetailsComponent } from './features/account-details/account-details.component';
import { GoalsComponent } from './features/goals/goals.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ExpensesComponent } from './features/expenses/expenses.component';
import { BillsComponent } from './features/bills/bills.component';
import { StatisticsComponent } from './features/statistics/statistics.component';

export const routes: Routes = [
  // { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'balances', component: BalancesComponent },
      { path: 'statistics', component: StatisticsComponent },
      { path: 'account-details/:id', component: AccountDetailsComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'bills', component: BillsComponent },
      { path: 'expenses', component: ExpensesComponent },
      { path: 'goals', component: GoalsComponent },
      { path: 'settings', component: OverviewComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
