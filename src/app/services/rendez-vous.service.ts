/**
 * Rendez Vous Service - Manages all appointment/scheduling API operations
 * Endpoints: /api/rendez-vous
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { RendezVous, StatutRendezVous, ApiResponse, PageableResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {
  private readonly endpoint = '/rendez-vous';

  constructor(private api: ApiService) {}

  // ═══════════════════════════════════════════════════════════════
  // GET - Retrieve Appointments
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get all appointments with pagination
   */
  getAllRendezVous(
    page: number = 0,
    size: number = 20,
    filters?: any
  ): Observable<PageableResponse<RendezVous>> {
    let params = this.api.buildParams({
      page,
      size,
      ...filters
    });
    return this.api.get<PageableResponse<RendezVous>>(this.endpoint, params);
  }

  /**
   * Get appointment by ID
   */
  getRendezVousById(id: number): Observable<RendezVous> {
    return this.api.get<RendezVous>(`${this.endpoint}/${id}`);
  }

  /**
   * Get appointments by donor ID
   */
  getRendezVousByDonneur(donneurId: number): Observable<RendezVous[]> {
    return this.api.get<RendezVous[]>(`${this.endpoint}/donneur/${donneurId}`);
  }

  /**
   * Get appointments by collection center
   */
  getRendezVousByCentre(centreId: number): Observable<RendezVous[]> {
    return this.api.get<RendezVous[]>(`${this.endpoint}/centre/${centreId}`);
  }

  /**
   * Get scheduled (upcoming) appointments
   */
  getScheduledRendezVous(): Observable<RendezVous[]> {
    return this.api.get<RendezVous[]>(`${this.endpoint}/status/${StatutRendezVous.SCHEDULED}`);
  }

  /**
   * Get completed appointments
   */
  getCompletedRendezVous(): Observable<RendezVous[]> {
    return this.api.get<RendezVous[]>(`${this.endpoint}/status/${StatutRendezVous.COMPLETED}`);
  }

  /**
   * Get cancelled appointments
   */
  getCancelledRendezVous(): Observable<RendezVous[]> {
    return this.api.get<RendezVous[]>(`${this.endpoint}/status/${StatutRendezVous.CANCELLED}`);
  }

  /**
   * Get appointments by date
   */
  getRendezVousByDate(date: string): Observable<RendezVous[]> {
    const params = this.api.buildParams({ date });
    return this.api.get<RendezVous[]>(`${this.endpoint}/date`, params);
  }

  /**
   * Get appointments by date range
   */
  getRendezVousByDateRange(
    startDate: string,
    endDate: string
  ): Observable<RendezVous[]> {
    const params = this.api.buildParams({ startDate, endDate });
    return this.api.get<RendezVous[]>(`${this.endpoint}/date-range`, params);
  }

  /**
   * Get available time slots for a given center on a date
   */
  getAvailableSlots(
    centreId: number,
    date: string
  ): Observable<string[]> {
    const params = this.api.buildParams({ centreId, date });
    return this.api.get<string[]>(`${this.endpoint}/available-slots`, params);
  }

  /**
   * Check if donor can book appointment (eligibility check)
   */
  checkDonneurEligibility(donneurId: number): Observable<boolean> {
    return this.api.get<boolean>(`${this.endpoint}/check-eligibility/${donneurId}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // POST - Create Appointment
  // ═══════════════════════════════════════════════════════════════

  /**
   * Create new appointment
   */
  createRendezVous(
    rendezVous: Partial<RendezVous>
  ): Observable<RendezVous> {
    return this.api.post<RendezVous>(this.endpoint, rendezVous);
  }

  /**
   * Book appointment from available slot
   */
  bookAppointment(
    donneurId: number,
    centreId: number,
    dateHeure: string
  ): Observable<RendezVous> {
    return this.api.post<RendezVous>(`${this.endpoint}/book`, {
      donneurId,
      centreId,
      dateHeure
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // PUT - Update Appointment
  // ═══════════════════════════════════════════════════════════════

  /**
   * Update appointment
   */
  updateRendezVous(
    id: number,
    rendezVous: Partial<RendezVous>
  ): Observable<RendezVous> {
    return this.api.put<RendezVous>(`${this.endpoint}/${id}`, rendezVous);
  }

  /**
   * Update appointment status
   */
  updateRendezVousStatus(
    id: number,
    statut: StatutRendezVous
  ): Observable<RendezVous> {
    return this.api.patch<RendezVous>(`${this.endpoint}/${id}/status`, { statut });
  }

  /**
   * Mark appointment as completed
   */
  completeRendezVous(id: number): Observable<RendezVous> {
    return this.updateRendezVousStatus(id, StatutRendezVous.COMPLETED);
  }

  /**
   * Cancel appointment
   */
  cancelRendezVous(id: number, reason?: string): Observable<RendezVous> {
    return this.api.patch<RendezVous>(`${this.endpoint}/${id}/cancel`, {
      statut: StatutRendezVous.CANCELLED,
      raison: reason
    });
  }

  /**
   * Reschedule appointment
   */
  rescheduleRendezVous(
    id: number,
    newDateTime: string,
    newCentreId?: number
  ): Observable<RendezVous> {
    return this.api.patch<RendezVous>(`${this.endpoint}/${id}/reschedule`, {
      dateHeure: newDateTime,
      centreCollecteId: newCentreId
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // DELETE - Remove Appointment
  // ═══════════════════════════════════════════════════════════════

  /**
   * Delete appointment (usually cancelled appointments)
   */
  deleteRendezVous(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // STATISTICS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get appointments statistics
   */
  getRendezVousStats(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats`);
  }

  /**
   * Get attendance rate for a center
   */
  getAttendanceRate(centreId: number): Observable<number> {
    return this.api.get<number>(`${this.endpoint}/attendance-rate/${centreId}`);
  }
}
