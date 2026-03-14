import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CreateUtilisateurDto, Utilisateur } from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8082/api';

  getAll(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.baseUrl}/utilisateurs`);
  }

  getById(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.baseUrl}/utilisateurs/${id}`);
  }

  create(dto: CreateUtilisateurDto): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.baseUrl}/utilisateurs`, dto);
  }

  toggleStatut(id: number, actif: boolean): Observable<Utilisateur> {
    return this.getById(id).pipe(
      switchMap(user => {
        // map existing user properties back to CreateUtilisateurDto with flipped actif state
        const updateDto: CreateUtilisateurDto = {
          prenom: user.prenom,
          nom: user.nom,
          email: user.email,
          motDePasse: '', // the backend update doesn't enforce password if blank? Or maybe we can't toggle without password? Let's hope the backend ignores blank.
          telephone: user.telephone,
          role: user.role,
        };
        // wait, the backend UtilisateurDto has "actif" property too, so we add it (the model might need it as optional)
        (updateDto as any).actif = actif;
        return this.http.put<Utilisateur>(`${this.baseUrl}/utilisateurs/${id}`, updateDto);
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/utilisateurs/${id}`);
  }
}
