import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilisateurResponseDto } from './auth';

export enum GroupeSanguin {
  A_POSITIF = 'A_POS',
  A_NEGATIF = 'A_NEG',
  B_POSITIF = 'B_POS',
  B_NEGATIF = 'B_NEG',
  AB_POSITIF = 'AB_POS',
  AB_NEGATIF = 'AB_NEG',
  O_POSITIF = 'O_POS',
  O_NEGATIF = 'O_NEG'
}

export enum StatutSang {
  EN_ATTENTE_TEST = 'EN_ATTENTE_TEST',
  DISPONIBLE = 'DISPONIBLE',
  RESERVEE = 'RESERVEE',
  LIVREE = 'LIVREE',
  TRANSFUSEE = 'TRANSFUSEE',
  ECARTEE = 'ECARTEE',
  EXPIREE = 'EXPIREE'
}

export interface Donneur {
  id: number;
  numeroDonneur: string;
  groupeSanguin?: GroupeSanguin;
  dateDernierDon?: string;
  prochaineDateEligible?: string;
  nombreDonsAnnuel: number;
  nombreTotalDons: number;
  utilisateur: UtilisateurResponseDto;
  dateEligibilite?: string;
  ville?: string;
}

export interface CentreCollecte {
  id: number;
  code: string;
  nom: string;
  adresse: string;
  ville: string;
  capaciteStockage: number;
  telephone: string;
  latitude?: number;
  longitude?: number;
  actif: boolean;
}

export interface Don {
  id: number;
  donneurId: number;
  centreId: number;
  dateDon: string;
  volumeMl: number;
}

export interface PocheSang {
  id: number;
  donId: number;
  groupeSanguin: GroupeSanguin;
  dateCollecte: string;
  dateExpiration: string;
  statut: StatutSang;
}

export interface TestLaboDto {
  pocheSangId: number;
  technicienLaboId?: number;
  vih: boolean;
  syphilis: boolean;
  hepatiteB: boolean;
  hepatiteC: boolean;
  dateTest?: string;
}

export interface TestLaboResponseDto {
  id: number;
  pocheSangId: number;
  technicienLaboId?: number;
  vih: boolean;
  syphilis: boolean;
  hepatiteB: boolean;
  hepatiteC: boolean;
  dateTest?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LaboService {
  private readonly apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) {}

  // =====================
  // DONS
  // =====================
  getTousLesDons(): Observable<Don[]> {
    return this.http.get<Don[]>(`${this.apiUrl}/dons`);
  }

  // =====================
  // POCHES DE SANG
  // =====================
  
  /** Créer une poche à partir d'un don terminé (Séparation) */
  creerPocheDepuisDon(donId: number): Observable<PocheSang> {
    return this.http.post<PocheSang>(`${this.apiUrl}/poches-sang/depuis-don/${donId}`, {});
  }

  getToutesLesPoches(): Observable<PocheSang[]> {
    return this.http.get<PocheSang[]>(`${this.apiUrl}/poches-sang`);
  }

  getPochesSansTest(): Observable<PocheSang[]> {
    return this.http.get<PocheSang[]>(`${this.apiUrl}/poches-sang/sans-test`);
  }

  getPochesDisponibles(groupe?: GroupeSanguin): Observable<PocheSang[]> {
    const params = groupe ? new HttpParams().set('groupeSanguin', groupe) : new HttpParams();
    return this.http.get<PocheSang[]>(`${this.apiUrl}/poches-sang/disponibles`, { params });
  }

  /** Gérer manuellement le statut final de la poche (Urgence ou autre raison) */
  ecarterPoche(id: number): Observable<PocheSang> {
    return this.http.patch<PocheSang>(`${this.apiUrl}/poches-sang/${id}/ecarter`, {});
  }

  transfuserPoche(id: number): Observable<PocheSang> {
    return this.http.patch<PocheSang>(`${this.apiUrl}/poches-sang/${id}/transfuser`, {});
  }

  // =====================
  // TESTS BIOLOGIQUES
  // =====================
  
  enregistrerTest(dto: TestLaboDto): Observable<TestLaboResponseDto> {
    return this.http.post<TestLaboResponseDto>(`${this.apiUrl}/tests-labo`, dto);
  }

  getTests(): Observable<TestLaboResponseDto[]> {
    return this.http.get<TestLaboResponseDto[]>(`${this.apiUrl}/tests-labo`);
  }

  // =====================
  // COMMANDES DE SANG (LABO)
  // =====================
  /** Récupère les commandes de sang filtrées par centre de collecte */
  getCommandesByCentre(centreId: number): Observable<any[]> {
    const params = new HttpParams().set('centreId', centreId.toString());
    return this.http.get<any[]>(`${this.apiUrl}/commandes-sang`, { params });
  }
}
