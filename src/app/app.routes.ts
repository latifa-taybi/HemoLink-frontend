import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: 'login', component: Login },
      { path: 'register', component: Register },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },
  // ── Admin Back-Office (no auth guard as per spec) ───────────
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./admin/pages/overview/admin-overview.component').then(m => m.AdminOverviewComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./admin/pages/users/admin-users.component').then(m => m.AdminUsersComponent),
      },
      {
        path: 'centers',
        loadComponent: () =>
          import('./admin/pages/centers/admin-centers.component').then(m => m.AdminCentersComponent),
      },
      {
        path: 'stock',
        loadComponent: () =>
          import('./admin/pages/stock/admin-stock.component').then(m => m.AdminStockComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./admin/pages/orders/admin-orders.component').then(m => m.AdminOrdersComponent),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./admin/pages/reports/admin-reports.component').then(m => m.AdminReportsComponent),
      },
    ],
  },
  { path: 'login', redirectTo: 'auth/login' },
  { path: 'register', redirectTo: 'auth/register' },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' }
];
