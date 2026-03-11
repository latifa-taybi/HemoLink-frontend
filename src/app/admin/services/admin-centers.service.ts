import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { concatMap, map, switchMap } from 'rxjs/operators';
import { CentreCollecte, CreateCentreDto, HoraireCentre } from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminCentersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8082/api';

  getAll(): Observable<CentreCollecte[]> {
    return this.http.get<CentreCollecte[]>(`${this.baseUrl}/centres-collecte`);
  }

  getById(id: number): Observable<CentreCollecte> {
    return this.http.get<CentreCollecte>(`${this.baseUrl}/centres-collecte/${id}`);
  }

  create(dto: CreateCentreDto): Observable<CentreCollecte> {
    return this.http.post<CentreCollecte>(`${this.baseUrl}/centres-collecte`, dto);
  }

  update(id: number, dto: CreateCentreDto): Observable<CentreCollecte> {
    return this.http.put<CentreCollecte>(`${this.baseUrl}/centres-collecte/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/centres-collecte/${id}`);
  }

  updateHoraires(id: number, horaires: HoraireCentre[]): Observable<CentreCollecte> {
    return this.getById(id).pipe(
      // Step 1: Clear existing schedules by sending an empty array
      concatMap(center => {
        const clearDto: CreateCentreDto = {
          nom: center.nom,
          adresse: center.adresse,
          ville: center.ville,
          latitude: center.latitude,
          longitude: center.longitude,
          telephone: center.telephone,
          horaires: []
        };
        return this.update(id, clearDto);
      }),
      // Step 2: Save the new schedules
      concatMap(center => {
        const finalDto: CreateCentreDto = {
          nom: center.nom,
          adresse: center.adresse,
          ville: center.ville,
          latitude: center.latitude,
          longitude: center.longitude,
          telephone: center.telephone,
          horaires: horaires
        };
        return this.update(id, finalDto);
      })
    );
  }

  searchByName(nom: string): Observable<CentreCollecte[]> {
    return this.http.get<CentreCollecte[]>(`${this.baseUrl}/centres-collecte/rechercher`, { params: { nom } });
  }

  searchByCity(ville: string): Observable<CentreCollecte[]> {
    return this.http.get<CentreCollecte[]>(`${this.baseUrl}/centres-collecte/ville/${ville}`);
  }

  searchNearby(lat: number, lon: number): Observable<CentreCollecte[]> {
    return this.http.get<CentreCollecte[]>(`${this.baseUrl}/centres-collecte/proches`, { params: { latitude: lat, longitude: lon } });
  }
}
