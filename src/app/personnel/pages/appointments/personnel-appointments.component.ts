import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PersonnelService, RendezVous } from '../../../services/personnel.service';

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

  constructor(private personnelService: PersonnelService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadRDV();
  }

  loadRDV(): void {
    this.loading = true;
    this.personnelService.getRendezVousDuCentre(1).subscribe({
      next: (rdvs) => {
        this.rendezVous = rdvs;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        // En mode démo on mock temporairement
        this.rendezVous = [
          { id: 101, centreCollecteId: 1, donneurId: 1, dateHeure: new Date().toISOString(), statut: 'PLANIFIE', donneurPrenom: 'Jean', donneurNom: 'Dupont' },
          { id: 102, centreCollecteId: 1, donneurId: 2, dateHeure: new Date(Date.now() + 3600000).toISOString(), statut: 'PLANIFIE', donneurPrenom: 'Claire', donneurNom: 'Lefevre' }
        ];
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
