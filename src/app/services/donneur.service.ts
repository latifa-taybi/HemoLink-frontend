/**
 * Donneur Service - Manages all Donneur (Donor) API operations
 * Endpoints: /api/donneurs
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { Donneur, ApiResponse, PageableResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DonneurService {
  private readonly endpoint = '/donneurs';

  constructor(private api: ApiService) {}

  // ═══════════════════════════════════════════════════════════════
  // GET - Retrieve Donors
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get all donors with pagination and filtering
   */
  getAllDonneurs(
    page: number = 0,
    size: number = 20,
    filters?: any
  ): Observable<PageableResponse<Donneur>> {
    let params = this.api.buildParams({
      page,
      size,
      ...filters
    });
    return this.api.get<PageableResponse<Donneur>>(this.endpoint, params);
  }

  /**
   * Get donor by ID
   */
  getDonneurById(id: number): Observable<Donneur> {
    return this.api.get<Donneur>(`${this.endpoint}/${id}`);
  }

  /**
   * Get donor by email
   */
  getDonneurByEmail(email: string): Observable<Donneur> {
    return this.api.get<Donneur>(`${this.endpoint}/email/${email}`);
  }

  /**
   * Search donors by name
   */
  searchDonneurs(nom: string): Observable<Donneur[]> {
    const params = this.api.buildParams({ nom });
    return this.api.get<Donneur[]>(`${this.endpoint}/search`, params);
  }

  /**
   * Get donors by blood group
   */
  getDonneursByBloodGroup(groupeSanguin: string): Observable<Donneur[]> {
    return this.api.get<Donneur[]>(`${this.endpoint}/blood-group/${groupeSanguin}`);
  }

  /**
   * Get eligible donors (donation statistics, health status, etc.)
   */
  getEligibleDonneurs(): Observable<Donneur[]> {
    return this.api.get<Donneur[]>(`${this.endpoint}/eligible`);
  }

  /**
   * Get donor donation history
   */
  getDonneurDonations(donneurId: number): Observable<any[]> {
    return this.api.get<any[]>(`${this.endpoint}/${donneurId}/donations`);
  }

  /**
   * Get donor appointments
   */
  getDonneurAppointments(donneurId: number): Observable<any[]> {
    return this.api.get<any[]>(`${this.endpoint}/${donneurId}/appointments`);
  }

  // ═══════════════════════════════════════════════════════════════
  // POST - Create Donor
  // ═══════════════════════════════════════════════════════════════

  /**
   * Create new donor
   */
  createDonneur(donneur: Partial<Donneur>): Observable<Donneur> {
    return this.api.post<Donneur>(this.endpoint, donneur);
  }

  // ═══════════════════════════════════════════════════════════════
  // PUT - Update Donor
  // ═══════════════════════════════════════════════════════════════

  /**
   * Update donor information
   */
  updateDonneur(id: number, donneur: Partial<Donneur>): Observable<Donneur> {
    return this.api.put<Donneur>(`${this.endpoint}/${id}`, donneur);
  }

  /**
   * Update donor availability status
   */
  updateDonneurAvailability(id: number, disponiblite: boolean): Observable<Donneur> {
    return this.api.patch<Donneur>(`${this.endpoint}/${id}/availability`, { disponiblite });
  }

  // ═══════════════════════════════════════════════════════════════
  // DELETE - Remove Donor (usually logical delete)
  // ═══════════════════════════════════════════════════════════════

  /**
   * Delete (deactivate) donor
   */
  deleteDonneur(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // STATISTICS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get donor statistics
   */
  getDonneurStats(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats`);
  }

  /**
   * Get statistics by blood group
   */
  getStatsByBloodGroup(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats/blood-groups`);
  }
}
