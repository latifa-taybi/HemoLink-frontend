import { GroupeSanguin } from '../../admin/models/admin.models';

export interface Donneur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  groupeSanguin: GroupeSanguin;
  dateDernierDon?: string;
  nombreDonsAnnuel: number;
  utilisateurId: number;
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
  PREVU = 'PREVU',
  ANNULE = 'ANNULE',
  PRESENTE = 'PRESENTE',
  ABSENT = 'ABSENT'
}

export interface RendezVous {
  id: number;
  dateHeure: string;
  centreId: number;
  centreNom: string;
  statut: StatutRendezVous;
}

export interface CreateRendezVousDto {
  dateHeure: string;
  centreId: number;
  donneurId: number;
}
