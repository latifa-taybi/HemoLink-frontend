/**
 * Centre Collecte Service - Collection Center Management
 * Endpoints: /api/centres-collecte
 * Manages collection centers, schedules, and location-based queries
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { CentreCollecte, PageableResponse } from '../models';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CentreCollecteService {
  private readonly api = inject(ApiService);
  private readonly endpoint = '/centres-collecte';

  // ═══════════════════════════════════════════════════════════════
  // GET - Retrieve Centers
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get all collection centers with pagination
   */
  getAllCentres(
    page: number = 0,
    size: number = 20,
    filters?: any
  ): Observable<PageableResponse<CentreCollecte>> {
    let params = this.api.buildParams({ page, size, ...filters });
    return this.api.get<PageableResponse<CentreCollecte>>(this.endpoint, params);
  }

  /**
   * Get center by ID
   */
  getCentreById(id: number): Observable<CentreCollecte> {
    return this.api.get<CentreCollecte>(`${this.endpoint}/${id}`);
  }

  /**
   * Find nearby collection centers by coordinates
   * @param latitude - Current latitude
   * @param longitude - Current longitude
   * @param radiusKm - Search radius in kilometers
   */
  getNearByCentres(latitude: number, longitude: number, radiusKm: number = 20): Observable<CentreCollecte[]> {
    let params = this.api.buildParams({ latitude, longitude, radius: radiusKm });
    return this.api.get<CentreCollecte[]>(`${this.endpoint}/nearby`, params);
  }

  /**
   * Get centers by city
   */
  getCentresByCity(city: string): Observable<CentreCollecte[]> {
    return this.api.get<CentreCollecte[]>(`${this.endpoint}/city/${city}`);
  }

  /**
   * Search centers by name
   */
  searchCentres(nom: string): Observable<CentreCollecte[]> {
    let params = this.api.buildParams({ nom });
    return this.api.get<CentreCollecte[]>(`${this.endpoint}/search`, params);
  }

  /**
   * Get center operating schedule
   */
  getCentreSchedule(centreId: number): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/${centreId}/schedule`);
  }

  /**
   * Get center blood inventory
   */
  getCentreStock(centreId: number): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/${centreId}/stock`);
  }

  /**
   * Get center performance metrics
   */
  getCentrePerformance(centreId: number): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/${centreId}/performance`);
  }

  /**
   * Get center attendance report
   */
  getAttendanceReport(centreId: number): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/${centreId}/attendance`);
  }

  /**
   * Get center staff
   */
  getCentreStaff(centreId: number): Observable<any[]> {
    return this.api.get<any[]>(`${this.endpoint}/${centreId}/staff`);
  }

  /**
   * Get available appointment slots for center
   */
  getAvailableSlots(centreId: number, date?: Date): Observable<any[]> {
    let params = this.api.buildParams(date ? { date } : {});
    return this.api.get<any[]>(`${this.endpoint}/${centreId}/available-slots`, params);
  }

  // ═══════════════════════════════════════════════════════════════
  // POST - Create Center
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
  addStaffToCentre(centreId: number, staffId: number): Observable<any> {
    return this.api.post<any>(
      `${this.endpoint}/${centreId}/staff`,
      { staffId }
    );
  }

  /**
   * Add schedule hours to center
   */
  addScheduleToCentre(centreId: number, schedule: any): Observable<any> {
    return this.api.post<any>(
      `${this.endpoint}/${centreId}/schedule`,
      schedule
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // PUT/PATCH - Update Center
  // ═══════════════════════════════════════════════════════════════

  /**
   * Update center information
   */
  updateCentre(id: number, centre: Partial<CentreCollecte>): Observable<CentreCollecte> {
    return this.api.put<CentreCollecte>(`${this.endpoint}/${id}`, centre);
  }

  /**
   * Update center location
   */
  updateLocation(centreId: number, latitude: number, longitude: number): Observable<CentreCollecte> {
    return this.api.patch<CentreCollecte>(
      `${this.endpoint}/${centreId}/location`,
      { latitude, longitude }
    );
  }

  /**
   * Update center contact information
   */
  updateContact(centreId: number, telephone: string): Observable<CentreCollecte> {
    return this.api.patch<CentreCollecte>(
      `${this.endpoint}/${centreId}/contact`,
      { telephone }
    );
  }

  /**
   * Update center schedule
   */
  updateSchedule(centreId: number, schedule: any): Observable<any> {
    return this.api.patch<any>(
      `${this.endpoint}/${centreId}/schedule`,
      schedule
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // DELETE - Remove from Center
  // ═══════════════════════════════════════════════════════════════

  /**
   * Delete center
   */
  deleteCentre(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Remove staff from center
   */
  removeStaffFromCentre(centreId: number, staffId: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${centreId}/staff/${staffId}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // STATISTICS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get all centers statistics
   */
  getCentresStats(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats`);
  }

  /**
   * Get centers by city statistics
   */
  getStatsByCities(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats/by-city`);
  }
}
