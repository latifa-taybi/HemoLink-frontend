import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PersonnelService, RendezVous } from '../../../services/personnel.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-personnel-appointments',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './personnel-appointments.component.html',
  styleUrl: './personnel-appointments.component.css'
})
export class PersonnelAppointmentsComponent implements OnInit {
  rendezVous: RendezVous[] = [];
  loading = true;

  constructor(
    private personnelService: PersonnelService, 
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRDV();
  }

  loadRDV(): void {
    this.loading = true;
    const user = this.authService.getUser();
    const centreId = user?.centreCollecteId || 1; 
    const aujourdhui = new Date().toISOString().split('T')[0];
    
    this.personnelService.getRendezVousDuCentre(centreId, aujourdhui).subscribe({
      next: (rdvs) => {
        this.rendezVous = rdvs.map(r => {
          if (Array.isArray(r.dateRendezVous)) {
            const arr: any = r.dateRendezVous;
            const y = arr[0], m = arr[1].toString().padStart(2, '0'), d = arr[2].toString().padStart(2, '0');
            const h = (arr[3]||0).toString().padStart(2, '0'), min = (arr[4]||0).toString().padStart(2, '0');
            (r as any).dateRendezVous = `${y}-${m}-${d}T${h}:${min}:00`;
          }
          return r;
        });
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error("Erreur de récupération des rendez-vous réels du backend", err);
        this.rendezVous = [];
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  marquerPresent(rdv: RendezVous): void {
    if(confirm('Marquer ce donneur comme présent et terminer le RDV ?')) {
      rdv.statut = 'TERMINE';
      this.cdr.markForCheck();
      // Code service
    }
  }

  marquerAbsent(rdv: RendezVous): void {
    if(confirm('Marquer ce donneur comme absent (Annulé) ?')) {
      rdv.statut = 'ANNULE';
      this.cdr.markForCheck();
      // Code service
    }
  }
}
