import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupeSanguin } from './labo.service';

export enum StatutCommande {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_PREPARATION = 'EN_PREPARATION',
  EN_LIVRAISON = 'EN_LIVRAISON',
  LIVREE = 'LIVREE',
  ANNULEE = 'ANNULEE'
}

export interface Hopital {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  telephone: string;
}

export interface CommandeSang {
  id: number;
  hopitalId: number;
  centreCollecteId: number;
  groupeSanguin: GroupeSanguin;
  quantite: number;
  urgence: boolean;
  statut: StatutCommande;
  dateCommande: string;
}

export interface CreateCommandeDto {
  hopitalId: number;
  centreCollecteId: number;
  groupeSanguin: GroupeSanguin;
  quantite: number;
  urgence: boolean;
  statut: StatutCommande;
  dateCommande: string;
}

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  private readonly apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) {}

  // =====================
  // HÔPITAUX
  // =====================
  getHopitalById(id: number): Observable<Hopital> {
    return this.http.get<Hopital>(`${this.apiUrl}/hopitaux/${id}`);
  }

  updateHopital(id: number, hopital: Partial<Hopital>): Observable<Hopital> {
    return this.http.put<Hopital>(`${this.apiUrl}/hopitaux/${id}`, hopital);
  }

  // =====================
  // COMMANDES DE SANG
  // =====================
  getCommandes(hopitalId?: number): Observable<CommandeSang[]> {
    let params = new HttpParams();
    if (hopitalId) {
      params = params.set('hopitalId', hopitalId.toString());
    }
    return this.http.get<CommandeSang[]>(`${this.apiUrl}/commandes-sang`, { params });
  }

  getCommandeById(id: number): Observable<CommandeSang> {
    return this.http.get<CommandeSang>(`${this.apiUrl}/commandes-sang/${id}`);
  }

  creerCommande(commande: CreateCommandeDto): Observable<CommandeSang> {
    return this.http.post<CommandeSang>(`${this.apiUrl}/commandes-sang`, commande);
  }

  annulerCommande(id: number): Observable<CommandeSang> {
    return this.http.patch<CommandeSang>(`${this.apiUrl}/commandes-sang/${id}/annuler`, {});
  }

  preparerCommande(id: number): Observable<CommandeSang> {
    return this.http.patch<CommandeSang>(`${this.apiUrl}/commandes-sang/${id}/preparer`, {});
  }

  expedierCommande(id: number): Observable<CommandeSang> {
    return this.http.patch<CommandeSang>(`${this.apiUrl}/commandes-sang/${id}/expedier`, {});
  }

  livrerCommande(id: number): Observable<CommandeSang> {
    return this.http.patch<CommandeSang>(`${this.apiUrl}/commandes-sang/${id}/livrer`, {});
  }

  getUrgencesActives(): Observable<CommandeSang[]> {
    return this.http.get<CommandeSang[]>(`${this.apiUrl}/commandes-sang/urgences`);
  }

  // =====================
  // CENTRES DE COLLECTE
  // =====================
  getCentresCollecte(): Observable<{ id: number; nom: string; ville: string }[]> {
    return this.http.get<{ id: number; nom: string; ville: string }[]>(`${this.apiUrl}/centres-collecte`);
  }
}
