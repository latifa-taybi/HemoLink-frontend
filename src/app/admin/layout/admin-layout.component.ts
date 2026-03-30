import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * AdminLayoutComponent
 * Main layout component for admin module
 * Provides navigation sidebar and main content area
 */
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent implements OnInit {
  public readonly authService = inject(AuthService);

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      return;
    }
  }

  /**
   * Toggles sidebar visibility on mobile
   */
  toggleSidebar(): void {
    // Mobile sidebar toggle functionality
  }

  /**
   * Logs out admin user
   */
  logout(): void {
    this.authService.logout();
  }

  /**
   * Navigation menu items for admin sidebar
   */
  navItems = [
    { path: 'overview', label: 'Tableau de bord', icon: 'dashboard' },
    { path: 'users', label: 'Utilisateurs', icon: 'users' },
    { path: 'centers', label: 'Centres de collecte', icon: 'location' },
    { path: 'stock', label: 'Stock sanguin', icon: 'droplet' },
    { path: 'orders', label: 'Commandes', icon: 'orders' },
    { path: 'reports', label: 'Rapports', icon: 'report' },
  ];
}
