/**
 * Donneur Service - Donor Management
 * Endpoints: /api/donneurs
 * Handles donor profiles, eligibility, donations tracking
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { Donneur, GroupeSanguin, PageableResponse } from '../models';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DonneurService {
  private readonly api = inject(ApiService);
  private readonly endpoint = '/donneurs';

  // ═══════════════════════════════════════════════════════════════
  // GET - Retrieve Donors
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get all donors with pagination and filtering
   * @param page - Page number (0-indexed)
   * @param size - Number of records per page
   * @param filters - Optional filters (groupeSanguin, dateNaissance, etc)
   */
  getAllDonneurs(
    page: number = 0,
    size: number = 20,
    filters?: any
  ): Observable<PageableResponse<Donneur>> {
    let params = this.api.buildParams({ page, size, ...filters });
    return this.api.get<PageableResponse<Donneur>>(this.endpoint, params);
  }

  /**
   * Get donor by ID
   */
  getDonneurById(id: number): Observable<Donneur> {
    return this.api.get<Donneur>(`${this.endpoint}/${id}`);
  }

  /**
   * Get donor by user ID
   */
  getDonneurByUtilisateurId(utilisateurId: number): Observable<Donneur> {
    return this.api.get<Donneur>(`${this.endpoint}/utilisateur/${utilisateurId}`);
  }

  /**
   * Search donors by name or email
   */
  searchDonneurs(query: string): Observable<Donneur[]> {
    let params = this.api.buildParams({ query });
    return this.api.get<Donneur[]>(`${this.endpoint}/search`, params);
  }

  /**
   * Get donors by blood group
   * @param groupeSanguin - Blood type (O_PLUS, A_MINUS, etc)
   */
  getDonneursByBloodGroup(groupeSanguin: GroupeSanguin): Observable<Donneur[]> {
    return this.api.get<Donneur[]>(`${this.endpoint}/blood-group/${groupeSanguin}`);
  }

  /**
   * Get eligible donors for donation
   * Checks donation frequency, weight, health status
   */
  getEligibleDonneurs(): Observable<Donneur[]> {
    return this.api.get<Donneur[]>(`${this.endpoint}/eligible`);
  }

  /**
   * Get eligible donors by blood group
   */
  getEligibleDonneursByBloodGroup(groupeSanguin: GroupeSanguin): Observable<Donneur[]> {
    return this.api.get<Donneur[]>(`${this.endpoint}/eligible/blood-group/${groupeSanguin}`);
  }

  /**
   * Get donor donation history
   */
  getDonneurDonations(donneurId: number): Observable<any[]> {
    return this.api.get<any[]>(`${this.endpoint}/${donneurId}/donations`);
  }

  /**
   * Get donor appointments/rendez-vous
   */
  getDonneurAppointments(donneurId: number): Observable<any[]> {
    return this.api.get<any[]>(`${this.endpoint}/${donneurId}/appointments`);
  }

  /**
   * Get donor statistics
   */
  getDonneurStats(donneurId: number): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/${donneurId}/stats`);
  }

  /**
   * Check donor eligibility for donation
   */
  checkEligibility(donneurId: number): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/${donneurId}/check-eligibility`);
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
  // PUT/PATCH - Update Donor
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
  updateDonneurAvailability(id: number, disponible: boolean): Observable<Donneur> {
    return this.api.patch<Donneur>(
      `${this.endpoint}/${id}/availability`,
      { disponible }
    );
  }

  /**
   * Update last donation date
   */
  updateLastDonationDate(donneurId: number, date: Date): Observable<Donneur> {
    return this.api.patch<Donneur>(
      `${this.endpoint}/${donneurId}/last-donation`,
      { dateDernierDon: date }
    );
  }

  /**
   * Update annual donation count
   */
  updateAnnualDonationCount(donneurId: number, count: number): Observable<Donneur> {
    return this.api.patch<Donneur>(
      `${this.endpoint}/${donneurId}/annual-count`,
      { nombreDonsAnnuel: count }
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // DELETE - Remove Donor
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
   * Get donor statistics by blood group
   */
  getStatsByBloodGroup(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats/blood-groups`);
  }

  /**
   * Get all donors statistics
   */
  getDonneursStats(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats`);
  }

  /**
   * Get donation frequency report
   */
  getDonationFrequencyReport(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/reports/frequency`);
  }
}
