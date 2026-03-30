/**
 * Don Service - Donation Recording & Tracking
 * Endpoints: /api/dons
 * Manages donation records, history, and analytics
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { Don, GroupeSanguin, PageableResponse } from '../models';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DonService {
  private readonly api = inject(ApiService);
  private readonly endpoint = '/dons';

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
    let params = this.api.buildParams({ page, size, ...filters });
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
   * Get donations by date range
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   */
  getDonsByDateRange(startDate: Date, endDate: Date): Observable<Don[]> {
    let params = this.api.buildParams({
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(endDate)
    });
    return this.api.get<Don[]>(`${this.endpoint}/date-range`, params);
  }

  /**
   * Get donations by blood group
   */
  getDonsByBloodGroup(groupeSanguin: GroupeSanguin): Observable<Don[]> {
    return this.api.get<Don[]>(`${this.endpoint}/blood-group/${groupeSanguin}`);
  }

  /**
   * Get donations by center
   */
  getDonsByCenter(centreId: number): Observable<Don[]> {
    return this.api.get<Don[]>(`${this.endpoint}/center/${centreId}`);
  }

  /**
   * Get donations from today
   */
  getTodaysDonations(): Observable<Don[]> {
    return this.api.get<Don[]>(`${this.endpoint}/today`);
  }

  /**
   * Get donations from this week
   */
  getWeeksDonations(): Observable<Don[]> {
    return this.api.get<Don[]>(`${this.endpoint}/week`);
  }

  /**
   * Get donations from this month
   */
  getMonthsDonations(): Observable<Don[]> {
    return this.api.get<Don[]>(`${this.endpoint}/month`);
  }

  /**
   * Get total collected volume (ML)
   */
  getTotalCollectedVolume(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats/total-volume`);
  }

  /**
   * Get average donation volume
   */
  getAverageDonationVolume(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats/average-volume`);
  }

  /**
   * Get collection efficiency report
   */
  getEfficiencyReport(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/reports/efficiency`);
  }

  /**
   * Get donation trend by month
   */
  getDonationTrend(months: number = 12): Observable<any> {
    let params = this.api.buildParams({ months });
    return this.api.get<any>(`${this.endpoint}/trends`, params);
  }

  // ═══════════════════════════════════════════════════════════════
  // POST - Create Donation
  // ═══════════════════════════════════════════════════════════════

  /**
   * Record new donation
   */
  recordDonation(don: Partial<Don>): Observable<Don> {
    return this.api.post<Don>(this.endpoint, don);
  }

  /**
   * Record donation with blood bag creation
   */
  recordDonationWithBag(don: Partial<Don>, bagDetails: any): Observable<any> {
    return this.api.post<any>(
      `${this.endpoint}/with-bag`,
      { don, bagDetails }
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // PUT/PATCH - Update Donation
  // ═══════════════════════════════════════════════════════════════

  /**
   * Update donation information
   */
  updateDon(id: number, don: Partial<Don>): Observable<Don> {
    return this.api.put<Don>(`${this.endpoint}/${id}`, don);
  }

  /**
   * Update donation volume
   */
  updateVolume(donId: number, volumeMl: number): Observable<Don> {
    return this.api.patch<Don>(
      `${this.endpoint}/${donId}/volume`,
      { volumeMl }
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // DELETE - Remove Donation
  // ═══════════════════════════════════════════════════════════════

  /**
   * Delete donation record
   */
  deleteDon(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // STATISTICS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get donation statistics by blood group
   */
  getStatsByBloodGroup(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats/by-blood-group`);
  }

  /**
   * Get donation statistics by center
   */
  getStatsByCenter(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats/by-center`);
  }

  /**
   * Get all donations statistics
   */
  getDonsStats(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats`);
  }

  // ═══════════════════════════════════════════════════════════════
  // HELPER METHODS
  // ═══════════════════════════════════════════════════════════════

  private formatDate(date: Date): string {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }
}
