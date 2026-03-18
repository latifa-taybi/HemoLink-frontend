import { Component, OnInit, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminCentersService } from '../../../admin/services/admin-centers.service';
import { CentreCollecte } from '../../../admin/models/admin.models';
import * as L from 'leaflet';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-donor-map',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './donor-map.component.html',
  styleUrl: './donor-map.component.css'
})
export class DonorMapComponent implements OnInit, AfterViewInit {
  private readonly centersService = inject(AdminCentersService);
  private readonly authService = inject(Auth);
  private readonly cdr = inject(ChangeDetectorRef);
  
  centers: CentreCollecte[] = [];
  map: L.Map | null = null;
  loading = true;

  constructor() {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user && user.id > 0) {
      this.centersService.getAll().subscribe({
        next: (data) => {
          this.centers = data;
          this.loading = false;
          if (this.map) this.addMarkers();
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [33.5731, -7.5898],
      zoom: 12,
      zoomControl: false // optional: customize leaflet controls
    });

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    if (!this.loading && this.centers.length > 0) {
      this.addMarkers();
    }
  }

  private addMarkers(): void {
    if (!this.map) return;
    
    this.centers.forEach(c => {
      if (c.latitude && c.longitude) {
        // Red blood-drop style icon
        const icon = L.divIcon({
          className: 'custom-leaflet-icon',
          html: `<div style="width:24px;height:24px;background:linear-gradient(135deg, #dc2626, #991b1b);border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 10px rgba(0,0,0,0.3);"></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 24],
          popupAnchor: [0, -20]
        });

        const marker = L.marker([c.latitude, c.longitude], { icon }).addTo(this.map!);
        marker.bindPopup(`
          <div class="popup-card">
            <div class="popup-name">${c.nom}</div>
            <div class="popup-city">📍 ${c.ville}</div>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${c.latitude},${c.longitude}" target="_blank" class="popup-nav">Y aller</a>
          </div>
        `);
      }
    });

    // Auto fit bounds if possible
    if (this.centers.length > 0) {
      const first = this.centers[0];
      if (first.latitude && first.longitude) {
        this.map.setView([first.latitude, first.longitude], 12);
      }
    }
  }

  centerOn(c: CentreCollecte): void {
    if (this.map && c.latitude && c.longitude) {
      this.map.setView([c.latitude, c.longitude], 15);
      // Find the marker by lat/lng and open popup logic can be complex without keeping a marker dictionary,
      // so just zooming into the view is good enough.
    }
  }
}
