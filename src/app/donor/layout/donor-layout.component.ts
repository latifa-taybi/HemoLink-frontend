import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { DonorService } from '../services/donor.service';
import { Donneur } from '../models/donor.models';

@Component({
  selector: 'app-donor-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './donor-layout.component.html',
  styleUrl: './donor-layout.component.css',
})
export class DonorLayoutComponent implements OnInit {
  public readonly authService = inject(AuthService);
  private readonly donorService = inject(DonorService);
  public readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  donor: Donneur | null = null;
  alerts: string[] = [];

  constructor() {}

  ngOnInit(): void {
    // Vérifier si authentifié
    if (!this.authService.isAuthenticated()) {
      return;
    }

    const user = this.authService.getUser();
    
    // Si pas de user en mémoire, but token existe, fetch depuis backend
    if (!user || !user.id) {
      this.authService.fetchUserData().subscribe({
        next: (u) => this.loadDonorData(u),
        error: () => console.error('Erreur récupération user')
      });
    } else {
      this.loadDonorData(user);
    }
  }

  private loadDonorData(user: any): void {
    // Vérifier que l'ID est valide (pas 0, pas négatif, pas NaN)
    if (!user || !user.id || user.id <= 0 || isNaN(user.id)) {
      console.error('ID utilisateur invalide:', user?.id, 'isNaN:', isNaN(user?.id));
      return;
    }

    this.donorService.getProfile(user.id).subscribe({
      next: (d) => {
        this.donor = d;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur lors du chargement du profil donneur', err);
        if (err.status === 404) {
          console.error('Donneur non trouvé avec ID:', user.id);
        }
      },
    });
    this.donorService.getAlerts().subscribe(a => {
      this.alerts = a;
      this.cdr.markForCheck();
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  navItems = [
    { path: '/donor/overview',      label: 'Tableau de bord',  icon: 'dashboard' },
    { path: '/donor/history',       label: 'Mon Historique',   icon: 'history'   },
    { path: '/donor/find-centers',  label: 'Trouver un centre', icon: 'map'      },
    { path: '/donor/appointments',  label: 'Mes Rendez-vous',  icon: 'calendar'  },
  ];
}
