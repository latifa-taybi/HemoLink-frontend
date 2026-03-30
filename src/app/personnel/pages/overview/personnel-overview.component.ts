import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PersonnelService } from '../../../services/personnel.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-personnel-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './personnel-overview.component.html',
  styleUrl: './personnel-overview.component.css'
})
export class PersonnelOverviewComponent implements OnInit {
  kpis = {
    rdvAujourdhui: 0,
    rdvTermines: 0,
    donsRecueillis: 0
  };
  
  loading = true;
  error: string | null = null;

  constructor(
    private personnelService: PersonnelService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerKpis();
  }

  chargerKpis(): void {
    const centreId = 1; // Temporairement fixé à 1, idéalement : getUser().centreId
    
    // Pour filtrer les RDV d'aujourd'hui
    const aujourdhuiStr = new Date().toISOString().split('T')[0];

    this.error = null;
    this.loading = true;

    forkJoin({
      rdvs: this.personnelService.getRendezVousDuCentre(centreId),
      dons: this.personnelService.getDonsParCentre(centreId)
    }).subscribe({
      next: (data) => {
        // Filtrer les RDV du jour
        const rdvsJour = data.rdvs.filter(r => r.dateHeure.startsWith(aujourdhuiStr));
        
        this.kpis = {
          rdvAujourdhui: rdvsJour.length,
          rdvTermines: rdvsJour.filter(r => r.statut === 'TERMINE').length,
          donsRecueillis: data.dons.filter(d => d.dateDon.startsWith(aujourdhuiStr)).length
        };
        this.error = null;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error("Erreur backend - vérifiez les endpoints:", err);
        
        // Messages d'erreur user-friendly
        let errorMsg = 'Impossible de charger les données du centre.';
        if (err.status === 404) {
          errorMsg = 'Le centre de prélèvement n\'a pas été trouvé.';
        } else if (err.status === 500) {
          errorMsg = 'Erreur serveur - vérifiez que le backend implémente les endpoints /api/dons/centre/{id} et /api/rendez-vous';
        } else if (err.status === 0) {
          errorMsg = 'Impossible de se connecter au serveur backend.';
        }
        
        this.error = errorMsg;
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
