import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DonorService } from '../../services/donor.service';
import { Donneur, Eligibilite } from '../../models/donor.models';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-donor-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './donor-overview.component.html',
  styleUrl: './donor-overview.component.css'
})
export class DonorOverviewComponent implements OnInit {
  private readonly donorService = inject(DonorService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  donor: Donneur | null = null;
  eligibility: Eligibilite | null = null;
  loading = true;
  error: string | null = null;

  constructor() {}

  ngOnInit(): void {
    // Vérifier si authentifié
    if (!this.authService.isAuthenticated()) {
      this.loading = false;
      this.cdr.markForCheck();
      return;
    }

    const user = this.authService.getUser();
    
    // Si pas de user en mémoire, but token existe, fetch depuis backend
    if (!user || !user.id) {
      this.authService.fetchUserData().subscribe({
        next: (u) => this.loadDonorProfile(u),
        error: (err) => {
          console.error("Erreur récupération user:", err);
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.loadDonorProfile(user);
    }
  }

  private loadDonorProfile(user: any): void {
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
      this.loading = false;
      this.cdr.markForCheck();
      return;
    }

    // Try to fetch full profile, but don't fail if not found
    this.donorService.getProfile(user.id).subscribe({
      next: (d) => {
        this.donor = d;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        if (user?.email) {
          this.donorService.getDonneurByEmail(user.email).subscribe({
            next: (d: any) => {
              this.donor = d || {
                id: user?.id || 0,
                utilisateurId: user?.id || 0,
                groupeSanguin: 'O_POS' as any,
                nombreDonsAnnuel: 0,
                nom: user?.nom || '',
                prenom: user?.prenom || 'Utilisateur',
                email: user?.email || '',
                telephone: user?.telephone || ''
              };
              this.loading = false;
              this.cdr.markForCheck();
            },
            error: () => {
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
              this.loading = false;
              this.cdr.markForCheck();
            }
          });
        } else {
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
          this.loading = false;
          this.cdr.markForCheck();
        }
      }
    });
  }

  checkEligibility(doneurId: number): void {
    this.donorService.getEligibility(doneurId).subscribe({
      next: (e) => {
        this.eligibility = e;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
