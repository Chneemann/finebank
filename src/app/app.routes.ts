import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'overview', component: DashboardComponent },
      { path: 'balances', component: DashboardComponent },
      { path: 'transactions', component: DashboardComponent },
      { path: 'bills', component: DashboardComponent },
      { path: 'expenses', component: DashboardComponent },
      { path: 'goals', component: DashboardComponent },
      { path: 'settings', component: DashboardComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
