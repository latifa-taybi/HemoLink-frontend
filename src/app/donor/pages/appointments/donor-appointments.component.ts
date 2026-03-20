import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DonorService } from '../../services/donor.service';
import { AdminCentersService } from '../../../admin/services/admin-centers.service';
import { Donneur, RendezVous, CreateRendezVousDto, StatutRendezVous } from '../../models/donor.models';
import { CentreCollecte } from '../../../admin/models/admin.models';
import { Auth } from '../../../services/auth';

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
  private readonly authService = inject(Auth);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly route = inject(ActivatedRoute);

  donor: Donneur | null = null;
  appointments: RendezVous[] = [];
  centers: CentreCollecte[] = [];
  loading = true;
  showModal = false;

  newAppointment: CreateRendezVousDto = {
    dateHeure: '',
    centreId: 0,
    donneurId: 0
  };

  constructor() {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user && user.id > 0) {
      // First load centers
      this.centersService.getAll().subscribe({
        next: (c) => {
          this.centers = c;
          
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
            error: () => this.stopLoading()
          });
        },
        error: () => this.stopLoading()
      });
    } else {
      this.stopLoading();
    }
  }

  loadAppointments(donneurId: number): void {
    this.donorService.getAppointments(donneurId).subscribe({
      next: (data) => {
        this.appointments = data.sort((a,b) => new Date(b.dateHeure).getTime() - new Date(a.dateHeure).getTime());
        this.stopLoading();
      },
      error: () => this.stopLoading()
    });
  }

  stopLoading(): void {
    this.loading = false;
    this.cdr.markForCheck();
  }

  openBookingModal(): void {
    if (!this.donor) return;
    this.newAppointment = {
      dateHeure: '',
      centreId: this.centers[0]?.id || 0,
      donneurId: this.donor.id
    };
    this.showModal = true;
    this.cdr.markForCheck();
  }

  submitBooking(): void {
    if (!this.newAppointment.dateHeure || !this.newAppointment.centreId) return;
    
    this.loading = true; // prevent double submission
    this.cdr.markForCheck();

    this.donorService.bookAppointment(this.newAppointment).subscribe({
      next: () => {
        if (this.donor) this.loadAppointments(this.donor.id);
        this.showModal = false;
        // loading state will reset when loadAppointments finishes
      },
      error: (err) => {
        console.error('Erreur de réservation', err);
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
