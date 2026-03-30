/**
 * Utilisateur Service - User/Employee Management
 * Endpoints: /api/utilisateurs
 * Role-based access control: ADMIN, DONNEUR, HOPITAL, PERSONNEL_CENTRE, LABO_PERSONNEL
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import {
  Utilisateur,
  UtilisateurDto,
  RoleUtilisateur,
  PageableResponse,
  ApiResponse
} from '../models';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private readonly api = inject(ApiService);
  private readonly endpoint = '/utilisateurs';

  // ═══════════════════════════════════════════════════════════════
  // GET - Retrieve Users
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get all users with pagination
   * @param page - Page number (0-indexed)
   * @param size - Number of records per page
   * @param filters - Optional filters (role, actif, etc)
   */
  getAllUtilisateurs(
    page: number = 0,
    size: number = 20,
    filters?: any
  ): Observable<PageableResponse<Utilisateur>> {
    let params = this.api.buildParams({ page, size, ...filters });
    return this.api.get<PageableResponse<Utilisateur>>(this.endpoint, params);
  }

  /**
   * Get current user profile
   */
  getCurrentUser(): Observable<Utilisateur> {
    return this.api.get<Utilisateur>(`${this.endpoint}/me`);
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
    let params = this.api.buildParams({ nom });
    return this.api.get<Utilisateur[]>(`${this.endpoint}/search`, params);
  }

  /**
   * Get users by role
   */
  getUtilisateursByRole(role: RoleUtilisateur): Observable<Utilisateur[]> {
    return this.api.get<Utilisateur[]>(`${this.endpoint}/role/${role}`);
  }

  /**
   * Get active users only
   */
  getActiveUtilisateurs(): Observable<Utilisateur[]> {
    let params = this.api.buildParams({ actif: true });
    return this.api.get<Utilisateur[]>(this.endpoint, params);
  }

  /**
   * Get user login history
   */
  getUserLoginHistory(userId: number): Observable<any[]> {
    return this.api.get<any[]>(`${this.endpoint}/${userId}/login-history`);
  }

  /**
   * Get user audit logs
   */
  getUserAuditLogs(userId: number): Observable<any[]> {
    return this.api.get<any[]>(`${this.endpoint}/${userId}/audit-logs`);
  }

  // ═══════════════════════════════════════════════════════════════
  // POST - Create User
  // ═══════════════════════════════════════════════════════════════

  /**
   * Create new user
   */
  createUtilisateur(user: UtilisateurDto): Observable<Utilisateur> {
    return this.api.post<Utilisateur>(this.endpoint, user);
  }

  /**
   * Create user with role assignment
   */
  createUtilisateurWithRole(user: UtilisateurDto, role: RoleUtilisateur): Observable<Utilisateur> {
    return this.api.post<Utilisateur>(`${this.endpoint}?role=${role}`, user);
  }

  // ═══════════════════════════════════════════════════════════════
  // PUT/PATCH - Update User
  // ═══════════════════════════════════════════════════════════════

  /**
   * Update user information
   */
  updateUtilisateur(id: number, user: Partial<UtilisateurDto>): Observable<Utilisateur> {
    return this.api.put<Utilisateur>(`${this.endpoint}/${id}`, user);
  }

  /**
   * Update user role
   */
  updateUtilisateurRole(id: number, role: RoleUtilisateur): Observable<Utilisateur> {
    return this.api.patch<Utilisateur>(
      `${this.endpoint}/${id}/role`,
      { role }
    );
  }

  /**
   * Update user password
   */
  updatePassword(userId: number, oldPassword: string, newPassword: string): Observable<ApiResponse<any>> {
    return this.api.patch<ApiResponse<any>>(
      `${this.endpoint}/${userId}/password`,
      { oldPassword, newPassword }
    );
  }

  /**
   * Reset user password (admin action)
   */
  resetPassword(userId: number): Observable<ApiResponse<any>> {
    return this.api.post<ApiResponse<any>>(
      `${this.endpoint}/${userId}/reset-password`,
      {}
    );
  }

  /**
   * Enable 2FA for user
   */
  enable2FA(userId: number): Observable<ApiResponse<any>> {
    return this.api.post<ApiResponse<any>>(
      `${this.endpoint}/${userId}/2fa/enable`,
      {}
    );
  }

  /**
   * Disable 2FA for user
   */
  disable2FA(userId: number): Observable<ApiResponse<any>> {
    return this.api.post<ApiResponse<any>>(
      `${this.endpoint}/${userId}/2fa/disable`,
      {}
    );
  }

  /**
   * Activate user account
   */
  activateUser(userId: number): Observable<Utilisateur> {
    return this.api.patch<Utilisateur>(
      `${this.endpoint}/${userId}/activate`,
      {}
    );
  }

  /**
   * Deactivate user account
   */
  deactivateUser(userId: number): Observable<Utilisateur> {
    return this.api.patch<Utilisateur>(
      `${this.endpoint}/${userId}/deactivate`,
      {}
    );
  }

  /**
   * Lock user account
   */
  lockUserAccount(userId: number): Observable<ApiResponse<any>> {
    return this.api.post<ApiResponse<any>>(
      `${this.endpoint}/${userId}/lock`,
      {}
    );
  }

  /**
   * Force logout user
   */
  forceLogout(userId: number): Observable<ApiResponse<any>> {
    return this.api.post<ApiResponse<any>>(
      `${this.endpoint}/${userId}/force-logout`,
      {}
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // DELETE - Remove User
  // ═══════════════════════════════════════════════════════════════

  /**
   * Delete user
   */
  deleteUtilisateur(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // STATISTICS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get users statistics by role
   */
  getStatsByRole(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats/by-role`);
  }

  /**
   * Get users statistics
   */
  getUsersStats(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats`);
  }

  /**
   * Get users activity report
   */
  getActivityReport(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/reports/activity`);
  }
}
