// ─── Enums ────────────────────────────────────────────────────────────────────

export enum RoleUtilisateur {
  DONNEUR = 'DONNEUR',
  TECHNICIEN_LABO = 'TECHNICIEN_LABO',
  PERSONNEL_HOPITAL = 'PERSONNEL_HOPITAL',
  ADMIN = 'ADMIN',
}

export enum StatutSang {
  EN_ATTENTE = 'EN_ATTENTE_TEST',
  DISPONIBLE = 'DISPONIBLE',
  RESERVEE = 'RESERVEE',
  UTILISEE = 'TRANSFUSEE',
  DETRUITE = 'ECARTEE',
  EXPIREE = 'EXPIREE',
}

export enum StatutCommande {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_PREPARATION = 'EN_PREPARATION',
  EN_LIVRAISON = 'EN_LIVRAISON',
  LIVREE = 'LIVREE',
  ANNULEE = 'ANNULEE',
}

export enum GroupeSanguin {
  A_POSITIF = 'A_POSITIF',
  A_NEGATIF = 'A_NEGATIF',
  B_POSITIF = 'B_POSITIF',
  B_NEGATIF = 'B_NEGATIF',
  AB_POSITIF = 'AB_POSITIF',
  AB_NEGATIF = 'AB_NEGATIF',
  O_POSITIF = 'O_POSITIF',
  O_NEGATIF = 'O_NEGATIF',
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface Utilisateur {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  role: RoleUtilisateur;
  actif: boolean;
  creeLe: string;
}

export interface CreateUtilisateurDto {
  prenom: string;
  nom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
  role: RoleUtilisateur;
}

// ─── Collection Centre ────────────────────────────────────────────────────────

export interface HoraireCentre {
  id?: number;
  jour: string; // MONDAY, TUESDAY, ...
  ouverture: string; // HH:mm
  fermeture: string; // HH:mm
  ouvert: boolean;
}

export interface HoraireDto {
  id?: number;
  jour: string; // LUNDI, MARDI...
  ouverture: string;
  fermeture: string;
  ouvert: boolean;
}

export interface CentreCollecte {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  latitude?: number;
  longitude?: number;
  telephone?: string;
  horaires?: HoraireDto[]; // Format backend
}

export interface CreateCentreDto {
  nom: string;
  adresse: string;
  ville: string;
  latitude?: number;
  longitude?: number;
  telephone?: string;
  horaires?: HoraireDto[];
}

// ─── Blood Bag / Poche ────────────────────────────────────────────────────────

export interface PocheSang {
  id: number;
  donId?: number;
  groupeSanguin: GroupeSanguin;
  statut: StatutSang;
  dateCollecte: string;
  dateExpiration: string;
}

// ─── Stock ────────────────────────────────────────────────────────────────────

export interface StockParGroupe {
  groupeSanguin: GroupeSanguin;
  quantiteDisponible: number;
  quantiteReservee: number;
  pochesBientotExpirees: number; // expire dans < 7 jours
}

export interface StockParCentre {
  centreId: number;
  centreNom: string;
  ville: string;
  stocks: StockParGroupe[];
}

// ─── Order / Commande ─────────────────────────────────────────────────────────

export interface Commande {
  id: number;
  hopitalId: number;
  groupeSanguin: GroupeSanguin;
  quantite: number;
  urgence: boolean;
  statut: StatutCommande;
  dateCommande: string;
}

// ─── Statistics ───────────────────────────────────────────────────────────────

export interface StatistiquesAdmin {
  totalUtilisateurs: number;
  totalCentres: number;
  totalPochesDisponibles: number;
  totalCommandesEnAttente: number;
  pochesExpirees: number;
  pochesDetruites: number;
  stocksParGroupe: StockParGroupe[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const GROUPE_SANGUIN_LABELS: Record<GroupeSanguin, string> = {
  [GroupeSanguin.A_POSITIF]: 'A+',
  [GroupeSanguin.A_NEGATIF]: 'A-',
  [GroupeSanguin.B_POSITIF]: 'B+',
  [GroupeSanguin.B_NEGATIF]: 'B-',
  [GroupeSanguin.AB_POSITIF]: 'AB+',
  [GroupeSanguin.AB_NEGATIF]: 'AB-',
  [GroupeSanguin.O_POSITIF]: 'O+',
  [GroupeSanguin.O_NEGATIF]: 'O-',
};

export const JOURS_SEMAINE = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
];

export const JOURS_LABELS: Record<string, string> = {
  MONDAY: 'Lundi', TUESDAY: 'Mardi', WEDNESDAY: 'Mercredi',
  THURSDAY: 'Jeudi', FRIDAY: 'Vendredi', SATURDAY: 'Samedi', SUNDAY: 'Dimanche',
};
