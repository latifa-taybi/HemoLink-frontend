/**
 * Base API Service - All HTTP calls go through here
 * Handles common configuration, error handling, authorization
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiBaseUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // ═══════════════════════════════════════════════════════════════
  // GET
  // ═══════════════════════════════════════════════════════════════

  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(
      `${this.apiBaseUrl}${endpoint}`,
      { params }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // POST
  // ═══════════════════════════════════════════════════════════════

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(
      `${this.apiBaseUrl}${endpoint}`,
      body
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // PUT
  // ═══════════════════════════════════════════════════════════════

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(
      `${this.apiBaseUrl}${endpoint}`,
      body
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // PATCH
  // ═══════════════════════════════════════════════════════════════

  patch<T>(endpoint: string, body: any): Observable<T> {
    return this.http.patch<T>(
      `${this.apiBaseUrl}${endpoint}`,
      body
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // DELETE
  // ═══════════════════════════════════════════════════════════════

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(
      `${this.apiBaseUrl}${endpoint}`
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ERROR HANDLING
  // ═══════════════════════════════════════════════════════════════

  private handleError(error: any) {
    console.error('API Error:', error);

    // Handle 401 - Unauthorized
    if (error.status === 401) {
      this.authService.logout();
      return throwError(() => new Error('Session expired. Please login again.'));
    }

    // Handle 403 - Forbidden
    if (error.status === 403) {
      return throwError(() => new Error('You do not have permission to access this resource.'));
    }

    // Handle 404 - Not Found
    if (error.status === 404) {
      return throwError(() => new Error('Resource not found.'));
    }

    // Handle 500+ - Server errors
    if (error.status >= 500) {
      return throwError(() => new Error('Server error. Please try again later.'));
    }

    // Generic error
    return throwError(() => new Error(error.error?.message || 'An error occurred'));
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILITY - Building params
  // ═══════════════════════════════════════════════════════════════

  buildParams(filters?: any): HttpParams {
    let params = new HttpParams();
    if (filters) {
      for (const key in filters) {
        if (filters[key] != null) {
          params = params.set(key, filters[key]);
        }
      }
    }
    return params;
  }
}
