/**
 * Statistiques Service - Blood Stock Analytics & Reporting
 * Endpoints: /api/statistiques-stock
 * Comprehensive analytics: stock levels, waste, donation trends, performance metrics
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import {
  StatistiquesStock,
  StatistiquesStockResponseDto,
  StatistiquesGaspillage,
  StatistiquesDons,
  GroupeSanguin
} from '../models';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatistiquesService {
  private readonly api = inject(ApiService);
  private readonly endpoint = '/statistiques-stock';

  // ═══════════════════════════════════════════════════════════════
  // BLOOD STOCK STATISTICS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get current blood stock overview (all blood groups)
   */
  getStockOverview(): Observable<StatistiquesStockResponseDto[]> {
    return this.api.get<StatistiquesStockResponseDto[]>(`${this.endpoint}`);
  }

  /**
   * Get stock for specific blood group
   */
  getStockByBloodGroup(groupeSanguin: GroupeSanguin): Observable<StatistiquesStock> {
    return this.api.get<StatistiquesStock>(
      `${this.endpoint}/blood-group/${groupeSanguin}`
    );
  }

  /**
   * Get available stock (ready for transfusion)
   */
  getAvailableStock(): Observable<StatistiquesStock[]> {
    return this.api.get<StatistiquesStock[]>(`${this.endpoint}/available`);
  }

  /**
   * Get reserved stock (allocated to orders)
   */
  getReservedStock(): Observable<StatistiquesStock[]> {
    return this.api.get<StatistiquesStock[]>(`${this.endpoint}/reserved`);
  }

  /**
   * Get expired/discarded stock
   */
  getExpiredStock(): Observable<StatistiquesStock[]> {
    return this.api.get<StatistiquesStock[]>(`${this.endpoint}/expired`);
  }

  /**
   * Get stock in quarantine (awaiting lab tests)
   */
  getQuarantineStock(): Observable<StatistiquesStock[]> {
    return this.api.get<StatistiquesStock[]>(`${this.endpoint}/quarantine`);
  }

  /**
   * Get stock near expiration (within 7 days)
   */
  getNearExpirationStock(daysThreshold: number = 7): Observable<StatistiquesStock[]> {
    let params = this.api.buildParams({ daysThreshold });
    return this.api.get<StatistiquesStock[]>(
      `${this.endpoint}/near-expiration`,
      params
    );
  }

  /**
   * Get stock level alerts (low stock warnings)
   */
  getStockAlerts(): Observable<any[]> {
    return this.api.get<any[]>(`${this.endpoint}/alerts`);
  }

  /**
   * Get stock snapshot at specific date/time
   */
  getStockSnapshot(date: Date): Observable<StatistiquesStock[]> {
    const dateStr = this.formatDate(date);
    return this.api.get<StatistiquesStock[]>(
      `${this.endpoint}/snapshot/${dateStr}`
    );
  }

  /**
   * Get stock history for date range
   */
  getStockHistory(startDate: Date, endDate: Date): Observable<any[]> {
    let params = this.api.buildParams({
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(endDate)
    });
    return this.api.get<any[]>(`${this.endpoint}/history`, params);
  }

  /**
   * Get stock trend analysis (stock levels over time)
   */
  getStockTrend(days: number = 30): Observable<any> {
    let params = this.api.buildParams({ days });
    return this.api.get<any>(`${this.endpoint}/trend`, params);
  }

  /**
   * Get critical stock level report
   */
  getCriticalStockReport(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/critical-levels`);
  }

  /**
   * Get sufficient stock report (adequate stock available)
   */
  getSufficientStockReport(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/sufficient-levels`);
  }

  // ═══════════════════════════════════════════════════════════════
  // WASTE & DISCARD STATISTICS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get blood waste statistics (expired + discarded)
   */
  getWasteStats(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/waste`);
  }

  /**
   * Get waste statistics for date range
   */
  getWasteStatsByDateRange(startDate: Date, endDate: Date): Observable<StatistiquesGaspillage> {
    let params = this.api.buildParams({
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(endDate)
    });
    return this.api.get<StatistiquesGaspillage>(
      `${this.endpoint}/waste/date-range`,
      params
    );
  }

  /**
   * Get waste by cause (expired, failed tests, damaged, etc)
   */
  getWasteByCause(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/waste/by-cause`);
  }

  /**
   * Get waste by blood group
   */
  getWasteByBloodGroup(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/waste/by-blood-group`);
  }

  /**
   * Get waste trend (monthly comparison)
   */
  getWasteTrend(months: number = 12): Observable<any> {
    let params = this.api.buildParams({ months });
    return this.api.get<any>(`${this.endpoint}/waste/trend`, params);
  }

  /**
   * Get waste percentage vs collected blood
   */
  getWastePercentage(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/waste/percentage`);
  }

  /**
   * Get high waste alert (when waste % exceeds threshold)
   */
  getHighWasteAlerts(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/waste/alerts`);
  }

  // ═══════════════════════════════════════════════════════════════
  // DONATION STATISTICS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get comprehensive donation statistics
   */
  getDonationStats(): Observable<StatistiquesDons> {
    return this.api.get<StatistiquesDons>(`${this.endpoint}/donations`);
  }

  /**
   * Get donations by blood group
   */
  getDonationsByBloodGroup(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/donations/by-blood-group`);
  }

  /**
   * Get donations by collection center
   */
  getDonationsByCenter(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/donations/by-center`);
  }

  /**
   * Get donations trend (monthly)
   */
  getDonationTrend(months: number = 12): Observable<any> {
    let params = this.api.buildParams({ months });
    return this.api.get<any>(`${this.endpoint}/donations/trend`, params);
  }

  /**
   * Get total collected volume (ML)
   */
  getTotalVolume(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/donations/total-volume`);
  }

  /**
   * Get average donation volume
   */
  getAverageVolume(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/donations/average-volume`);
  }

  /**
   * Get active donors count
   */
  getActiveDonorCount(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/donations/active-donors`);
  }

  /**
   * Get repeat donor rate (donors with 2+ donations)
   */
  getRepeatDonorRate(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/donations/repeat-donor-rate`);
  }

  /**
   * Get monthly donation volume report
   */
  getMonthlyDonationVolume(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/donations/monthly-volume`);
  }

  /**
   * Get daily donation breakdown
   */
  getDailyDonationBreakdown(date: Date): Observable<any> {
    const dateStr = this.formatDate(date);
    return this.api.get<any>(
      `${this.endpoint}/donations/daily/${dateStr}`
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ORDER & FULFILLMENT STATISTICS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get order fulfillment statistics
   */
  getOrderFulfillmentStats(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/orders/fulfillment`);
  }

  /**
   * Get urgent orders fulfillment rate
   */
  getUrgentOrdersRate(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/orders/urgent-rate`);
  }

  /**
   * Get average order fulfillment time
   */
  getAverageFulfillmentTime(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/orders/avg-fulfillment-time`);
  }

  /**
   * Get orders by hospital
   */
  getOrdersByHospital(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/orders/by-hospital`);
  }

  /**
   * Get order fulfillment trend
   */
  getOrderTrend(months: number = 12): Observable<any> {
    let params = this.api.buildParams({ months });
    return this.api.get<any>(`${this.endpoint}/orders/trend`, params);
  }

  /**
   * Get unfulfilled orders alert
   */
  getUnfulfilledOrdersAlert(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/orders/unfulfilled-alert`);
  }

  // ═══════════════════════════════════════════════════════════════
  // LAB TEST STATISTICS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get lab test statistics
   */
  getLabTestStats(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/lab-tests`);
  }

  /**
   * Get disease prevalence from test results
   */
  getDiseasePrevalence(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/lab-tests/disease-prevalence`);
  }

  /**
   * Get test pass/fail rate
   */
  getTestPassFailRate(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/lab-tests/pass-fail-rate`);
  }

  /**
   * Get avg turnaround time for lab tests
   */
  getLabTurnaroundTime(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/lab-tests/turnaround-time`);
  }

  /**
   * Get positive tests by disease
   */
  getPositiveTestsByDisease(): Observable<any> {
    return this.api.get<any>(
      `${this.endpoint}/lab-tests/positive-by-disease`
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // COMPREHENSIVE DASHBOARDS & REPORTS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get executive dashboard data (all key metrics)
   */
  getExecutiveDashboard(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/dashboard/executive`);
  }

  /**
   * Get operational dashboard (daily operations)
   */
  getOperationalDashboard(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/dashboard/operational`);
  }

  /**
   * Get stock manager dashboard
   */
  getStockManagerDashboard(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/dashboard/stock-manager`);
  }

  /**
   * Get hospital consumption dashboard
   */
  getHospitalDashboard(hopitalId?: number): Observable<any> {
    if (hopitalId) {
      return this.api.get<any>(
        `${this.endpoint}/dashboard/hospital/${hopitalId}`
      );
    }
    return this.api.get<any>(`${this.endpoint}/dashboard/hospital`);
  }

  /**
   * Get comprehensive monthly report
   */
  getMonthlyReport(year: number, month: number): Observable<any> {
    let params = this.api.buildParams({ year, month });
    return this.api.get<any>(`${this.endpoint}/reports/monthly`, params);
  }

  /**
   * Get quarterly report
   */
  getQuarterlyReport(year: number, quarter: number): Observable<any> {
    let params = this.api.buildParams({ year, quarter });
    return this.api.get<any>(`${this.endpoint}/reports/quarterly`, params);
  }

  /**
   * Get annual report
   */
  getAnnualReport(year: number): Observable<any> {
    let params = this.api.buildParams({ year });
    return this.api.get<any>(`${this.endpoint}/reports/annual`, params);
  }

  /**
   * Get custom date range report
   */
  getCustomReport(startDate: Date, endDate: Date): Observable<any> {
    let params = this.api.buildParams({
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(endDate)
    });
    return this.api.get<any>(`${this.endpoint}/reports/custom`, params);
  }

  /**
   * Export report as PDF
   */
  exportReportPDF(startDate: Date, endDate: Date): Observable<Blob> {
    let params = this.api.buildParams({
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(endDate)
    });
    return this.api.get<Blob>(`${this.endpoint}/reports/export/pdf`, params);
  }

  /**
   * Export report as Excel/CSV
   */
  exportReportExcel(startDate: Date, endDate: Date): Observable<Blob> {
    let params = this.api.buildParams({
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(endDate)
    });
    return this.api.get<Blob>(`${this.endpoint}/reports/export/excel`, params);
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
