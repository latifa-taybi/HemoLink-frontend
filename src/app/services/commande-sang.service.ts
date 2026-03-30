/**
 * Commande Sang Service - Blood Order Management
 * Endpoints: /api/commandes-sang
 * Manages blood order lifecycle: PENDING → PREPARING → IN_DELIVERY → DELIVERED
 * Supports urgent/vital emergency orders
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import {
  CommandeSang,
  StatutCommande,
  GroupeSanguin,
  ElementCommande,
  PageableResponse
} from '../models';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommandeSangService {
  private readonly api = inject(ApiService);
  private readonly endpoint = '/commandes-sang';

  // ═══════════════════════════════════════════════════════════════
  // GET - Retrieve Orders
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get all blood orders with pagination
   */
  getAllCommandes(
    page: number = 0,
    size: number = 20,
    filters?: any
  ): Observable<PageableResponse<CommandeSang>> {
    let params = this.api.buildParams({
      page,
      size,
      ...filters
    });
    return this.api.get<PageableResponse<CommandeSang>>(this.endpoint, params);
  }

  /**
   * Get order by ID
   */
  getCommandeById(id: number): Observable<CommandeSang> {
    return this.api.get<CommandeSang>(`${this.endpoint}/${id}`);
  }

  /**
   * Get orders by hospital
   */
  getCommandesByHospital(hopitalId: number): Observable<CommandeSang[]> {
    return this.api.get<CommandeSang[]>(`${this.endpoint}/hospital/${hopitalId}`);
  }

  /**
   * Get orders by status
   */
  getCommandesByStatus(statut: StatutCommande): Observable<CommandeSang[]> {
    return this.api.get<CommandeSang[]>(`${this.endpoint}/status/${statut}`);
  }

  /**
   * Get pending orders
   */
  getPendingCommandes(): Observable<CommandeSang[]> {
    return this.api.get<CommandeSang[]>(`${this.endpoint}/status/${StatutCommande.PENDING}`);
  }

  /**
   * Get orders ready for preparation
   */
  getPreparingCommandes(): Observable<CommandeSang[]> {
    return this.api.get<CommandeSang[]>(`${this.endpoint}/status/${StatutCommande.PREPARING}`);
  }

  /**
   * Get shipped orders
   */
  getShippedCommandes(): Observable<CommandeSang[]> {
    return this.api.get<CommandeSang[]>(`${this.endpoint}/status/${StatutCommande.SHIPPED}`);
  }

  /**
   * Get delivered orders
   */
  getDeliveredCommandes(): Observable<CommandeSang[]> {
    return this.api.get<CommandeSang[]>(`${this.endpoint}/status/${StatutCommande.DELIVERED}`);
  }

  /**
   * Get order details with items
   */
  getCommandeDetails(id: number): Observable<CommandeSang> {
    return this.api.get<CommandeSang>(`${this.endpoint}/${id}/details`);
  }

  /**
   * Check order status
   */
  getCommandeStatus(id: number): Observable<{ statut: StatutCommande; updated: string }> {
    return this.api.get(`${this.endpoint}/${id}/status`);
  }

  // ═══════════════════════════════════════════════════════════════
  // POST - Create Order
  // ═══════════════════════════════════════════════════════════════

  /**
   * Create new blood order
   */
  createCommande(commande: Partial<CommandeSang>): Observable<CommandeSang> {
    return this.api.post<CommandeSang>(this.endpoint, commande);
  }

  // ═══════════════════════════════════════════════════════════════
  // PUT - Update Order
  // ═══════════════════════════════════════════════════════════════

  /**
   * Update order information
   */
  updateCommande(id: number, commande: Partial<CommandeSang>): Observable<CommandeSang> {
    return this.api.put<CommandeSang>(`${this.endpoint}/${id}`, commande);
  }

  /**
   * Update order status
   */
  updateCommandeStatus(id: number, statut: StatutCommande): Observable<CommandeSang> {
    return this.api.patch<CommandeSang>(`${this.endpoint}/${id}/status`, { statut });
  }

  /**
   * Transition from PENDING to PREPARING
   */
  startPreparation(id: number): Observable<CommandeSang> {
    return this.updateCommandeStatus(id, StatutCommande.PREPARING);
  }

  /**
   * Transition from PREPARING to SHIPPED
   */
  shipCommande(id: number): Observable<CommandeSang> {
    return this.updateCommandeStatus(id, StatutCommande.SHIPPED);
  }

  /**
   * Transition from SHIPPED to DELIVERED
   */
  deliverCommande(id: number): Observable<CommandeSang> {
    return this.updateCommandeStatus(id, StatutCommande.DELIVERED);
  }

  /**
   * Add item to order
   */
  addItemToCommande(
    commandeId: number,
    pocheSangId: number,
    quantite: number
  ): Observable<CommandeSang> {
    return this.api.post<CommandeSang>(`${this.endpoint}/${commandeId}/items`, {
      pocheSangId,
      quantite
    });
  }

  /**
   * Remove item from order
   */
  removeItemFromCommande(commandeId: number, itemId: number): Observable<CommandeSang> {
    return this.api.delete<CommandeSang>(`${this.endpoint}/${commandeId}/items/${itemId}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // DELETE - Cancel Order
  // ═══════════════════════════════════════════════════════════════

  /**
   * Cancel (delete) order - usually only for pending orders
   */
  cancelCommande(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // STATISTICS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get order statistics
   */
  getCommandeStats(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats`);
  }

  /**
   * Get orders by date range
   */
  getCommandesByDateRange(startDate: string, endDate: string): Observable<CommandeSang[]> {
    const params = this.api.buildParams({ startDate, endDate });
    return this.api.get<CommandeSang[]>(`${this.endpoint}/date-range`, params);
  }
}
