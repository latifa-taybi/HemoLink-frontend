/**
 * Centre Collecte Service - Manages all collection center API operations
 * Endpoints: /api/centres-collecte
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CentreCollecte, ApiResponse, PageableResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CentreCollecteService {
  private readonly endpoint = '/centres-collecte';

  constructor(private api: ApiService) {}

  // ═══════════════════════════════════════════════════════════════
  // GET - Retrieve Collection Centers
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get all collection centers with pagination
   */
  getAllCentres(
    page: number = 0,
    size: number = 20,
    filters?: any
  ): Observable<PageableResponse<CentreCollecte>> {
    let params = this.api.buildParams({
      page,
      size,
      ...filters
    });
    return this.api.get<PageableResponse<CentreCollecte>>(this.endpoint, params);
  }

  /**
   * Get collection center by ID
   */
  getCentreById(id: number): Observable<CentreCollecte> {
    return this.api.get<CentreCollecte>(`${this.endpoint}/${id}`);
  }

  /**
   * Get centers by city
   */
  getCentresByCity(ville: string): Observable<CentreCollecte[]> {
    const params = this.api.buildParams({ ville });
    return this.api.get<CentreCollecte[]>(`${this.endpoint}/city`, params);
  }

  /**
   * Search centers by name
   */
  searchCentres(nom: string): Observable<CentreCollecte[]> {
    const params = this.api.buildParams({ nom });
    return this.api.get<CentreCollecte[]>(`${this.endpoint}/search`, params);
  }

  /**
   * Get nearby collection centers (geolocation based)
   */
  getNearByCentres(latitude: number, longitude: number, radiusKm: number = 5): Observable<CentreCollecte[]> {
    const params = this.api.buildParams({
      latitude,
      longitude,
      radiusKm
    });
    return this.api.get<CentreCollecte[]>(`${this.endpoint}/nearby`, params);
  }

  /**
   * Get collection center details with staff and schedule
   */
  getCentreDetails(id: number): Observable<CentreCollecte> {
    return this.api.get<CentreCollecte>(`${this.endpoint}/${id}/details`);
  }

  /**
   * Get center appointments
   */
  getCentreAppointments(centreId: number): Observable<any[]> {
    return this.api.get<any[]>(`${this.endpoint}/${centreId}/appointments`);
  }

  /**
   * Get center staff
   */
  getCentreStaff(centreId: number): Observable<any[]> {
    return this.api.get<any[]>(`${this.endpoint}/${centreId}/staff`);
  }

  /**
   * Get center schedule/hours
   */
  getCentreSchedule(centreId: number): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/${centreId}/schedule`);
  }

  /**
   * Get all active centers
   */
  getActiveCentres(): Observable<CentreCollecte[]> {
    return this.api.get<CentreCollecte[]>(`${this.endpoint}/active`);
  }

  /**
   * Get center blood stock
   */
  getCentreStock(centreId: number): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/${centreId}/stock`);
  }

  // ═══════════════════════════════════════════════════════════════
  // POST - Create Collection Center
  // ═══════════════════════════════════════════════════════════════

  /**
   * Create new collection center
   */
  createCentre(centre: Partial<CentreCollecte>): Observable<CentreCollecte> {
    return this.api.post<CentreCollecte>(this.endpoint, centre);
  }

  /**
   * Add staff to center
   */
  addStaffToCentre(centreId: number, staffId: number): Observable<CentreCollecte> {
    return this.api.post<CentreCollecte>(`${this.endpoint}/${centreId}/staff`, {
      staffId
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // PUT - Update Collection Center
  // ═══════════════════════════════════════════════════════════════

  /**
   * Update collection center information
   */
  updateCentre(id: number, centre: Partial<CentreCollecte>): Observable<CentreCollecte> {
    return this.api.put<CentreCollecte>(`${this.endpoint}/${id}`, centre);
  }

  /**
   * Update center contact information
   */
  updateCentreContact(
    id: number,
    telephone: string,
    email: string,
    adresse: string
  ): Observable<CentreCollecte> {
    return this.api.patch<CentreCollecte>(`${this.endpoint}/${id}/contact`, {
      telephone,
      email,
      adresse
    });
  }

  /**
   * Update center status
   */
  updateCentreStatus(id: number, actif: boolean): Observable<CentreCollecte> {
    return this.api.patch<CentreCollecte>(`${this.endpoint}/${id}/status`, { actif });
  }

  /**
   * Update center schedule
   */
  updateCentreSchedule(id: number, schedule: any): Observable<CentreCollecte> {
    return this.api.patch<CentreCollecte>(`${this.endpoint}/${id}/schedule`, schedule);
  }

  // ═══════════════════════════════════════════════════════════════
  // DELETE - Remove Collection Center
  // ═══════════════════════════════════════════════════════════════

  /**
   * Delete collection center
   */
  deleteCentre(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Remove staff from center
   */
  removeStaffFromCentre(centreId: number, staffId: number): Observable<CentreCollecte> {
    return this.api.delete<CentreCollecte>(`${this.endpoint}/${centreId}/staff/${staffId}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // STATISTICS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get all centers statistics
   */
  getCentreStats(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats`);
  }

  /**
   * Get specific center statistics
   */
  getSpecificCentreStats(id: number): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/${id}/stats`);
  }

  /**
   * Get center donation summary
   */
  getDonationSummary(centreId: number): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/${centreId}/donation-summary`);
  }

  /**
   * Get center attendance report
   */
  getAttendanceReport(centreId: number, startDate: string, endDate: string): Observable<any> {
    const params = this.api.buildParams({ startDate, endDate });
    return this.api.get<any>(`${this.endpoint}/${centreId}/attendance-report`, params);
  }

  /**
   * Get center performance metrics
   */
  getPerformanceMetrics(centreId: number): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/${centreId}/performance-metrics`);
  }
}
