import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { DonorService } from '../../services/donor.service';
import { Eligibilite } from '../../models/donor.models';

@Component({
  selector: 'app-donor-eligibility',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div class="max-w-2xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-800 mb-2">Éligibilité au Don</h1>
          <p class="text-gray-600">Vérifiez si vous pouvez donner maintenant</p>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="bg-white rounded-lg shadow-lg p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p class="mt-4 text-gray-600">Vérification de votre éligibilité...</p>
        </div>

        <!-- Eligibility Result -->
        <div *ngIf="!loading && eligibility" class="space-y-6">
          <!-- Green Card - Eligible -->
          <div *ngIf="eligibility.eligible" class="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-lg p-8">
            <div class="flex items-start justify-between">
              <div>
                <div class="text-6xl mb-4">✅</div>
                <h2 class="text-3xl font-bold mb-2">Vous pouvez donner!</h2>
                <p class="text-green-100 text-lg">Vous êtes éligible pour une donation maintenant.</p>
              </div>
            </div>
          </div>

          <!-- Red Card - Not Eligible -->
          <div *ngIf="!eligibility.eligible" class="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg shadow-lg p-8">
            <div class="flex items-start justify-between">
              <div>
                <div class="text-6xl mb-4">⏳</div>
                <h2 class="text-3xl font-bold mb-2">Délai de carence actif</h2>
                <p class="text-red-100 text-lg">Vous devez attendre avant de pouvoir donner à nouveau.</p>
              </div>
            </div>
          </div>

          <!-- Details Card -->
          <div class="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <!-- Next Eligible Date -->
            <div class="border-l-4 border-blue-600 pl-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Prochaine date d'éligibilité</label>
              <p class="text-2xl font-bold text-gray-800">
                {{ formatDate(eligibility.prochaineDate) }}
              </p>
              <p class="text-gray-600 mt-2">
                {{ eligibility.joursRestants === 0 ? '✓ Vous pouvez donner dès maintenant!' : 'Jours restants: ' + eligibility.joursRestants }}
              </p>
            </div>

            <!-- Reason -->
            <div *ngIf="eligibility.motif" class="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p class="text-yellow-800 font-semibold">ℹ️ Raison du délai</p>
              <p class="text-yellow-700 mt-2">{{ eligibility.motif }}</p>
            </div>

            <!-- Withdrawal Rule Info -->
            <div class="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p class="text-blue-900 font-semibold">📋 Règle du délai de carence</p>
              <p class="text-blue-800 mt-2">
                Vous devez respecter un délai minimum de <strong>8 semaines (56 jours)</strong> entre deux donations.
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4">
            <button 
              *ngIf="eligibility.eligible"
              (click)="bookAppointment()"
              class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              📅 Réserver un rendez-vous
            </button>
            <button 
              (click)="goBack()"
              class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-lg transition"
            >
              ← Retour
            </button>
          </div>
        </div>

        <!-- Error State -->
        <div *ngIf="!loading && !eligibility" class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          Impossible de charger les informations d'éligibilité
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class DonorEligibilityComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly donorService = inject(DonorService);
  private readonly cdr = inject(ChangeDetectorRef);

  eligibility: Eligibilite | null = null;
  loading = true;

  ngOnInit(): void {
    this.checkEligibility();
  }

  checkEligibility(): void {
    const user = this.authService.getUser();
    if (!user || !user.id || user.id <= 0 || isNaN(user.id)) {
      this.loading = false;
      return;
    }

    this.donorService.getEligibility(user.id).subscribe({
      next: (e) => {
        this.eligibility = e;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur éligibilité:', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  bookAppointment(): void {
    // Navigate to appointments booking
    window.location.href = '/donor/appointments';
  }

  goBack(): void {
    window.history.back();
  }
}
