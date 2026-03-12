import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { StatistiquesAdmin, StockParGroupe, StatutCommande, StatutSang } from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminStatsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8082/api';

  getStatistiques(): Observable<StatistiquesAdmin> {
    return forkJoin({
      utilisateurs: this.http.get<any[]>(`${this.baseUrl}/utilisateurs`),
      centres: this.http.get<any[]>(`${this.baseUrl}/centres-collecte`),
      commandes: this.http.get<any[]>(`${this.baseUrl}/commandes-sang`),
      poches: this.http.get<any[]>(`${this.baseUrl}/poches-sang`),
      stats: this.http.get<any[]>(`${this.baseUrl}/statistiques-stock/dernier`)
    }).pipe(
      map(data => {
        const commandesEnAttente = data.commandes.filter(c => 
          c.statut === StatutCommande.EN_ATTENTE || c.statut === StatutCommande.EN_PREPARATION
        ).length;

        const pochesDisponibles = data.poches.filter(p => p.statut === StatutSang.DISPONIBLE).length;
        
        const now = new Date();
        const pochesExpirees = data.poches.filter(p => new Date(p.dateExpiration) < now).length;
        const pochesDetruites = data.poches.filter(p => p.statut === StatutSang.DETRUITE).length; // Map to ECARTEE via enum rename

        const stocksParGroupe: StockParGroupe[] = data.stats.map(s => ({
          groupeSanguin: s.groupeSanguin,
          quantiteDisponible: s.unitesTotales - s.unitesTransfusees - s.unitesExpirees,
          quantiteReservee: 0,
          pochesBientotExpirees: s.unitesExpirees // Extrapolating to match UI
        }));

        return {
          totalUtilisateurs: data.utilisateurs.length,
          totalCentres: data.centres.length,
          totalPochesDisponibles: pochesDisponibles,
          totalCommandesEnAttente: commandesEnAttente,
          pochesExpirees: pochesExpirees,
          pochesDetruites: pochesDetruites,
          stocksParGroupe: stocksParGroupe
        };
      })
    );
  }
}
