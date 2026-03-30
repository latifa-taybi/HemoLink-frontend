import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PersonnelService } from '../../../services/personnel.service';
import { AuthService } from '../../../services/auth.service';
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
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerKpis();
  }

  chargerKpis(): void {
    const user = this.authService.getUser();
    const centreId = user?.centreCollecteId || 1; 
    
    // Pour filtrer les RDV d'aujourd'hui
    const aujourdhuiStr = new Date().toISOString().split('T')[0];

    this.error = null;
    this.loading = true;

    forkJoin({
      rdvs: this.personnelService.getRendezVousDuCentre(centreId, aujourdhuiStr),
      dons: this.personnelService.getDonsParCentre(centreId)
    }).subscribe({
      next: (data) => {
        // rdvs are already filtered by the backend for today
        const rdvsJour = data.rdvs.map(r => {
          if (Array.isArray(r.dateRendezVous)) {
            const arr: any = r.dateRendezVous;
            const y = arr[0], m = arr[1].toString().padStart(2, '0'), d = arr[2].toString().padStart(2, '0');
            const h = (arr[3]||0).toString().padStart(2, '0'), min = (arr[4]||0).toString().padStart(2, '0');
            (r as any).dateRendezVous = `${y}-${m}-${d}T${h}:${min}:00`;
          }
          return r;
        });
        
        const dons = data.dons.map(don => {
          if (Array.isArray(don.dateDon)) {
            const arr: any = don.dateDon;
            const y = arr[0], m = arr[1].toString().padStart(2, '0'), d = arr[2].toString().padStart(2, '0');
            (don as any).dateDon = `${y}-${m}-${d}T00:00:00`;
          }
          return don;
        });
        
        this.kpis = {
          rdvAujourdhui: rdvsJour.length,
          rdvTermines: rdvsJour.filter(r => r.statut === 'TERMINE').length,
          donsRecueillis: dons.filter(d => d.dateDon.startsWith(aujourdhuiStr)).length
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
