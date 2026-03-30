import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RoleUtilisateur } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  // Make enum available in template
  RoleUtilisateur = RoleUtilisateur;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    if (this.authService.getUser()?.role === RoleUtilisateur.ADMIN) this.router.navigate(['/admin']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  getRoleLabel(role: RoleUtilisateur): string {
    const labels: Record<RoleUtilisateur, string> = {
      [RoleUtilisateur.DONNEUR]: 'Donneur de sang',
      [RoleUtilisateur.LABO_PERSONNEL]: 'Personnel Laboratoire',
      [RoleUtilisateur.HOPITAL]: 'Personnel Hôpital',
      [RoleUtilisateur.ADMIN]: 'Administrateur',
      [RoleUtilisateur.PERSONNEL_CENTRE]: 'Personnel Centre Collecte'
    };
    return labels[role] || role;
  }

  formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch { return dateStr; }
  }

  getActionUrl(role: RoleUtilisateur): string {
    switch (role) {
      case RoleUtilisateur.ADMIN: return '/admin';
      case RoleUtilisateur.LABO_PERSONNEL: return '/labo';
      case RoleUtilisateur.HOPITAL: return '/hopital';
      case RoleUtilisateur.PERSONNEL_CENTRE: return '/centre';
      default: return '/donor';
    }
  }
}
