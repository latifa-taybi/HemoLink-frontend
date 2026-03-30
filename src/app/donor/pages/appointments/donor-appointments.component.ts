import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DonorService } from '../../services/donor.service';
import { AdminCentersService } from '../../../admin/services/admin-centers.service';
import { Donneur, RendezVous, CreateRendezVousDto, StatutRendezVous } from '../../models/donor.models';
import { CentreCollecte } from '../../../admin/models/admin.models';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-donor-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donor-appointments.component.html',
  styleUrl: './donor-appointments.component.css'
})
export class DonorAppointmentsComponent implements OnInit {
  private readonly donorService = inject(DonorService);
  private readonly centersService = inject(AdminCentersService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly route = inject(ActivatedRoute);

  donor: Donneur | null = null;
  appointments: RendezVous[] = [];
  centers: CentreCollecte[] = [];
  loading = true;
  showModal = false;
  error: string | null = null;
  bookingError: string | null = null;

  newAppointment: CreateRendezVousDto = {
    dateHeure: '',
    centreId: 0,
    donneurId: 0
  };

  constructor() {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    
    // Vérifier si authentifié
    if (!this.authService.isAuthenticated()) {
      this.error = 'Veuillez vous connecter.';
      this.stopLoading();
      return;
    }

    // Si pas de user en mémoire, but token existe, fetch depuis backend
    if (!user || !user.id) {
      this.authService.fetchUserData().subscribe({
        next: (u) => this.loadDonorData(u),
        error: (err) => {
          console.error("Erreur récupération user:", err);
          this.error = 'Impossible de charger votre profil.';
          this.stopLoading();
        }
      });
    } else {
      this.loadDonorData(user);
    }
  }

  private loadDonorData(user: any): void {
    // Vérifier que l'ID est valide (pas 0, pas négatif, pas NaN)
    if (!user || !user.id || user.id <= 0 || isNaN(user.id)) {
      this.error = 'Erreur: ID utilisateur invalide ou manquant. Veuillez vous reconnecter.';
      this.stopLoading();
      console.error('ID utilisateur invalide:', user?.id, 'isNaN:', isNaN(user?.id));
      return;
    }

    // First load centers
    this.centersService.getAll().subscribe({
      next: (c) => {
        this.centers = c;
        this.error = null;
        
        // Check queryParams "center"
        this.route.queryParams.subscribe(params => {
          if (params['center']) {
            this.newAppointment.centreId = Number(params['center']);
            this.showModal = true;
          }
        });

        // Fetch profile and appointments
        this.donorService.getProfile(user.id).subscribe({
          next: (d) => {
            this.donor = d;
            this.newAppointment.donneurId = d.id;
            this.loadAppointments(d.id);
          },
          error: (err) => {
            console.error("Erreur profil:", err);
            if (err.status === 404) {
              this.error = `Donneur non trouvé (ID: ${user.id}). Vérifiez que vous êtes inscrit.`;
            } else {
              this.error = 'Impossible de charger votre profil.';
            }
            this.stopLoading();
          }
        });
      },
      error: (err) => {
        console.error("Erreur centres:", err);
        let errorMsg = 'Impossible de charger les centres de collecte.';
        if (err.status === 500) {
          errorMsg += ' Le serveur backend n\'implémente pas l\'endpoint /api/centres-collecte.';
        } else if (err.status === 0) {
          errorMsg += ' Impossible de se connecter au backend.';
        }
        this.error = errorMsg;
        this.stopLoading();
      }
    });
  }

  loadAppointments(donneurId: number): void {
    this.donorService.getAppointments(donneurId).subscribe({
      next: (data) => {
        this.appointments = data.sort((a,b) => new Date(b.dateHeure).getTime() - new Date(a.dateHeure).getTime());
        this.stopLoading();
      },
      error: (err) => {
        console.error("Erreur rendez-vous:", err);
        this.appointments = [];
        this.stopLoading();
      }
    });
  }

  stopLoading(): void {
    this.loading = false;
    this.cdr.markForCheck();
  }

  openBookingModal(): void {
    if (!this.donor) return;
    if (this.centers.length === 0) {
      this.bookingError = 'Aucun centre disponible. Vérifiez le serveur.';
      return;
    }
    this.newAppointment = {
      dateHeure: '',
      centreId: this.centers[0]?.id || 0,
      donneurId: this.donor.id
    };
    this.bookingError = null;
    this.showModal = true;
    this.cdr.markForCheck();
  }

  submitBooking(): void {
    if (!this.newAppointment.dateHeure || !this.newAppointment.centreId) {
      this.bookingError = 'Veuillez remplir tous les champs.';
      return;
    }
    
    this.loading = true;
    this.bookingError = null;
    this.cdr.markForCheck();

    this.donorService.bookAppointment(this.newAppointment).subscribe({
      next: () => {
        if (this.donor) this.loadAppointments(this.donor.id);
        this.showModal = false;
      },
      error: (err) => {
        console.error('Erreur réservation:', err);
        let errorMsg = 'Erreur lors de la réservation.';
        if (err.status === 400) {
          errorMsg = 'Les données envoyées sont invalides.';
        } else if (err.status === 409) {
          errorMsg = 'Ce créneau n\'est plus disponible.';
        } else if (err.status === 500) {
          errorMsg = 'Erreur serveur. Essayez plus tard.';
        }
        this.bookingError = errorMsg;
        this.stopLoading();
      }
    });
  }

  getStatusLabel(status: StatutRendezVous): string {
    const map: Record<StatutRendezVous, string> = {
      [StatutRendezVous.PREVU]: 'Prévu',
      [StatutRendezVous.ANNULE]: 'Annulé',
      [StatutRendezVous.PRESENTE]: 'Effectué',
      [StatutRendezVous.ABSENT]: 'Absent'
    };
    return map[status] || status;
  }
}
