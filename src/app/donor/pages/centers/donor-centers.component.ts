import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminCentersService } from '../../../admin/services/admin-centers.service';
import { CentreCollecte } from '../../../admin/models/admin.models';

@Component({
  selector: 'app-donor-centers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-800 mb-2">Centres de Collecte</h1>
          <p class="text-gray-600">Découvrez les centres et réservez votre rendez-vous</p>
        </div>

        <!-- Search Bar -->
        <div class="mb-8">
          <input 
            [(ngModel)]="searchTerm"
            (input)="filterCenters()"
            placeholder="Rechercher un centre..."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
          />
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="bg-white rounded-lg shadow-lg p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p class="mt-4 text-gray-600">Chargement des centres...</p>
        </div>

        <!-- Centers Grid -->
        <div *ngIf="!loading && filteredCenters.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let center of filteredCenters" class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            <!-- Center Header -->
            <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
              <h3 class="text-xl font-bold">{{ center.nom }}</h3>
              <p class="text-purple-100">{{ center.ville }}</p>
            </div>

            <!-- Center Details -->
            <div class="p-6 space-y-4">
              <!-- Address -->
              <div>
                <label class="text-sm font-semibold text-gray-700">📍 Adresse</label>
                <p class="text-gray-600">{{ center.adresse }}</p>
              </div>

              <!-- Phone -->
              <div>
                <label class="text-sm font-semibold text-gray-700">📱 Téléphone</label>
                <p class="text-gray-600">{{ center.telephone }}</p>
              </div>

              <!-- Opening Hours -->
              <div>
                <label class="text-sm font-semibold text-gray-700">🕐 Horaires</label>
                <div class="mt-2 space-y-1">
                  <div *ngFor="let schedule of center.horaires" class="flex justify-between text-sm">
                    <span class="text-gray-700">{{ formatDay(schedule.jour) }}</span>
                    <span 
                      [ngClass]="schedule.ouvert ? 'text-green-600 font-semibold' : 'text-gray-400'"
                    >
                      {{ schedule.ouvert ? schedule.ouverture + ' - ' + schedule.fermeture : 'Fermé' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Action Button -->
              <button 
                (click)="bookAtCenter(center)"
                class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                📅 Réserver ici
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && filteredCenters.length === 0" class="bg-white rounded-lg shadow-lg p-8 text-center text-gray-600">
          <div class="text-4xl mb-4">🔍</div>
          <p>Aucun centre trouvé</p>
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
export class DonorCentersComponent implements OnInit {
  private readonly centersService = inject(AdminCentersService);
  private readonly cdr = inject(ChangeDetectorRef);

  centers: CentreCollecte[] = [];
  filteredCenters: CentreCollecte[] = [];
  loading = true;
  searchTerm = '';

  ngOnInit(): void {
    this.loadCenters();
  }

  loadCenters(): void {
    this.centersService.getAll().subscribe({
      next: (centers) => {
        this.centers = centers;
        this.filteredCenters = centers;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur centres:', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  filterCenters(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredCenters = this.centers.filter(c => 
      c.nom.toLowerCase().includes(term) ||
      c.ville.toLowerCase().includes(term) ||
      c.adresse.toLowerCase().includes(term)
    );
  }

  formatDay(day: string): string {
    const days: Record<string, string> = {
      'MONDAY': 'Lundi',
      'TUESDAY': 'Mardi',
      'WEDNESDAY': 'Mercredi',
      'THURSDAY': 'Jeudi',
      'FRIDAY': 'Vendredi',
      'SATURDAY': 'Samedi',
      'SUNDAY': 'Dimanche'
    };
    return days[day] || day;
  }

  bookAtCenter(center: CentreCollecte): void {
    // Navigate to appointments with center pre-selected
    window.location.href = `/donor/appointments?center=${center.id}`;
  }
}
