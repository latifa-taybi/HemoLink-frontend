/**
 * Poche Sang Service - Blood Bag Inventory Management
 * Endpoints: /api/poches-sang
 * Manages blood bags, stock levels, status tracking, FEFO inventory
 * Statuses: EN_ATTENTE_TEST, DISPONIBLE, RESERVEE, TRANSFUSEE, ECARTEE, EXPIRE
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { PocheSang, StatutSang, GroupeSanguin, PageableResponse } from '../models';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PocheSangService {
  private readonly api = inject(ApiService);
  private readonly endpoint = '/poches-sang';

  // ═══════════════════════════════════════════════════════════════
  // GET - Retrieve Blood Bags
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get all blood bags with pagination
   */
  getAllPoches(
    page: number = 0,
    size: number = 20,
    filters?: any
  ): Observable<PageableResponse<PocheSang>> {
    let params = this.api.buildParams({
      page,
      size,
      ...filters
    });
    return this.api.get<PageableResponse<PocheSang>>(this.endpoint, params);
  }

  /**
   * Get blood bag by ID
   */
  getPocheById(id: number): Observable<PocheSang> {
    return this.api.get<PocheSang>(`${this.endpoint}/${id}`);
  }

  /**
   * Get blood bags by blood group
   */
  getPochesByBloodGroup(groupeSanguin: GroupeSanguin): Observable<PocheSang[]> {
    return this.api.get<PocheSang[]>(`${this.endpoint}/blood-group/${groupeSanguin}`);
  }

  /**
   * Get available blood bags
   */
  getAvailablePoches(): Observable<PocheSang[]> {
    return this.api.get<PocheSang[]>(`${this.endpoint}/status/${StatutSang.AVAILABLE}`);
  }

  /**
   * Get blood bags in quarantine
   */
  getQuarantinePoches(): Observable<PocheSang[]> {
    return this.api.get<PocheSang[]>(`${this.endpoint}/status/${StatutSang.QUARANTINE}`);
  }

  /**
   * Get used blood bags
   */
  getUsedPoches(): Observable<PocheSang[]> {
    return this.api.get<PocheSang[]>(`${this.endpoint}/status/${StatutSang.USED}`);
  }

  /**
   * Get expired blood bags
   */
  getExpiredPoches(): Observable<PocheSang[]> {
    return this.api.get<PocheSang[]>(`${this.endpoint}/status/${StatutSang.EXPIRED}`);
  }

  /**
   * Get blood bags by donation ID
   */
  getPochesByDon(donId: number): Observable<PocheSang[]> {
    return this.api.get<PocheSang[]>(`${this.endpoint}/donation/${donId}`);
  }

  /**
   * Get blood bags by labo tests
   */
  getPochesByLabo(laboId: number): Observable<PocheSang[]> {
    return this.api.get<PocheSang[]>(`${this.endpoint}/labo/${laboId}`);
  }

  /**
   * Get soon-to-expire blood bags
   */
  getNearExpiryPoches(daysThreshold: number = 7): Observable<PocheSang[]> {
    const params = this.api.buildParams({ daysThreshold });
    return this.api.get<PocheSang[]>(`${this.endpoint}/near-expiry`, params);
  }

  /**
   * Get blood bag inventory statistics
   */
  getInventoryStats(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/inventory/stats`);
  }

  /**
   * Get stock by blood group
   */
  getStockByBloodGroup(): Observable<{ [key: string]: number }> {
    return this.api.get<{ [key: string]: number }>(`${this.endpoint}/stock/by-blood-group`);
  }

  // ═══════════════════════════════════════════════════════════════
  // POST - Create Blood Bag Entry
  // ═══════════════════════════════════════════════════════════════

  /**
   * Create new blood bag entry (usually created from donation)
   */
  createPoche(poche: Partial<PocheSang>): Observable<PocheSang> {
    return this.api.post<PocheSang>(this.endpoint, poche);
  }

  // ═══════════════════════════════════════════════════════════════
  // PUT - Update Blood Bag
  // ═══════════════════════════════════════════════════════════════

  /**
   * Update blood bag information
   */
  updatePoche(id: number, poche: Partial<PocheSang>): Observable<PocheSang> {
    return this.api.put<PocheSang>(`${this.endpoint}/${id}`, poche);
  }

  /**
   * Update blood bag status
   */
  updatePocheStatus(id: number, statut: StatutSang): Observable<PocheSang> {
    return this.api.patch<PocheSang>(`${this.endpoint}/${id}/status`, { statut });
  }

  /**
   * Move blood bag from quarantine to available
   */
  releaseFromQuarantine(id: number): Observable<PocheSang> {
    return this.updatePocheStatus(id, StatutSang.AVAILABLE);
  }

  /**
   * Mark blood bag as used
   */
  markAsUsed(id: number): Observable<PocheSang> {
    return this.updatePocheStatus(id, StatutSang.USED);
  }

  /**
   * Mark blood bag as expired
   */
  markAsExpired(id: number): Observable<PocheSang> {
    return this.updatePocheStatus(id, StatutSang.EXPIRED);
  }

  /**
   * Add labo test result to blood bag
   */
  addLaboTest(pocheId: number, testId: number): Observable<PocheSang> {
    return this.api.post<PocheSang>(`${this.endpoint}/${pocheId}/labo-tests`, {
      testId
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // DELETE - Remove Blood Bag
  // ═══════════════════════════════════════════════════════════════

  /**
   * Delete blood bag record
   */
  deletePoche(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILITY
  // ═══════════════════════════════════════════════════════════════

  /**
   * Check if blood bag is still usable
   */
  isUsable(poche: PocheSang): boolean {
    return poche.statut === StatutSang.AVAILABLE &&
           new Date(poche.dateExpiration) > new Date();
  }

  /**
   * Get days until expiration
   */
  daysUntilExpiry(poche: PocheSang): number {
    const today = new Date();
    const expiry = new Date(poche.dateExpiration);
    const diff = expiry.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }
}
