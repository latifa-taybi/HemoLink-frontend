import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RendezVous {
  id: number;
  centreCollecteId: number;
  donneurId: number;
  dateHeure: string;
  statut: 'PLANIFIE' | 'ANNULE' | 'TERMINE';
  donneurPrenom: string;
  donneurNom: string;
}

export interface CreateDonDto {
  donneurId: number;
  centreId: number;
  dateDon: string;
  volumeMl: number;
}

export interface Don {
  id: number;
  donneurId: number;
  centreId: number;
  dateDon: string;
  volumeMl: number;
}

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {
  private readonly apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) {}

  // ==========================
  // DASHBOARD & RENDEZ-VOUS
  // ==========================
  
  /**
   * Récupère tous les rendez-vous d'un centre donné
   */
  getRendezVousDuCentre(centreId: number): Observable<RendezVous[]> {
    const params = new HttpParams().set('centreId', centreId.toString());
    return this.http.get<RendezVous[]>(`${this.apiUrl}/rendez-vous`, { params });
  }

  /**
   * Marque un rendez-vous comme terminé/annulé (Ex: lors de l'arrivée du donneur)
   */
  updateStatutRendezVous(id: number, statut: 'PLANIFIE' | 'ANNULE' | 'TERMINE'): Observable<RendezVous> {
    return this.http.patch<RendezVous>(`${this.apiUrl}/rendez-vous/${id}/statut`, { statut });
  }

  // ==========================
  // GESTION DES DONS
  // ==========================
  
  /**
   * Enregistre un nouveau don après le prélèvement
   */
  enregistrerDon(donDto: CreateDonDto): Observable<Don> {
    return this.http.post<Don>(`${this.apiUrl}/dons`, donDto);
  }

  /**
   * Récupère tous les dons pour un centre
   */
  getDonsParCentre(centreId: number): Observable<Don[]> {
    return this.http.get<Don[]>(`${this.apiUrl}/dons/centre/${centreId}`);
  }
}
