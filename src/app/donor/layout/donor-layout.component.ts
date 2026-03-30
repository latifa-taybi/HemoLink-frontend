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
      // Use JWT data as fallback
      this.donor = {
        id: user?.id || 0,
        utilisateurId: user?.id || 0,
        groupeSanguin: 'O_POS' as any,
        nombreDonsAnnuel: 0,
        nom: user?.nom || '',
        prenom: user?.prenom || 'Utilisateur',
        email: user?.email || '',
        telephone: user?.telephone || ''
      };
      this.cdr.markForCheck();
      return;
    }

    // Try to fetch full profile, but don't fail if not found
    this.donorService.getProfile(user.id).subscribe({
      next: (d) => {
        this.donor = d;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        console.warn('Profil donneur complet non disponible, utilisation données JWT:', err?.status);
        
        // Try email-based lookup
        if (user?.email) {
          this.donorService.getDonneurByEmail(user.email).subscribe({
            next: (donneur: any) => {
              if (donneur) {
                this.donor = donneur;
                console.log('Donneur trouvé par email pour layout:', donneur.email);
              } else {
                // Fallback to JWT data
                this.donor = {
                  id: user?.id || 0,
                  utilisateurId: user?.id || 0,
                  groupeSanguin: 'O_POS' as any,
                  nombreDonsAnnuel: 0,
                  nom: user?.nom || '',
                  prenom: user?.prenom || 'Utilisateur',
                  email: user?.email || '',
                  telephone: user?.telephone || ''
                };
              }
              this.cdr.markForCheck();
            },
            error: (err2: any) => {
              console.warn('Email lookup failed, using JWT data:', err2);
              this.donor = {
                id: user?.id || 0,
                utilisateurId: user?.id || 0,
                groupeSanguin: 'O_POS' as any,
                nombreDonsAnnuel: 0,
                nom: user?.nom || '',
                prenom: user?.prenom || 'Utilisateur',
                email: user?.email || '',
                telephone: user?.telephone || ''
              };
              this.cdr.markForCheck();
            }
          });
        } else {
          // Fallback to JWT data
          this.donor = {
            id: user?.id || 0,
            utilisateurId: user?.id || 0,
            groupeSanguin: 'O_POS' as any,
            nombreDonsAnnuel: 0,
            nom: user?.nom || '',
            prenom: user?.prenom || 'Utilisateur',
            email: user?.email || '',
            telephone: user?.telephone || ''
          };
          this.cdr.markForCheck();
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
    { path: 'overview',       label: 'Tableau de bord',  icon: 'dashboard' },
    { path: 'profile',        label: 'Mon Profil',       icon: 'person'    },
    { path: 'eligibility',    label: 'Puis-je donner?',  icon: 'check'     },
    { path: 'history',        label: 'Mon Historique',   icon: 'history'   },
    { path: 'centers',        label: 'Centres',          icon: 'location'  },
    { path: 'appointments',   label: 'Mes RDV',          icon: 'calendar'  },
    { path: 'notifications',  label: 'Notifications',    icon: 'bell'      },
  ];
}
