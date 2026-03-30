/**
 * HemoLink Frontend Models - All interfaces matching backend DTOs
 * Synchronized with Spring Boot backend (v0.0.1)
 */

// ═══════════════════════════════════════════════════════════════
// ENUMS (Matching Java Backend)
// ═══════════════════════════════════════════════════════════════

export enum RoleUtilisateur {
  ADMIN = 'ADMIN',
  DONNEUR = 'DONNEUR',
  HOPITAL = 'HOPITAL',
  PERSONNEL_CENTRE = 'PERSONNEL_CENTRE',
  LABO_PERSONNEL = 'LABO_PERSONNEL'
}

export enum GroupeSanguin {
  O_PLUS = 'O_PLUS',
  O_MINUS = 'O_MINUS',
  A_PLUS = 'A_PLUS',
  A_MINUS = 'A_MINUS',
  B_PLUS = 'B_PLUS',
  B_MINUS = 'B_MINUS',
  AB_PLUS = 'AB_PLUS',
  AB_MINUS = 'AB_MINUS'
}

export enum StatutSang {
  AVAILABLE = 'AVAILABLE',
  QUARANTINE = 'QUARANTINE',
  USED = 'USED',
  EXPIRED = 'EXPIRED'
}

export enum StatutRendezVous {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum StatutCommande {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED'
}


// ═══════════════════════════════════════════════════════════════
// UTILISATEURS (Users)
// ═══════════════════════════════════════════════════════════════

export interface Utilisateur {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  role: RoleUtilisateur;
  actif: boolean;
  creeLe: Date;
}

export interface UtilisateurDto {
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  role: RoleUtilisateur;
}

export interface UtilisateurResponseDto extends UtilisateurDto {
  id: number;
}

export interface InscriptionDto {
  prenom: string;
  nom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
  groupeSanguin?: GroupeSanguin;
  dateNaissance?: Date;
  poids?: number;
}

export interface AuthLoginDto {
  email: string;
  motDePasse: string;
}

export interface AuthTokenResponseDto {
  token: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

// ═══════════════════════════════════════════════════════════════
// DONNEUR (Donors)
// ═══════════════════════════════════════════════════════════════

export interface Donneur {
  id: number;
  utilisateurId: number;
  groupeSanguin: GroupeSanguin;
  dateNaissance: Date;
  poids: number;
  dateDernierDon?: Date;
  nombreDonsAnnuel: number;
}

export interface DonneurDto {
  utilisateurId: number;
  groupeSanguin: GroupeSanguin;
  dateNaissance: Date;
  poids: number;
}

export interface DonneurResponseDto extends DonneurDto {
  id: number;
}


// ═══════════════════════════════════════════════════════════════
// DON (Donations)
// ═══════════════════════════════════════════════════════════════

export interface Don {
  id: number;
  donneurId: number;
  centreId: number;
  dateDon: Date;
  volumeMl: number;
}

export interface DonDto {
  donneurId: number;
  centreId: number;
  dateDon: Date;
  volumeMl: number;
}

export interface DonResponseDto extends DonDto {
  id: number;
}

// ═══════════════════════════════════════════════════════════════
// POCHE SANG (Blood Units)
// ═══════════════════════════════════════════════════════════════

export interface PocheSang {
  id: number;
  donId: number;
  groupeSanguin: GroupeSanguin;
  statut: StatutSang;
  dateCollecte: Date;
  dateExpiration: Date;
}

export interface PocheSangDto {
  donId: number;
  groupeSanguin: GroupeSanguin;
  statut?: StatutSang;
}

export interface PocheSangResponseDto extends PocheSangDto {
  id: number;
  dateCollecte: Date;
  dateExpiration: Date;
}

// ═══════════════════════════════════════════════════════════════
// TEST LABO (Lab Tests)
// ═══════════════════════════════════════════════════════════════

export interface TestLabo {
  id: number;
  pocheSangId: number;
  hiv: boolean;
  hepatitisB: boolean;
  hepatitisC: boolean;
  syphilis: boolean;
  testDate: Date;
  technicienLaboId: number;
}

export interface TestLaboDto {
  pocheSangId: number;
  hiv: boolean;
  hepatitisB: boolean;
  hepatitisC: boolean;
  syphilis: boolean;
  technicienLaboId: number;
}

export interface TestLaboResponseDto extends TestLaboDto {
  id: number;
  testDate: Date;
}


// ═══════════════════════════════════════════════════════════════
// RENDEZ-VOUS (Appointments)
// ═══════════════════════════════════════════════════════════════

export interface RendezVous {
  id: number;
  donneurId: number;
  centreId: number;
  dateHeure: Date;
  statut: StatutRendezVous;
}

export interface RendezVousDto {
  donneurId: number;
  centreId: number;
  dateHeure: Date;
}

export interface RendezVousResponseDto extends RendezVousDto {
  id: number;
  statut: StatutRendezVous;
}

// ═══════════════════════════════════════════════════════════════
// CENTRE DE COLLECTE (Collection Centers)
// ═══════════════════════════════════════════════════════════════

export interface CentreCollecte {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  latitude: number;
  longitude: number;
  telephone: string;
  horaires?: Horaire[];
}

export interface CentreCollecteDto {
  nom: string;
  adresse: string;
  ville: string;
  latitude: number;
  longitude: number;
  telephone: string;
}

export interface CentreCollecteResponseDto extends CentreCollecteDto {
  id: number;
}

export interface Horaire {
  id: number;
  jour: string;
  ouverture: string;
  fermeture: string;
  ouvert: boolean;
}

// ═══════════════════════════════════════════════════════════════
// HOPITAL (Hospitals)
// ═══════════════════════════════════════════════════════════════

export interface Hopital {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  telephone: string;
}

export interface HopitalDto {
  nom: string;
  adresse: string;
  ville: string;
  telephone: string;
}

export interface HopitalResponseDto extends HopitalDto {
  id: number;
}

// ═══════════════════════════════════════════════════════════════
// COMMANDE SANG (Blood Orders)
// ═══════════════════════════════════════════════════════════════

export interface CommandeSang {
  id: number;
  hopitalId: number;
  groupeSanguin: GroupeSanguin;
  quantite: number;
  urgenceVitale: boolean;
  statut: StatutCommande;
  orderDate: Date;
}

export interface CommandeSangDto {
  hopitalId: number;
  groupeSanguin: GroupeSanguin;
  quantite: number;
  urgenceVitale?: boolean;
}

export interface CommandeSangResponseDto extends CommandeSangDto {
  id: number;
  statut: StatutCommande;
  orderDate: Date;
}

// ═══════════════════════════════════════════════════════════════
// ELEMENT COMMANDE (Order Items)
// ═══════════════════════════════════════════════════════════════

export interface ElementCommande {
  id: number;
  commandeId: number;
  pocheSangId: number;
}

export interface ElementCommandeDto {
  commandeId: number;
  pocheSangId: number;
}

export interface ElementCommandeResponseDto extends ElementCommandeDto {
  id: number;
}


// ═══════════════════════════════════════════════════════════════
// NOTIFICATION
// ═══════════════════════════════════════════════════════════════

export interface Notification {
  id: number;
  utilisateurId: number;
  message: string;
  lu: boolean;
  creeLe: Date;
}

export interface NotificationDto {
  utilisateurId: number;
  message: string;
  lu?: boolean;
  creeLe?: Date;
}

export interface NotificationResponseDto extends NotificationDto {
  id: number;
}

// ═══════════════════════════════════════════════════════════════
// STATISTIQUES
// ═══════════════════════════════════════════════════════════════

export interface StatistiquesStock {
  groupeSanguin: GroupeSanguin;
  totalDisponible: number;
  totalReserve: number;
  totalExpire: number;
  lastUpdated: Date;
}

export interface StatistiquesStockResponseDto {
  id: number;
  groupeSanguin: GroupeSanguin;
  quantiteDisponible: number;
  quantiteReservee: number;
  quantiteExpire: number;
  dateSnapshot: Date;
}

export interface StatistiquesGaspillage {
  periodeDebut: Date;
  periodeFin: Date;
  nombreEcartees: number;
  nombreExpirees: number;
  taux: number;
}

export interface StatistiquesDons {
  totalDons: number;
  totalDonneurs: number;
  donsMois: number;
  donneursActifs: number;
}

// ═══════════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════════

export interface ApiErrorResponse {
  timestamp: Date;
  status: number;
  error: string;
  message: string;
  path: string;
}

// ═══════════════════════════════════════════════════════════════
// HELPER TYPES
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
