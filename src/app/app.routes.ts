import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { personnelGuard } from './guards/personnel-guard';
import { DonorLayoutComponent } from './donor/layout/donor-layout.component';

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
  // ── Donor Space ─────────────────────────────────────────────
  {
    path: 'donor',
    component: DonorLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./donor/pages/overview/donor-overview.component').then(m => m.DonorOverviewComponent),
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./donor/pages/history/donor-history.component').then(m => m.DonorHistoryComponent),
      },
      {
        path: 'find-centers',
        loadComponent: () =>
          import('./donor/pages/map/donor-map.component').then(m => m.DonorMapComponent),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./donor/pages/appointments/donor-appointments.component').then(m => m.DonorAppointmentsComponent),
      },
    ],
  },
  // ── Laboratoire Space ────────────────────────────────ــــ─
  {
    path: 'labo',
    loadComponent: () =>
      import('./labo/layout/labo-layout.component').then(m => m.LaboLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./labo/pages/overview/labo-overview.component').then(m => m.LaboOverviewComponent),
      },
      {
        path: 'create-bags',
        loadComponent: () =>
          import('./labo/pages/create-bags/labo-create-bags.component').then(m => m.LaboCreateBagsComponent),
      },
      {
        path: 'tests',
        loadComponent: () =>
          import('./labo/pages/tests/labo-tests.component').then(m => m.LaboTestsComponent),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./labo/pages/inventory/labo-inventory.component').then(m => m.LaboInventoryComponent),
      },
    ],
  },
  // ── Hospital Space ──────────────────────────────────────────
  {
    path: 'hospital',
    loadComponent: () =>
      import('./hospital/layout/hospital-layout.component').then(m => m.HospitalLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./hospital/pages/overview/hospital-overview.component').then(m => m.HospitalOverviewComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./hospital/pages/orders/hospital-orders.component').then(m => m.HospitalOrdersComponent),
      },
      {
        path: 'create-order',
        loadComponent: () =>
          import('./hospital/pages/create-order/hospital-create-order.component').then(m => m.HospitalCreateOrderComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./hospital/pages/profile/hospital-profile.component').then(m => m.HospitalProfileComponent),
      },
    ],
  },
  // ── Personnel Centre Space ───────────────────────────────────
  {
    path: 'personnel',
    loadComponent: () =>
      import('./personnel/layout/personnel-layout.component').then(m => m.PersonnelLayoutComponent),
    canActivate: [personnelGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./personnel/pages/overview/personnel-overview.component').then(m => m.PersonnelOverviewComponent),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./personnel/pages/appointments/personnel-appointments.component').then(m => m.PersonnelAppointmentsComponent),
      },
      {
        path: 'create-donation',
        loadComponent: () =>
          import('./personnel/pages/create-donation/personnel-create-donation.component').then(m => m.PersonnelCreateDonationComponent),
      },
    ],
  },
  { path: 'login', redirectTo: 'auth/login' },
  { path: 'register', redirectTo: 'auth/register' },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' }
];
