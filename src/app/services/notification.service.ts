/**
 * Notification Service - Manages all notification API operations
 * Endpoints: /api/notifications
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Notification, ApiResponse, PageableResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly endpoint = '/notifications';

  constructor(private api: ApiService) {}

  // ═══════════════════════════════════════════════════════════════
  // GET - Retrieve Notifications
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get all notifications with pagination
   */
  getAllNotifications(
    page: number = 0,
    size: number = 20,
    filters?: any
  ): Observable<PageableResponse<Notification>> {
    let params = this.api.buildParams({
      page,
      size,
      ...filters
    });
    return this.api.get<PageableResponse<Notification>>(this.endpoint, params);
  }

  /**
   * Get notification by ID
   */
  getNotificationById(id: number): Observable<Notification> {
    return this.api.get<Notification>(`${this.endpoint}/${id}`);
  }

  /**
   * Get user notifications
   */
  getUserNotifications(userId: number, page: number = 0, size: number = 20): Observable<PageableResponse<Notification>> {
    const params = this.api.buildParams({ page, size });
    return this.api.get<PageableResponse<Notification>>(`${this.endpoint}/user/${userId}`, params);
  }

  /**
   * Get unread notifications for user
   */
  getUnreadNotifications(userId: number): Observable<Notification[]> {
    return this.api.get<Notification[]>(`${this.endpoint}/user/${userId}/unread`);
  }

  /**
   * Get read notifications for user
   */
  getReadNotifications(userId: number): Observable<Notification[]> {
    return this.api.get<Notification[]>(`${this.endpoint}/user/${userId}/read`);
  }

  /**
   * Get unread count for user
   */
  getUnreadCount(userId: number): Observable<number> {
    return this.api.get<number>(`${this.endpoint}/user/${userId}/unread-count`);
  }

  /**
   * Get notifications by type
   */
  getNotificationsByType(type: string): Observable<Notification[]> {
    const params = this.api.buildParams({ type });
    return this.api.get<Notification[]>(`${this.endpoint}/type`, params);
  }

  /**
   * Get notifications by priority
   */
  getNotificationsByPriority(priority: string): Observable<Notification[]> {
    const params = this.api.buildParams({ priority });
    return this.api.get<Notification[]>(`${this.endpoint}/priority`, params);
  }

  /**
   * Get recent notifications
   */
  getRecentNotifications(userId: number, limit: number = 10): Observable<Notification[]> {
    const params = this.api.buildParams({ limit });
    return this.api.get<Notification[]>(`${this.endpoint}/user/${userId}/recent`, params);
  }

  /**
   * Get notifications by date range
   */
  getNotificationsByDateRange(
    userId: number,
    startDate: string,
    endDate: string
  ): Observable<Notification[]> {
    const params = this.api.buildParams({ startDate, endDate });
    return this.api.get<Notification[]>(`${this.endpoint}/user/${userId}/date-range`, params);
  }

  // ═══════════════════════════════════════════════════════════════
  // POST - Create/Send Notification
  // ═══════════════════════════════════════════════════════════════

  /**
   * Send notification to user
   */
  sendNotification(notification: Partial<Notification>): Observable<Notification> {
    return this.api.post<Notification>(this.endpoint, notification);
  }

  /**
   * Send notification to multiple users
   */
  sendBulkNotification(userIds: number[], notification: any): Observable<any> {
    return this.api.post<any>(`${this.endpoint}/bulk`, {
      userIds,
      ...notification
    });
  }

  /**
   * Send notification to role group
   */
  sendToRole(role: string, notification: any): Observable<any> {
    return this.api.post<any>(`${this.endpoint}/role/${role}`, notification);
  }

  /**
   * Send appointment reminder
   */
  sendAppointmentReminder(appointmentId: number): Observable<Notification> {
    return this.api.post<Notification>(`${this.endpoint}/appointment-reminder/${appointmentId}`, {});
  }

  /**
   * Send donation reminder
   */
  sendDonationReminder(donneurId: number): Observable<Notification> {
    return this.api.post<Notification>(`${this.endpoint}/donation-reminder/${donneurId}`, {});
  }

  /**
   * Send order status update
   */
  sendOrderStatusUpdate(orderId: number, statut: string): Observable<Notification> {
    return this.api.post<Notification>(`${this.endpoint}/order-update/${orderId}`, { statut });
  }

  // ═══════════════════════════════════════════════════════════════
  // PUT - Update Notification
  // ═══════════════════════════════════════════════════════════════

  /**
   * Mark notification as read
   */
  markAsRead(id: number): Observable<Notification> {
    return this.api.patch<Notification>(`${this.endpoint}/${id}/read`, {});
  }

  /**
   * Mark multiple notifications as read
   */
  markMultipleAsRead(ids: number[]): Observable<any> {
    return this.api.patch<any>(`${this.endpoint}/mark-read`, { ids });
  }

  /**
   * Mark all notifications as read for user
   */
  markAllAsRead(userId: number): Observable<any> {
    return this.api.patch<any>(`${this.endpoint}/user/${userId}/mark-all-read`, {});
  }

  /**
   * Update notification
   */
  updateNotification(id: number, notification: Partial<Notification>): Observable<Notification> {
    return this.api.put<Notification>(`${this.endpoint}/${id}`, notification);
  }

  // ═══════════════════════════════════════════════════════════════
  // DELETE - Remove Notification
  // ═══════════════════════════════════════════════════════════════

  /**
   * Delete notification
   */
  deleteNotification(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Delete multiple notifications
   */
  deleteMultiple(ids: number[]): Observable<void> {
    return this.api.post<void>(`${this.endpoint}/delete-multiple`, { ids });
  }

  /**
   * Clear all notifications for user
   */
  clearAllNotifications(userId: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/user/${userId}/clear-all`);
  }

  /**
   * Clear read notifications for user
   */
  clearReadNotifications(userId: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/user/${userId}/clear-read`);
  }

  // ═══════════════════════════════════════════════════════════════
  // PREFERENCES
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get notification preferences for user
   */
  getPreferences(userId: number): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/user/${userId}/preferences`);
  }

  /**
   * Update notification preferences
   */
  updatePreferences(userId: number, preferences: any): Observable<any> {
    return this.api.put<any>(`${this.endpoint}/user/${userId}/preferences`, preferences);
  }

  /**
   * Enable notifications for user
   */
  enableNotifications(userId: number): Observable<any> {
    return this.api.patch<any>(`${this.endpoint}/user/${userId}/enable`, {});
  }

  /**
   * Disable notifications for user
   */
  disableNotifications(userId: number): Observable<any> {
    return this.api.patch<any>(`${this.endpoint}/user/${userId}/disable`, {});
  }

  /**
   * Set notification type preference
   */
  setTypePreference(userId: number, type: string, enabled: boolean): Observable<any> {
    return this.api.patch<any>(`${this.endpoint}/user/${userId}/type-preference`, {
      type,
      enabled
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // STATISTICS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get notification statistics
   */
  getNotificationStats(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats`);
  }

  /**
   * Get delivery statistics
   */
  getDeliveryStats(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats/delivery`);
  }

  /**
   * Get engagement statistics
   */
  getEngagementStats(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats/engagement`);
  }
}
