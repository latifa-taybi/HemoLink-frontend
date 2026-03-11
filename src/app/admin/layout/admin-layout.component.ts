import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
  constructor(public authService: Auth) {}

  logout(): void {
    this.authService.logout();
    window.location.href = '/auth/login';
  }

  navItems = [
    { path: '/admin/overview', label: 'Tableau de bord', icon: 'dashboard' },
    { path: '/admin/users', label: 'Utilisateurs', icon: 'users' },
    { path: '/admin/centers', label: 'Centres de collecte', icon: 'location' },
    { path: '/admin/stock', label: 'Stock sanguin', icon: 'droplet' },
    { path: '/admin/orders', label: 'Commandes', icon: 'orders' },
    { path: '/admin/reports', label: 'Rapports', icon: 'report' },
  ];
}
