import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { OverviewComponent } from './features/overview/overview.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'balances', component: OverviewComponent },
      { path: 'transactions', component: OverviewComponent },
      { path: 'bills', component: OverviewComponent },
      { path: 'expenses', component: OverviewComponent },
      { path: 'goals', component: OverviewComponent },
      { path: 'settings', component: OverviewComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
