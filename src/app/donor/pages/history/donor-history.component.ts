import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DonorService } from '../../services/donor.service';
import { Don } from '../../models/donor.models';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-donor-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './donor-history.component.html',
  styleUrl: './donor-history.component.css'
})
export class DonorHistoryComponent implements OnInit {
  private readonly donorService = inject(DonorService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  history: Don[] = [];
  loading = true;
  annualQuota: number = 0;
  maxAnnualQuota: number = 4;

  constructor() {}

  ngOnInit(): void {
    // Vérifier si authentifié
    if (!this.authService.isAuthenticated()) {
      this.stopLoading();
      return;
    }

    const user = this.authService.getUser();
    
    // Si pas de user en mémoire, but token existe, fetch depuis backend
    if (!user || !user.id) {
      this.authService.fetchUserData().subscribe({
        next: (u) => this.loadHistory(u),
        error: () => this.stopLoading()
      });
    } else {
      this.loadHistory(user);
    }
  }

  private loadHistory(user: any): void {
    // Vérifier que l'ID est valide (pas 0, pas négatif, pas NaN)
    if (!user || !user.id || user.id <= 0 || isNaN(user.id)) {
      console.error('ID utilisateur invalide:', user?.id, 'isNaN:', isNaN(user?.id));
      this.stopLoading();
      return;
    }

    this.donorService.getProfile(user.id).subscribe({
      next: (d) => {
        // Load history
        this.donorService.getHistory(d.id).subscribe({
          next: (h) => {
            this.history = h.sort((a, b) => new Date(b.dateDon).getTime() - new Date(a.dateDon).getTime());
            this.stopLoading();
          },
          error: (err) => {
            console.error('Erreur historique:', err);
            this.history = [];
            this.stopLoading();
          }
        });

        // Load annual quota
        this.donorService.getAnnualQuota(d.id).subscribe({
          next: (quota) => {
            this.annualQuota = quota.count || 0;
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error('Erreur quota annuel:', err);
            this.annualQuota = 0;
          }
        });
      },
      error: (err: any) => {
        console.error('Erreur profil:', err);
        // Fallback: search by email
        const user = this.authService.getUser();
        if (user?.email) {
          this.donorService.getDonneurByEmail(user.email).subscribe({
            next: (d: any) => {
              if (d) {
                // Load history for this donor
                this.donorService.getHistory(d.id).subscribe({
                  next: (h) => {
                    this.history = h.sort((a: any, b: any) => new Date(b.dateDon).getTime() - new Date(a.dateDon).getTime());
                    this.stopLoading();
                  },
                  error: () => {
                    this.history = [];
                    this.stopLoading();
                  }
                });
                // Load annual quota
                this.donorService.getAnnualQuota(d.id).subscribe({
                  next: (quota) => {
                    this.annualQuota = quota.count || 0;
                    this.cdr.markForCheck();
                  },
                  error: () => this.annualQuota = 0
                });
              } else {
                this.history = [];
                this.stopLoading();
              }
            },
            error: () => {
              this.history = [];
              this.stopLoading();
            }
          });
        } else {
          this.history = [];
          this.stopLoading();
        }
      }
    });
  }

  private stopLoading(): void {
    this.loading = false;
    this.cdr.markForCheck();
  }

  get quotaPercentage(): number {
    return (this.annualQuota / this.maxAnnualQuota) * 100;
  }

  get quotaRemaining(): number {
    return Math.max(0, this.maxAnnualQuota - this.annualQuota);
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      EN_ATTENTE_TEST: '🔬 En analyse',
      DISPONIBLE: '✅ Validé',
      TRANSFUSEE: '❤️ Transfusé',
      ECARTEE: '⚠️ Écarté',
      EXPIREE: '⏰ Expiré'
    };
    return map[status] || status;
  }

  getStatusClass(status: string): string {
    if (status === 'DISPONIBLE' || status === 'TRANSFUSEE') return 'status-ok';
    if (status === 'EN_ATTENTE_TEST') return 'status-pending';
    return 'status-error';
  }
}
