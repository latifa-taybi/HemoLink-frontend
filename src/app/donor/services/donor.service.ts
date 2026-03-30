import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Donneur, Don, RendezVous, CreateRendezVousDto, Eligibilite } from '../models/donor.models';

@Injectable({ providedIn: 'root' })
export class DonorService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8082/api';

  getProfile(userId: number): Observable<Donneur> {
    return this.http.get<Donneur>(`${this.baseUrl}/donneurs/utilisateur/${userId}`);
  }

  getHistory(donneurId: number): Observable<Don[]> {
    return this.http.get<Don[]>(`${this.baseUrl}/dons/historique/${donneurId}`);
  }

  getAppointments(donneurId: number): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(`${this.baseUrl}/rendez-vous/donneur/${donneurId}`);
  }

  bookAppointment(dto: CreateRendezVousDto): Observable<RendezVous> {
    return this.http.post<RendezVous>(`${this.baseUrl}/rendez-vous`, dto);
  }

  getEligibility(donneurId: number): Observable<Eligibilite> {
    // Real-time calculation of eligibility
    return this.http.get<string>(`${this.baseUrl}/donneurs/${donneurId}/prochaine-date-eligible`, { responseType: 'text' as 'json' }).pipe(
      map(date => {
        const nextDate = new Date(date);
        const today = new Date();
        const diff = nextDate.getTime() - today.getTime();
        const days = Math.ceil(diff / (1000 * 3600 * 24));
        
        return {
          eligible: days <= 0,
          prochaineDate: date,
          joursRestants: Math.max(0, days),
          motif: days > 0 ? `Délai de carence de 8 semaines non respecté.` : undefined
        };
      })
    );
  }

  // Mock for shortage alerts (US06)
  getAlerts(): Observable<string[]> {
    return of(['Urgence : Stock critique pour le groupe O-', 'Alerte : Besoin urgent de donneurs B+']);
  }
}
