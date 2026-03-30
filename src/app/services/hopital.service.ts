/**
 * Hopital Service - Hospital Management
 * Endpoints: /api/hopitals
 * Manages hospital profiles, staff, orders, consumption analytics
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { Hopital, PageableResponse } from '../models';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HopitalService {
  private readonly api = inject(ApiService);
  private readonly endpoint = '/hopitals';

  // ═══════════════════════════════════════════════════════════════
  // GET - Retrieve Hospitals
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get all hospitals with pagination
   */
  getAllHopitals(
    page: number = 0,
    size: number = 20,
    filters?: any
  ): Observable<PageableResponse<Hopital>> {
    let params = this.api.buildParams({
      page,
      size,
      ...filters
    });
    return this.api.get<PageableResponse<Hopital>>(this.endpoint, params);
  }

  /**
   * Get hospital by ID
   */
  getHopitalById(id: number): Observable<Hopital> {
    return this.api.get<Hopital>(`${this.endpoint}/${id}`);
  }

  /**
   * Get hospitals by city
   */
  getHopitalsByCity(ville: string): Observable<Hopital[]> {
    const params = this.api.buildParams({ ville });
    return this.api.get<Hopital[]>(`${this.endpoint}/city`, params);
  }

  /**
   * Search hospitals by name
   */
  searchHopitals(nom: string): Observable<Hopital[]> {
    const params = this.api.buildParams({ nom });
    return this.api.get<Hopital[]>(`${this.endpoint}/search`, params);
  }

  /**
   * Get nearby hospitals (geolocation based)
   */
  getNearbyHopitals(latitude: number, longitude: number, radiusKm: number = 10): Observable<Hopital[]> {
    const params = this.api.buildParams({
      latitude,
      longitude,
      radiusKm
    });
    return this.api.get<Hopital[]>(`${this.endpoint}/nearby`, params);
  }

  /**
   * Get hospital details with staff and equipment
   */
  getHopitalDetails(id: number): Observable<Hopital> {
    return this.api.get<Hopital>(`${this.endpoint}/${id}/details`);
  }

  /**
   * Get hospital blood orders
   */
  getHopitalOrders(hopitalId: number): Observable<any[]> {
    return this.api.get<any[]>(`${this.endpoint}/${hopitalId}/orders`);
  }

  /**
   * Get hospital staff
   */
  getHopitalStaff(hopitalId: number): Observable<any[]> {
    return this.api.get<any[]>(`${this.endpoint}/${hopitalId}/staff`);
  }

  /**
   * Get all hospitals
   */
  getActiveHopitals(): Observable<Hopital[]> {
    return this.api.get<Hopital[]>(`${this.endpoint}/active`);
  }

  // ═══════════════════════════════════════════════════════════════
  // POST - Create Hospital
  // ═══════════════════════════════════════════════════════════════

  /**
   * Create new hospital
   */
  createHopital(hopital: Partial<Hopital>): Observable<Hopital> {
    return this.api.post<Hopital>(this.endpoint, hopital);
  }

  /**
   * Add staff member to hospital
   */
  addStaffToHopital(hopitalId: number, staffId: number): Observable<Hopital> {
    return this.api.post<Hopital>(`${this.endpoint}/${hopitalId}/staff`, {
      staffId
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // PUT - Update Hospital
  // ═══════════════════════════════════════════════════════════════

  /**
   * Update hospital information
   */
  updateHopital(id: number, hopital: Partial<Hopital>): Observable<Hopital> {
    return this.api.put<Hopital>(`${this.endpoint}/${id}`, hopital);
  }

  /**
   * Update hospital contact information
   */
  updateHopitalContact(
    id: number,
    telephone: string,
    email: string,
    adresse: string
  ): Observable<Hopital> {
    return this.api.patch<Hopital>(`${this.endpoint}/${id}/contact`, {
      telephone,
      email,
      adresse
    });
  }

  /**
   * Update hospital status
   */
  updateHopitalStatus(id: number, actif: boolean): Observable<Hopital> {
    return this.api.patch<Hopital>(`${this.endpoint}/${id}/status`, { actif });
  }

  // ═══════════════════════════════════════════════════════════════
  // DELETE - Remove Hospital
  // ═══════════════════════════════════════════════════════════════

  /**
   * Delete hospital
   */
  deleteHopital(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Remove staff member from hospital
   */
  removeStaffFromHopital(hopitalId: number, staffId: number): Observable<Hopital> {
    return this.api.delete<Hopital>(`${this.endpoint}/${hopitalId}/staff/${staffId}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // STATISTICS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get hospital statistics (orders, staff, etc.)
   */
  getHopitalStats(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats`);
  }

  /**
   * Get hospital-specific statistics
   */
  getSpecificHopitalStats(id: number): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/${id}/stats`);
  }

  /**
   * Get hospital orders summary
   */
  getOrdersSummary(hopitalId: number): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/${hopitalId}/orders-summary`);
  }

  /**
   * Get hospital consumption report
   */
  getConsumptionReport(hopitalId: number, startDate: string, endDate: string): Observable<any> {
    const params = this.api.buildParams({ startDate, endDate });
    return this.api.get<any>(`${this.endpoint}/${hopitalId}/consumption-report`, params);
  }
}
