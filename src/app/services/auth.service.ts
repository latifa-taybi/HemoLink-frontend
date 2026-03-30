import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, of, throwError } from 'rxjs';

// Enum matching backend roles exactly
export enum RoleUtilisateur {
  ADMIN = 'ADMIN',
  DONNEUR = 'DONNEUR',
  HOPITAL = 'HOPITAL',
  PERSONNEL_CENTRE = 'PERSONNEL_CENTRE',
  LABO_PERSONNEL = 'LABO_PERSONNEL',
}

// Blood type enumeration
export enum GroupeSanguin {
  O_PLUS = 'O_PLUS',
  O_MINUS = 'O_MINUS',
  A_PLUS = 'A_PLUS',
  A_MINUS = 'A_MINUS',
  B_PLUS = 'B_PLUS',
  B_MINUS = 'B_MINUS',
  AB_PLUS = 'AB_PLUS',
  AB_MINUS = 'AB_MINUS'
}

// Order statuses
export enum StatutCommande {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED'
}

// Appointment statuses
export enum StatutRendezVous {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// Blood bag statuses
export enum StatutSang {
  AVAILABLE = 'AVAILABLE',
  QUARANTINE = 'QUARANTINE',
  USED = 'USED',
  EXPIRED = 'EXPIRED'
}

export interface UtilisateurResponseDto {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  role: RoleUtilisateur;
  actif: boolean;
  creeLe: string;
  centreCollecteId?: number;
  hopitalId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8082/api';
  private userSubject = new BehaviorSubject<UtilisateurResponseDto | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeFromStorage();
  }

  login(email: string, motDePasse: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, motDePasse }).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('tokenType', response.tokenType || 'Bearer');
          // Try to decode from response first, fallback to token
          let user = response.user || this.decodeToken(response.token);
          if (user) {
            this.userSubject.next(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
        }
      })
    );
  }

  register(prenom: string, nom: string, email: string, motDePasse: string, telephone?: string): Observable<UtilisateurResponseDto> {
    return this.http.post<UtilisateurResponseDto>(`${this.apiUrl}/auth/inscription`, { prenom, nom, email, motDePasse, telephone });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('currentUser');
    this.userSubject.next(null);
    window.location.href = '/auth/login';
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): UtilisateurResponseDto | null {
    return this.userSubject.value;
  }

  // Fetch complete user info from backend, with fallback to decoded JWT
  fetchUserData(): Observable<UtilisateurResponseDto> {
    return this.http.get<UtilisateurResponseDto>(`${this.apiUrl}/utilisateurs/me`).pipe(
      tap(user => {
        this.userSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      }),
      catchError((err: any) => {
        console.warn(`Endpoint /utilisateurs/me échoué (${err.status}), tentative JWT decode...`);
        
        const decodedUser = this.decodeToken(this.getToken() || '');
        if (decodedUser) {
          console.warn('✓ JWT decode réussi, utilisation du profil du JWT');
          this.userSubject.next(decodedUser);
          localStorage.setItem('currentUser', JSON.stringify(decodedUser));
          return of(decodedUser);
        }
        
        console.error('✗ JWT decode échoué - Impossible de récupérer l\'utilisateur');
        return throwError(() => new Error('Impossible de récupérer les données utilisateur'));
      })
    );
  }

  private initializeFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) this.userSubject.next(JSON.parse(userStr));
  }

  private decodeToken(token: string): UtilisateurResponseDto | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid JWT format - expected 3 parts, got', parts.length);
        return null;
      }
      
      const payload = JSON.parse(atob(parts[1]));
      console.log('JWT Payload:', payload);
      
      // Try multiple ways to extract ID - be VERY flexible
      let id = payload.userId 
        || payload.id 
        || payload.uid
        || payload.sub?.split('-')[0]
        || payload.user_id;
      
      // Try to parse as number
      let userId: number | null = id ? Number(id) : null;
      
      // If we still don't have a valid numeric ID, try fallbacks
      if (!userId || isNaN(userId) || userId <= 0) {
        // Last resort: use hash of email as ID
        if (payload.email || payload.sub) {
          const identifier = payload.email || payload.sub;
          // Create a simple hash of the identifier
          const hash = identifier.split('').reduce((acc: number, char: string) => {
            return ((acc << 5) - acc) + char.charCodeAt(0);
          }, 0);
          userId = Math.abs(hash) || 1;
          console.warn(`No numeric ID found in JWT. Using hash of ${identifier} as fallback ID: ${userId}`);
        } else {
          console.error('Invalid user ID extracted:', id, '-> NaN. No email/sub fallback available');
          return null;
        }
      }
      
      // Ensure userId is valid at this point
      if (!userId || userId <= 0) {
        console.error('Failed to extract valid user ID from JWT');
        return null;
      }
      
      // Extract other user info from JWT payload with fallbacks
      return {
        id: userId as number,
        prenom: payload.prenom || payload.firstName || payload.given_name || 'Utilisateur',
        nom: payload.nom || payload.lastName || payload.family_name || '',
        email: payload.email || payload.sub || '',
        telephone: payload.telephone || payload.phone || undefined,
        role: (payload.role || payload.roles?.[0] || 'DONNEUR') as RoleUtilisateur,
        actif: payload.actif !== false,
        creeLe: payload.creeLe || payload.iat ? new Date(payload.iat * 1000).toISOString() : new Date().toISOString()
      };
    } catch (e) {
      console.error('JWT decode failed:', e);
      return null;
    }
  }
}
