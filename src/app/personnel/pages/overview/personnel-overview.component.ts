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
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        // En cas d'erreur de développement/Back-end, on mock les chiffres pour continuer à voir l'UI
        this.kpis = {
          rdvAujourdhui: 12,
          rdvTermines: 4,
          donsRecueillis: 5
        };
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
