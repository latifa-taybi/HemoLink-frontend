/**
 * Don Service - Manages all donation API operations
 * Endpoints: /api/dons
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Don, GroupeSanguin, ApiResponse, PageableResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DonService {
  private readonly endpoint = '/dons';

  constructor(private api: ApiService) {}

  // ═══════════════════════════════════════════════════════════════
  // GET - Retrieve Donations
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get all donations with pagination
   */
  getAllDons(
    page: number = 0,
    size: number = 20,
    filters?: any
  ): Observable<PageableResponse<Don>> {
    let params = this.api.buildParams({
      page,
      size,
      ...filters
    });
    return this.api.get<PageableResponse<Don>>(this.endpoint, params);
  }

  /**
   * Get donation by ID
   */
  getDonById(id: number): Observable<Don> {
    return this.api.get<Don>(`${this.endpoint}/${id}`);
  }

  /**
   * Get donations by donor ID
   */
  getDonsByDonneur(donneurId: number): Observable<Don[]> {
    return this.api.get<Don[]>(`${this.endpoint}/donneur/${donneurId}`);
  }

  /**
   * Get donations by collection center
   */
  getDonsByCentre(centreId: number): Observable<Don[]> {
    return this.api.get<Don[]>(`${this.endpoint}/centre/${centreId}`);
  }

  /**
   * Get donations by blood group
   */
  getDonsByBloodGroup(groupeSanguin: GroupeSanguin): Observable<Don[]> {
    return this.api.get<Don[]>(`${this.endpoint}/blood-group/${groupeSanguin}`);
  }

  /**
   * Get Today's donations
   */
  getTodayDons(): Observable<Don[]> {
    return this.api.get<Don[]>(`${this.endpoint}/today`);
  }

  /**
   * Get donations by date
   */
  getDonsByDate(date: string): Observable<Don[]> {
    const params = this.api.buildParams({ date });
    return this.api.get<Don[]>(`${this.endpoint}/date`, params);
  }

  /**
   * Get donations by date range
   */
  getDonsByDateRange(
    startDate: string,
    endDate: string
  ): Observable<Don[]> {
    const params = this.api.buildParams({ startDate, endDate });
    return this.api.get<Don[]>(`${this.endpoint}/date-range`, params);
  }

  /**
   * Get donation with full details (donor info, blood bags, tests)
   */
  getDonDetails(id: number): Observable<Don> {
    return this.api.get<Don>(`${this.endpoint}/${id}/details`);
  }

  /**
   * Get donation history for donor
   */
  getDonneurDonationHistory(donneurId: number): Observable<Don[]> {
    return this.api.get<Don[]>(`${this.endpoint}/donneur/${donneurId}/history`);
  }

  /**
   * Get donations pending labo tests
   */
  getDonsPendingTests(): Observable<Don[]> {
    return this.api.get<Don[]>(`${this.endpoint}/pending-tests`);
  }

  // ═══════════════════════════════════════════════════════════════
  // POST - Create Donation
  // ═══════════════════════════════════════════════════════════════

  /**
   * Create new donation record
   */
  createDon(don: Partial<Don>): Observable<Don> {
    return this.api.post<Don>(this.endpoint, don);
  }

  /**
   * Record donation with blood bags
   */
  recordDonation(
    donneurId: number,
    centreId: number,
    volumeCollecte: number,
    groupeSanguin: GroupeSanguin
  ): Observable<Don> {
    return this.api.post<Don>(`${this.endpoint}/record`, {
      donneurId,
      centreId,
      volumeCollecte,
      groupeSanguin,
      dateHeure: new Date().toISOString()
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // PUT - Update Donation
  // ═══════════════════════════════════════════════════════════════

  /**
   * Update donation information
   */
  updateDon(id: number, don: Partial<Don>): Observable<Don> {
    return this.api.put<Don>(`${this.endpoint}/${id}`, don);
  }

  /**
   * Add notes/comments to donation
   */
  addNotesToDon(id: number, notes: string): Observable<Don> {
    return this.api.patch<Don>(`${this.endpoint}/${id}/notes`, { notes });
  }

  /**
   * Add blood bag to donation
   */
  addBloodBagToDon(donId: number, pocheSangId: number): Observable<Don> {
    return this.api.post<Don>(`${this.endpoint}/${donId}/blood-bags`, {
      pocheSangId
    });
  }

  /**
   * Remove blood bag from donation
   */
  removeBloodBagFromDon(donId: number, pocheSangId: number): Observable<Don> {
    return this.api.delete<Don>(`${this.endpoint}/${donId}/blood-bags/${pocheSangId}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // DELETE - Remove Donation
  // ═══════════════════════════════════════════════════════════════

  /**
   * Delete donation record (usually logical delete)
   */
  deleteDon(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // STATISTICS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get donation statistics
   */
  getDonStats(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats`);
  }

  /**
   * Get donation statistics for a donor
   */
  getDonneurDonStats(donneurId: number): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/donneur/${donneurId}/stats`);
  }

  /**
   * Get collection center donation statistics
   */
  getCentreDonStats(centreId: number): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/centre/${centreId}/stats`);
  }

  /**
   * Get total collected volume
   */
  getTotalCollectedVolume(): Observable<number> {
    return this.api.get<number>(`${this.endpoint}/total-volume`);
  }

  /**
   * Get average donation volume
   */
  getAverageDonationVolume(): Observable<number> {
    return this.api.get<number>(`${this.endpoint}/average-volume`);
  }

  /**
   * Get donation efficiency report
   */
  getEfficiencyReport(startDate: string, endDate: string): Observable<any> {
    const params = this.api.buildParams({ startDate, endDate });
    return this.api.get<any>(`${this.endpoint}/efficiency-report`, params);
  }
}
