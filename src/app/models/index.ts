/**
 * HemoLink Frontend Models - All interfaces matching backend DTOs
 */

import { RoleUtilisateur, GroupeSanguin, StatutCommande, StatutRendezVous, StatutSang } from '../services/auth.service';

// Re-export enums for easier access
export { RoleUtilisateur, GroupeSanguin, StatutCommande, StatutRendezVous, StatutSang };

// ═══════════════════════════════════════════════════════════════
// USER MODELS
// ═══════════════════════════════════════════════════════════════

export interface Utilisateur {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  role: RoleUtilisateur;
  actif: boolean;
  dateCreation: string;
}

export interface InscriptionDto {
  prenom: string;
  nom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
}

export interface LoginDto {
  email: string;
  motDePasse: string;
}

export interface AuthTokenResponseDto {
  token: string;
  tokenType: string;
  expiresIn?: number;
  user?: Utilisateur;
}

// ═══════════════════════════════════════════════════════════════
// DONOR MODELS
// ═══════════════════════════════════════════════════════════════

export interface Donneur {
  id: number;
  utilisateur: Utilisateur;
  groupeSanguin: GroupeSanguin;
  dateNaissance: string;
  derniereDate?: string;
  eligibilite: boolean;
}

export interface DonneurDto {
  id?: number;
  utilisateurId: number;
  groupeSanguin: GroupeSanguin;
  dateNaissance: string;
  eligibilite?: boolean;
}

// ═══════════════════════════════════════════════════════════════
// DONATION MODELS
// ═══════════════════════════════════════════════════════════════

export interface Don {
  id: number;
  donneur: Donneur;
  centre: CentreCollecte;
  dateDon: string;
  volumeMl: number;
}

export interface DonDto {
  id?: number;
  donneurId: number;
  centreId: number;
  dateDon: string;
  volumeMl: number;
}

// ═══════════════════════════════════════════════════════════════
// BLOOD BAG MODELS
// ═══════════════════════════════════════════════════════════════

export interface PocheSang {
  id: number;
  don: Don;
  groupeSanguin: GroupeSanguin;
  dateCollection: string;
  dateExpiration: string;
  statut: StatutSang;
}

export interface PocheSangDto {
  id?: number;
  donId: number;
  groupeSanguin: GroupeSanguin;
  dateCollection: string;
  dateExpiration: string;
  statut: StatutSang;
}

// ═══════════════════════════════════════════════════════════════
// ORDER MODELS
// ═══════════════════════════════════════════════════════════════

export interface CommandeSang {
  id: number;
  hopital: Hopital;
  centreColl: CentreCollecte;
  groupeSanguin: GroupeSanguin;
  quantite: number;
  montant: number;
  statut: StatutCommande;
  dateCreation: string;
  dateExpedition?: string;
  dateLivraison?: string;
}

export interface CommandeSangDto {
  id?: number;
  hopitalId: number;
  centreColl: number;
  groupeSanguin: GroupeSanguin;
  quantite: number;
  statut?: StatutCommande;
  montant?: number;
}

export interface ElementCommande {
  id: number;
  commande: CommandeSang;
  pocheSang: PocheSang;
  quantite: number;
}

// ═══════════════════════════════════════════════════════════════
// APPOINTMENT MODELS
// ═══════════════════════════════════════════════════════════════

export interface RendezVous {
  id: number;
  donneur: Donneur;
  centre: CentreCollecte;
  dateRV: string;
  statut: StatutRendezVous;
}

export interface RendezVousDto {
  id?: number;
  donneurId: number;
  centreId: number;
  dateRV: string;
  statut?: StatutRendezVous;
}

// ═══════════════════════════════════════════════════════════════
// CENTER MODELS
// ═══════════════════════════════════════════════════════════════

export interface CentreCollecte {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  telephone: string;
  horaires?: string;
}

export interface CentreCollecteDto {
  id?: number;
  nom: string;
  adresse: string;
  ville: string;
  telephone: string;
  horaires?: string;
}

// ═══════════════════════════════════════════════════════════════
// HOSPITAL MODELS
// ═══════════════════════════════════════════════════════════════

export interface Hopital {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  telephone: string;
}

export interface HopitalDto {
  id?: number;
  nom: string;
  adresse: string;
  ville: string;
  telephone: string;
}

// ═══════════════════════════════════════════════════════════════
// LAB TEST MODELS
// ═══════════════════════════════════════════════════════════════

export interface TestLabo {
  id: number;
  pocheSang: PocheSang;
  dateTest: string;
  resultat: string;
  valide: boolean;
}

export interface TestLaboDto {
  id?: number;
  pocheSangId: number;
  dateTest: string;
  resultat: string;
  valide: boolean;
}

// ═══════════════════════════════════════════════════════════════
// NOTIFICATION MODELS
// ═══════════════════════════════════════════════════════════════

export interface Notification {
  id: number;
  utilisateur: Utilisateur;
  message: string;
  dateCreation: string;
  lue: boolean;
  type?: string;
  priorite?: string;
}

export interface NotificationDto {
  id?: number;
  utilisateurId: number;
  message: string;
  lue?: boolean;
  type?: string;
  priorite?: string;
}

// ═══════════════════════════════════════════════════════════════
// STATISTICS MODELS
// ═══════════════════════════════════════════════════════════════

export interface StatistiquesStock {
  id: number;
  stockActuel: number;
  quantiteDisponible: number;
  groupeSanguin: GroupeSanguin;
  dateMAJ: string;
}

export interface StatistiquesDto {
  totalDonneurs: number;
  totalDons: number;
  totalCommandes: number;
  stockTotal: number;
  stockParGroupe: StatistiqueParGroupe[];
}

export interface StatistiqueParGroupe {
  groupeSanguin: GroupeSanguin;
  quantite: number;
  disponible: number;
}

// ═══════════════════════════════════════════════════════════════
// API RESPONSE MODELS
// ═══════════════════════════════════════════════════════════════

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

export interface PageableResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
