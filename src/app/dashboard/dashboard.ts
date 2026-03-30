import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Auth, RoleUtilisateur } from '../services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  constructor(
    public authService: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    
    const user = this.authService.getUser();
    if (user?.role === RoleUtilisateur.ADMIN) {
      this.router.navigate(['/admin']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  getRoleLabel(role: RoleUtilisateur): string {
    const labels: Record<RoleUtilisateur, string> = {
      [RoleUtilisateur.DONNEUR]: 'Donneur de sang',
      [RoleUtilisateur.TECHNICIEN_LABO]: 'Technicien Lab',
      [RoleUtilisateur.PERSONNEL_HOPITAL]: 'Personnel Hôpital',
      [RoleUtilisateur.ADMIN]: 'Administrateur',
      [RoleUtilisateur.PERSONNEL_CENTRE]: 'Personnel Centre'
    };
    return labels[role] || role;
  }

  formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  }

  getActionUrl(role: RoleUtilisateur): string {
    switch (role) {
      case RoleUtilisateur.ADMIN:
        return '/admin';
      case RoleUtilisateur.TECHNICIEN_LABO:
        return '/labo';
      case RoleUtilisateur.PERSONNEL_HOPITAL:
        return '/hopital';
      case RoleUtilisateur.PERSONNEL_CENTRE:
        return '/personnel';
      case RoleUtilisateur.DONNEUR:
      default:
        return '/donneur';
    }
  }
}
