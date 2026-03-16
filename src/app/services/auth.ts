import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

// Roles disponibles
export enum RoleUtilisateur {
  DONNEUR = 'DONNEUR',
  TECHNICIEN_LABO = 'TECHNICIEN_LABO',
  PERSONNEL_HOPITAL = 'PERSONNEL_HOPITAL',
  ADMIN = 'ADMIN'
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
}

export interface UtilisateurDto {
  prenom: string;
  nom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
  role: RoleUtilisateur;
  actif?: boolean;
}

export interface InscriptionDto {
  prenom: string;
  nom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface AuthResponse {
  token: string;
  utilisateur: UtilisateurResponseDto;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly apiUrl = 'http://localhost:8082/api';
  
  private userSubject = new BehaviorSubject<UtilisateurResponseDto | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  
  public user$ = this.userSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeFromStorage();
  }

  /**
   * Login avec JWT
   * POST /api/auth/login
   */
  login(email: string, motDePasse: string): Observable<AuthResponse> {
    const loginRequest: LoginRequest = { email, motDePasse };

    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, loginRequest)
      .pipe(
        tap((response) => {
          // Stocker le token et l'utilisateur
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.utilisateur));
          this.tokenSubject.next(response.token);
          this.userSubject.next(response.utilisateur);
        })
      );
  }

  /**
   * Register: POST /api/auth/inscription
   * Crée un nouvel utilisateur DONNEUR avec rôle et statut actif forcés
   */
  register(
    prenom: string,
    nom: string,
    email: string,
    motDePasse: string,
    telephone?: string
  ): Observable<UtilisateurResponseDto> {
    const inscriptionDto: InscriptionDto = {
      prenom,
      nom,
      email,
      motDePasse,
      telephone
    };

    return this.http
      .post<UtilisateurResponseDto>(`${this.apiUrl}/auth/inscription`, inscriptionDto)
      .pipe(
        tap((user) => {
          // Après l'enregistrement, stocker l'utilisateur
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.tokenSubject.next(null);
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUser(): UtilisateurResponseDto | null {
    return this.userSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token') || this.tokenSubject.value;
  }

  private initializeFromStorage(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        this.tokenSubject.next(token);
        this.userSubject.next(JSON.parse(userStr));
      } catch (error) {
        this.logout();
      }
    }
  }
}
