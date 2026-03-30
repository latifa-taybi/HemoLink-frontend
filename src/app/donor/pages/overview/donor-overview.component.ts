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
      this.error = 'Erreur: ID utilisateur invalide ou manquant. Veuillez vous reconnecter.';
      this.loading = false;
      this.cdr.markForCheck();
      return;
    }

    this.donorService.getProfile(user.id).subscribe({
      next: (d) => {
        this.donor = d;
        this.checkEligibility(d.id);
      },
      error: (err) => {
        console.error("Erreur profil:", err);
        if (err.status === 404) {
          this.error = `Donneur non trouvé (ID: ${user.id}). Vérifiez que vous êtes inscrit.`;
        }
        this.loading = false;
        this.cdr.markForCheck();
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
