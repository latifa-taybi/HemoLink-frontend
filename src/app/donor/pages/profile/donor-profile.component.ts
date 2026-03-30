import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { DonorService } from '../../services/donor.service';
import { Donneur } from '../../models/donor.models';

@Component({
  selector: 'app-donor-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-6">
      <div class="max-w-2xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-800 mb-2">Mon Profil</h1>
          <p class="text-gray-600">Consultez et gérez vos informations personnelles</p>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="bg-white rounded-lg shadow-lg p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p class="mt-4 text-gray-600">Chargement de votre profil...</p>
        </div>

        <!-- Profile Card -->
        <div *ngIf="!loading && donor" class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Profile Header -->
          <div class="bg-gradient-to-r from-red-600 to-pink-600 text-white p-8">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-3xl font-bold">{{ donor.prenom }} {{ donor.nom }}</h2>
                <p class="text-red-100 mt-2">{{ donor.email }}</p>
              </div>
              <div class="text-5xl opacity-30">👤</div>
            </div>
          </div>

          <!-- Profile Details -->
          <div class="p-8 space-y-6">
            <!-- Basic Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-gray-50 p-4 rounded-lg">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Prénom</label>
                <input 
                  [(ngModel)]="donor.prenom" 
                  [readonly]="!isEditing"
                  class="w-full px-3 py-2 border rounded-lg"
                  [ngClass]="isEditing ? 'border-red-300' : 'border-gray-300 bg-gray-50'"
                />
              </div>

              <div class="bg-gray-50 p-4 rounded-lg">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
                <input 
                  [(ngModel)]="donor.nom" 
                  [readonly]="!isEditing"
                  class="w-full px-3 py-2 border rounded-lg"
                  [ngClass]="isEditing ? 'border-red-300' : 'border-gray-300 bg-gray-50'"
                />
              </div>
            </div>

            <!-- Contact Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-gray-50 p-4 rounded-lg">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input 
                  [(ngModel)]="donor.email"
                  [readonly]="!isEditing"
                  class="w-full px-3 py-2 border rounded-lg"
                  [ngClass]="isEditing ? 'border-red-300' : 'border-gray-300 bg-gray-50'"
                />
              </div>

              <div class="bg-gray-50 p-4 rounded-lg">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
                <input 
                  [(ngModel)]="donor.telephone"
                  [readonly]="!isEditing"
                  class="w-full px-3 py-2 border rounded-lg"
                  [ngClass]="isEditing ? 'border-red-300' : 'border-gray-300 bg-gray-50'"
                />
              </div>
            </div>

            <!-- Blood Group & Status -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-gray-50 p-4 rounded-lg">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Groupe Sanguin</label>
                <div class="text-2xl font-bold text-red-600">
                  {{ donor.groupeSanguin || 'Non renseigné' }}
                </div>
              </div>

              <div class="bg-gray-50 p-4 rounded-lg">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Statut</label>
                <div class="flex items-center">
                  <span 
                    class="inline-block w-3 h-3 rounded-full mr-2"
                    [ngClass]="donor.actif ? 'bg-green-500' : 'bg-gray-400'"
                  ></span>
                  <span [ngClass]="donor.actif ? 'text-green-600 font-semibold' : 'text-gray-600'">
                    {{ donor.actif ? 'Actif' : 'Inactif' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Member Since -->
            <div class="bg-blue-50 p-4 rounded-lg">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Membre depuis</label>
              <p class="text-gray-600">{{ donor.creeLe ? formatDate(donor.creeLe) : 'Non renseigné' }}</p>
            </div>

            <!-- Error Message -->
            <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {{ error }}
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-4 pt-4">
              <button 
                *ngIf="!isEditing"
                (click)="startEdit()"
                class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                ✏️ Modifier
              </button>
              <button 
                *ngIf="isEditing"
                (click)="saveChanges()"
                class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                ✓ Enregistrer
              </button>
              <button 
                *ngIf="isEditing"
                (click)="cancelEdit()"
                class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-lg transition"
              >
                ✕ Annuler
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && !donor" class="bg-white rounded-lg shadow-lg p-8 text-center text-gray-600">
          Profil non disponible
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
export class DonorProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly donorService = inject(DonorService);
  private readonly cdr = inject(ChangeDetectorRef);

  donor: Donneur | null = null;
  loading = true;
  isEditing = false;
  error: string | null = null;
  private originalDonor: Donneur | null = null;

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const user = this.authService.getUser();
    if (!user || !user.id || user.id <= 0 || isNaN(user.id)) {
      this.error = 'Erreur: ID utilisateur invalide';
      this.loading = false;
      return;
    }

    this.donorService.getProfile(user.id).subscribe({
      next: (d) => {
        this.donor = d;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        console.error('Erreur chargement profil:', err);
        if (user?.email) {
          this.donorService.getDonneurByEmail(user.email).subscribe({
            next: (d: any) => {
              if (d) {
                this.donor = d;
              } else {
                this.error = 'Profil donneur non trouvé';
              }
              this.loading = false;
              this.cdr.markForCheck();
            },
            error: () => {
              this.error = 'Impossible de charger votre profil';
              this.loading = false;
              this.cdr.markForCheck();
            }
          });
        } else {
          this.error = 'Impossible de charger votre profil';
          this.loading = false;
          this.cdr.markForCheck();
        }
      }
    });
  }

  startEdit(): void {
    this.isEditing = true;
    this.originalDonor = this.donor ? { ...this.donor } : null;
    this.cdr.markForCheck();
  }

  cancelEdit(): void {
    this.isEditing = false;
    if (this.originalDonor) {
      this.donor = { ...this.originalDonor };
    }
    this.originalDonor = null;
    this.cdr.markForCheck();
  }

  saveChanges(): void {
    if (!this.donor) return;
    this.isEditing = false;
    this.cdr.markForCheck();
    // TODO: Implement profile update via API
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
}
