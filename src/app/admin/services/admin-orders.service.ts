import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Commande, StatutCommande } from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminOrdersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8082/api';

  getAll(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.baseUrl}/commandes-sang`);
  }

  updateStatut(id: number, statut: StatutCommande): Observable<Commande> {
    let endpoint = '';
    switch (statut) {
      case StatutCommande.EN_PREPARATION:
        endpoint = 'preparer';
        break;
      case StatutCommande.EN_LIVRAISON:
        endpoint = 'expedier';
        break;
      case StatutCommande.LIVREE:
        endpoint = 'livrer';
        break;
      case StatutCommande.ANNULEE:
        endpoint = 'annuler';
        break;
      default:
        // Si le statut n'a pas d'endpoint PATCH, on retourne simplement la commande par son ID !
        return this.http.get<Commande>(`${this.baseUrl}/commandes-sang/${id}`);
    }
    return this.http.patch<Commande>(`${this.baseUrl}/commandes-sang/${id}/${endpoint}`, {});
  }
}
