import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PocheSang, StockParCentre, StockParGroupe } from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminStockService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8082/api';

  getStockParGroupe(): Observable<StockParGroupe[]> {
    return this.http.get<any[]>(`${this.baseUrl}/statistiques-stock/dernier`).pipe(
      map(stats => stats.map(s => ({
        groupeSanguin: s.groupeSanguin,
        quantiteDisponible: s.unitesTotales - s.unitesTransfusees - s.unitesExpirees,
        quantiteReservee: 0,
        pochesBientotExpirees: s.unitesExpirees
      })))
    );
  }

  getStockParCentre(): Observable<StockParCentre[]> {
    // Le backend ne gère pas les statistiques par centre pour l'instant
    return of([]);
  }

  getAllPoches(): Observable<PocheSang[]> {
    return this.http.get<PocheSang[]>(`${this.baseUrl}/poches-sang`);
  }
}
