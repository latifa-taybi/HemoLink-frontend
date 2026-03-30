import { GroupeSanguin } from '../../admin/models/admin.models';

export interface Donneur {
  id: number;
  utilisateurId: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  groupeSanguin: GroupeSanguin;
  dateDernierDon?: string;
  nombreDonsAnnuel: number;
  actif?: boolean;
  creeLe?: string;
}

export interface Eligibilite {
  eligible: boolean;
  prochaineDate: string;
  joursRestants: number;
  motif?: string;
}

export interface Don {
  id: number;
  dateDon: string;
  lieu: string;
  quantite: number;
  statut: string; // EN_ATTENTE_TEST, DISPONIBLE, etc.
}

export enum StatutRendezVous {
  PLANIFIE = 'PLANIFIE',
  ANNULE = 'ANNULE',
  TERMINE = 'TERMINE'
}

export interface RendezVous {
  id: number;
  dateRendezVous: string;
  centreId: number;
  centreNom: string;
  statut: StatutRendezVous;
}

export interface CreateRendezVousDto {
  dateRendezVous: string;
  centreId: number;
  donneurId: number;
}
