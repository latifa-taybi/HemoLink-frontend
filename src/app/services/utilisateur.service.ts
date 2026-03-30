/**
 * Utilisateur Service - Manages all user API operations
 * Endpoints: /api/utilisateurs
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Utilisateur, RoleUtilisateur, ApiResponse, PageableResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private readonly endpoint = '/utilisateurs';

  constructor(private api: ApiService) {}

  // ═══════════════════════════════════════════════════════════════
  // GET - Retrieve Users
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get all users with pagination
   */
  getAllUtilisateurs(
    page: number = 0,
    size: number = 20,
    filters?: any
  ): Observable<PageableResponse<Utilisateur>> {
    let params = this.api.buildParams({
      page,
      size,
      ...filters
    });
    return this.api.get<PageableResponse<Utilisateur>>(this.endpoint, params);
  }

  /**
   * Get user by ID
   */
  getUtilisateurById(id: number): Observable<Utilisateur> {
    return this.api.get<Utilisateur>(`${this.endpoint}/${id}`);
  }

  /**
   * Get user by email
   */
  getUtilisateurByEmail(email: string): Observable<Utilisateur> {
    return this.api.get<Utilisateur>(`${this.endpoint}/email/${email}`);
  }

  /**
   * Search users by name
   */
  searchUtilisateurs(nom: string): Observable<Utilisateur[]> {
    const params = this.api.buildParams({ nom });
    return this.api.get<Utilisateur[]>(`${this.endpoint}/search`, params);
  }

  /**
   * Get users by role
   */
  getUtilisateursByRole(role: RoleUtilisateur): Observable<Utilisateur[]> {
    return this.api.get<Utilisateur[]>(`${this.endpoint}/role/${role}`);
  }

  /**
   * Get admins
   */
  getAdmins(): Observable<Utilisateur[]> {
    return this.api.get<Utilisateur[]>(`${this.endpoint}/role/${RoleUtilisateur.ADMIN}`);
  }

  /**
   * Get donors
   */
  getDonneurs(): Observable<Utilisateur[]> {
    return this.api.get<Utilisateur[]>(`${this.endpoint}/role/${RoleUtilisateur.DONNEUR}`);
  }

  /**
   * Get hospital staff
   */
  getHospitalStaff(): Observable<Utilisateur[]> {
    return this.api.get<Utilisateur[]>(`${this.endpoint}/role/${RoleUtilisateur.HOPITAL}`);
  }

  /**
   * Get center collection personnel
   */
  getCentrePersonnel(): Observable<Utilisateur[]> {
    return this.api.get<Utilisateur[]>(`${this.endpoint}/role/${RoleUtilisateur.PERSONNEL_CENTRE}`);
  }

  /**
   * Get lab personnel
   */
  getLabPersonnel(): Observable<Utilisateur[]> {
    return this.api.get<Utilisateur[]>(`${this.endpoint}/role/${RoleUtilisateur.LABO_PERSONNEL}`);
  }

  /**
   * Get active users
   */
  getActiveUtilisateurs(): Observable<Utilisateur[]> {
    return this.api.get<Utilisateur[]>(`${this.endpoint}/active`);
  }

  /**
   * Get inactive users
   */
  getInactiveUtilisateurs(): Observable<Utilisateur[]> {
    return this.api.get<Utilisateur[]>(`${this.endpoint}/inactive`);
  }

  // ═══════════════════════════════════════════════════════════════
  // POST - Create User
  // ═══════════════════════════════════════════════════════════════

  /**
   * Create new user (admin only)
   */
  createUtilisateur(utilisateur: Partial<Utilisateur>): Observable<Utilisateur> {
    return this.api.post<Utilisateur>(this.endpoint, utilisateur);
  }

  // ═══════════════════════════════════════════════════════════════
  // PUT - Update User
  // ═══════════════════════════════════════════════════════════════

  /**
   * Update user information
   */
  updateUtilisateur(id: number, utilisateur: Partial<Utilisateur>): Observable<Utilisateur> {
    return this.api.put<Utilisateur>(`${this.endpoint}/${id}`, utilisateur);
  }

  /**
   * Update user role (admin only)
   */
  updateUtilisateurRole(id: number, role: RoleUtilisateur): Observable<Utilisateur> {
    return this.api.patch<Utilisateur>(`${this.endpoint}/${id}/role`, { role });
  }

  /**
   * Update user status (active/inactive)
   */
  updateUtilisateurStatus(id: number, actif: boolean): Observable<Utilisateur> {
    return this.api.patch<Utilisateur>(`${this.endpoint}/${id}/status`, { actif });
  }

  /**
   * Update user password
   */
  updatePassword(id: number, oldPassword: string, newPassword: string): Observable<Utilisateur> {
    return this.api.patch<Utilisateur>(`${this.endpoint}/${id}/password`, {
      oldPassword,
      newPassword
    });
  }

  /**
   * Reset user password (admin only)
   */
  resetPassword(id: number, tempPassword: string): Observable<Utilisateur> {
    return this.api.patch<Utilisateur>(`${this.endpoint}/${id}/reset-password`, {
      tempPassword
    });
  }

  /**
   * Enable 2FA for user
   */
  enable2FA(id: number): Observable<any> {
    return this.api.patch<any>(`${this.endpoint}/${id}/2fa-enable`, {});
  }

  /**
   * Disable 2FA for user
   */
  disable2FA(id: number): Observable<any> {
    return this.api.patch<any>(`${this.endpoint}/${id}/2fa-disable`, {});
  }

  /**
   * Update user profile
   */
  updateProfile(id: number, profile: any): Observable<Utilisateur> {
    return this.api.patch<Utilisateur>(`${this.endpoint}/${id}/profile`, profile);
  }

  // ═══════════════════════════════════════════════════════════════
  // DELETE - Remove User
  // ═══════════════════════════════════════════════════════════════

  /**
   * Delete (deactivate) user - usually logical delete
   */
  deleteUtilisateur(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // ADMIN OPERATIONS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get user audit log
   */
  getUserAuditLog(id: number): Observable<any[]> {
    return this.api.get<any[]>(`${this.endpoint}/${id}/audit-log`);
  }

  /**
   * Get user login history
   */
  getLoginHistory(id: number): Observable<any[]> {
    return this.api.get<any[]>(`${this.endpoint}/${id}/login-history`);
  }

  /**
   * Force logout user
   */
  forceLogout(id: number): Observable<void> {
    return this.api.post<void>(`${this.endpoint}/${id}/force-logout`, {});
  }

  /**
   * Lock user account
   */
  lockUser(id: number): Observable<Utilisateur> {
    return this.api.patch<Utilisateur>(`${this.endpoint}/${id}/lock`, {});
  }

  /**
   * Unlock user account
   */
  unlockUser(id: number): Observable<Utilisateur> {
    return this.api.patch<Utilisateur>(`${this.endpoint}/${id}/unlock`, {});
  }

  // ═══════════════════════════════════════════════════════════════
  // STATISTICS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get user statistics
   */
  getUtilisateurStats(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats`);
  }

  /**
   * Get users by role statistics
   */
  getStatsByRole(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats/by-role`);
  }

  /**
   * Get active vs inactive users count
   */
  getStatusStats(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats/status`);
  }
}
