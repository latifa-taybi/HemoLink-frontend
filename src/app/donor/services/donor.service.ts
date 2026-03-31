import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, switchMap, catchError } from 'rxjs';
import { Donneur, Don, RendezVous, CreateRendezVousDto, Eligibilite } from '../models/donor.models';

@Injectable({ providedIn: 'root' })
export class DonorService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8082/api';

  // ═══════════════════════════════════════════════════════════════
  // PROFILE
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get all donors (for search/lookup)
   * Endpoint: GET /api/donneurs
   */
  getAllDonneurs(): Observable<Donneur[]> {
    return this.http.get<Donneur[]>(`${this.baseUrl}/donneurs`);
  }

  /**
   * Search donor by email
   * Searches all donors and returns first match
   */
  getDonneurByEmail(email: string): Observable<Donneur | null> {
    return this.getAllDonneurs().pipe(
      map(donneurs => donneurs.find(d => d.email?.toLowerCase() === email.toLowerCase()) || null)
    );
  }

  /**
   * Get donor profile by user ID
   * Endpoint: GET /api/donneurs/utilisateur/{userId}
   */
  getProfile(userId: number): Observable<Donneur> {
    return this.http.get<Donneur>(`${this.baseUrl}/donneurs/utilisateur/${userId}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // DONATION HISTORY
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get donation history for donor
   * Endpoint: GET /api/dons/donneur/{donneurId}
   */
  getHistory(donneurId: number): Observable<Don[]> {
    return this.http.get<Don[]>(`${this.baseUrl}/dons/donneur/${donneurId}`);
  }

  /**
   * Get specific donation details
   * Endpoint: GET /api/dons/{id}
   */
  getDonationDetails(donId: number): Observable<Don> {
    return this.http.get<Don>(`${this.baseUrl}/dons/${donId}`);
  }

  /**
   * Get annual donation count
   * Endpoint: GET /api/dons/donneur/{donneurId}/compteur-annuel
   */
  getAnnualQuota(donneurId: number): Observable<{ donneurId: number; count: number }> {
    return this.http.get<{ donneurId: number; count: number }>(
      `${this.baseUrl}/dons/donneur/${donneurId}/compteur-annuel`
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ELIGIBILITY
  // ═══════════════════════════════════════════════════════════════

  /**
   * Check if donor is eligible to donate now
   * Endpoint: GET /api/dons/donneur/{donneurId}/eligibilite
   */
  getEligibility(donneurId: number): Observable<Eligibilite> {
    return this.http.get<{ donneurId: number; eligible: boolean }>(
      `${this.baseUrl}/donneurs/${donneurId}/eligibilite`
    ).pipe(
      switchMap(status => {
        if (status.eligible) {
          // If eligible, return immediate success
          return of({
            eligible: true,
            prochaineDate: new Date().toISOString(),
            joursRestants: 0,
            motif: undefined
          } as Eligibilite);
        } else {
          // If not eligible, fetch next eligible date
          return this.getNextEligibleDate(donneurId).pipe(
            map(dateResp => {
              const nextDate = new Date(dateResp.date);
              const today = new Date();
              const diff = nextDate.getTime() - today.getTime();
              const days = Math.ceil(diff / (1000 * 3600 * 24));
              
              return {
                eligible: false,
                prochaineDate: dateResp.date,
                joursRestants: Math.max(0, days),
                motif: 'Délai de carence de 8 semaines non respecté.'
              } as Eligibilite;
            })
          );
        }
      }),
      catchError(() => {
        // Fallback: assume ineligible
        return of({
          eligible: false,
          prochaineDate: new Date().toISOString(),
          joursRestants: 56,
          motif: 'Impossible de vérifier votre éligibilité'
        } as Eligibilite);
      })
    );
  }

  /**
   * Get next eligible date for donation
   * Endpoint: GET /api/dons/donneur/{donneurId}/prochaine-date-eligible
   */
  getNextEligibleDate(donneurId: number): Observable<{ donneurId: number; date: string }> {
    return this.http.get<{ donneurId: number; date: string }>(
      `${this.baseUrl}/donneurs/${donneurId}/prochaine-date-eligible`
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // APPOINTMENTS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get donor's appointments
   * Endpoint: GET /api/rendez-vous/donneur/{donneurId}
   */
  getAppointments(donneurId: number): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(`${this.baseUrl}/rendez-vous/donneur/${donneurId}`);
  }

  /**
   * Book a new appointment
   * Endpoint: POST /api/rendez-vous
   */
  bookAppointment(dto: CreateRendezVousDto): Observable<RendezVous> {
    return this.http.post<RendezVous>(`${this.baseUrl}/rendez-vous`, dto);
  }

  /**
   * Cancel appointment
   * Endpoint: DELETE /api/rendez-vous/{id}
   */
  cancelAppointment(appointmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/rendez-vous/${appointmentId}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // ALERTS & NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get shortage alerts (mock data for now)
   */
  getAlerts(): Observable<string[]> {
    return of(['Urgence : Stock critique pour le groupe O-', 'Alerte : Besoin urgent de donneurs B+']);
  }
}

