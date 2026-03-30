/**
 * Test Labo Service - Manages all laboratory test API operations
 * Endpoints: /api/test-labo
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { TestLabo, ApiResponse, PageableResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TestLaboService {
  private readonly endpoint = '/test-labo';

  constructor(private api: ApiService) {}

  // ═══════════════════════════════════════════════════════════════
  // GET - Retrieve Lab Tests
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get all lab tests with pagination
   */
  getAllTests(
    page: number = 0,
    size: number = 20,
    filters?: any
  ): Observable<PageableResponse<TestLabo>> {
    let params = this.api.buildParams({
      page,
      size,
      ...filters
    });
    return this.api.get<PageableResponse<TestLabo>>(this.endpoint, params);
  }

  /**
   * Get lab test by ID
   */
  getTestById(id: number): Observable<TestLabo> {
    return this.api.get<TestLabo>(`${this.endpoint}/${id}`);
  }

  /**
   * Get tests for a blood bag
   */
  getTestsForPoche(pocheId: number): Observable<TestLabo[]> {
    return this.api.get<TestLabo[]>(`${this.endpoint}/poche/${pocheId}`);
  }

  /**
   * Get tests for a donation
   */
  getTestsForDon(donId: number): Observable<TestLabo[]> {
    return this.api.get<TestLabo[]>(`${this.endpoint}/donation/${donId}`);
  }

  /**
   * Get pending tests (not yet completed)
   */
  getPendingTests(): Observable<TestLabo[]> {
    return this.api.get<TestLabo[]>(`${this.endpoint}/pending`);
  }

  /**
   * Get completed tests
   */
  getCompletedTests(): Observable<TestLabo[]> {
    return this.api.get<TestLabo[]>(`${this.endpoint}/completed`);
  }

  /**
   * Get failed/positive tests
   */
  getFailedTests(): Observable<TestLabo[]> {
    return this.api.get<TestLabo[]>(`${this.endpoint}/failed`);
  }

  /**
   * Get tests by test type (e.g., ABO, Rh, AIDS, Hepatitis)
   */
  getTestsByType(typeTest: string): Observable<TestLabo[]> {
    const params = this.api.buildParams({ typeTest });
    return this.api.get<TestLabo[]>(`${this.endpoint}/type`, params);
  }

  /**
   * Get tests by date
   */
  getTestsByDate(date: string): Observable<TestLabo[]> {
    const params = this.api.buildParams({ date });
    return this.api.get<TestLabo[]>(`${this.endpoint}/date`, params);
  }

  /**
   * Get tests by date range
   */
  getTestsByDateRange(startDate: string, endDate: string): Observable<TestLabo[]> {
    const params = this.api.buildParams({ startDate, endDate });
    return this.api.get<TestLabo[]>(`${this.endpoint}/date-range`, params);
  }

  /**
   * Get tests for specific laboratory
   */
  getLabTests(labId: number): Observable<TestLabo[]> {
    return this.api.get<TestLabo[]>(`${this.endpoint}/lab/${labId}`);
  }

  /**
   * Get critical/urgent tests
   */
  getUrgentTests(): Observable<TestLabo[]> {
    return this.api.get<TestLabo[]>(`${this.endpoint}/urgent`);
  }

  /**
   * Get test results summary
   */
  getTestResultsSummary(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/results-summary`);
  }

  // ═══════════════════════════════════════════════════════════════
  // POST - Create Lab Test
  // ═══════════════════════════════════════════════════════════════

  /**
   * Create new lab test
   */
  createTest(test: Partial<TestLabo>): Observable<TestLabo> {
    return this.api.post<TestLabo>(this.endpoint, test);
  }

  /**
   * Create test for blood bag
   */
  createTestForPoche(
    pocheId: number,
    typeTest: string,
    priorite: string = 'NORMAL'
  ): Observable<TestLabo> {
    return this.api.post<TestLabo>(`${this.endpoint}/poche/${pocheId}`, {
      typeTest,
      priorite
    });
  }

  /**
   * Create multiple tests for blood bag (full screening)
   */
  createFullScreening(pocheId: number): Observable<TestLabo[]> {
    return this.api.post<TestLabo[]>(`${this.endpoint}/poche/${pocheId}/full-screening`, {});
  }

  // ═══════════════════════════════════════════════════════════════
  // PUT - Update Lab Test
  // ═══════════════════════════════════════════════════════════════

  /**
   * Update lab test
   */
  updateTest(id: number, test: Partial<TestLabo>): Observable<TestLabo> {
    return this.api.put<TestLabo>(`${this.endpoint}/${id}`, test);
  }

  /**
   * Record test result
   */
  recordTestResult(
    id: number,
    resultat: string,
    valeur?: string,
    observations?: string
  ): Observable<TestLabo> {
    return this.api.patch<TestLabo>(`${this.endpoint}/${id}/result`, {
      resultat,
      valeur,
      observations,
      dateResultat: new Date().toISOString()
    });
  }

  /**
   * Mark test as passed
   */
  passTest(id: number, observations?: string): Observable<TestLabo> {
    return this.recordTestResult(id, 'PASSED', undefined, observations);
  }

  /**
   * Mark test as failed
   */
  failTest(id: number, valeur: string, observations?: string): Observable<TestLabo> {
    return this.recordTestResult(id, 'FAILED', valeur, observations);
  }

  /**
   * Mark test as inconclusive
   */
  inconclusiveTest(id: number, observations?: string): Observable<TestLabo> {
    return this.recordTestResult(id, 'INCONCLUSIVE', undefined, observations);
  }

  /**
   * Add comment/note to test
   */
  addTestNote(id: number, note: string): Observable<TestLabo> {
    return this.api.patch<TestLabo>(`${this.endpoint}/${id}/note`, { note });
  }

  /**
   * Set test priority
   */
  setTestPriority(id: number, priorite: string): Observable<TestLabo> {
    return this.api.patch<TestLabo>(`${this.endpoint}/${id}/priority`, { priorite });
  }

  // ═══════════════════════════════════════════════════════════════
  // DELETE - Remove Test
  // ═══════════════════════════════════════════════════════════════

  /**
   * Delete lab test
   */
  deleteTest(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // STATISTICS & REPORTS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get laboratory statistics
   */
  getLabStats(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/stats`);
  }

  /**
   * Get lab performance metrics
   */
  getLabPerformance(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/performance`);
  }

  /**
   * Get test success rate
   */
  getSuccessRate(): Observable<number> {
    return this.api.get<number>(`${this.endpoint}/success-rate`);
  }

  /**
   * Get test turnaround time
   */
  getTurnaroundTime(): Observable<number> {
    return this.api.get<number>(`${this.endpoint}/turnaround-time`);
  }

  /**
   * Get test results by type
   */
  getResultsByType(): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/results-by-type`);
  }

  /**
   * Get quality control report
   */
  getQualityControlReport(startDate: string, endDate: string): Observable<any> {
    const params = this.api.buildParams({ startDate, endDate });
    return this.api.get<any>(`${this.endpoint}/qc-report`, params);
  }
}
