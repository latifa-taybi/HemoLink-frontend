import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { DonorService } from '../services/donor.service';
import { Donneur } from '../models/donor.models';

@Component({
  selector: 'app-donor-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './donor-layout.component.html',
  styleUrl: './donor-layout.component.css',
})
export class DonorLayoutComponent implements OnInit {
  public readonly authService = inject(Auth);
  private readonly donorService = inject(DonorService);
  public readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  donor: Donneur | null = null;
  alerts: string[] = [];

  constructor() {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user && user.id > 0) {
      this.donorService.getProfile(user.id).subscribe({
        next: (d) => {
          this.donor = d;
          this.cdr.markForCheck();
        },
        error: () => console.error('Erreur lors du chargement du profil donneur'),
      });
      this.donorService.getAlerts().subscribe(a => {
        this.alerts = a;
        this.cdr.markForCheck();
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  navItems = [
    { path: '/donor/overview',      label: 'Tableau de bord',  icon: 'dashboard' },
    { path: '/donor/history',       label: 'Mon Historique',   icon: 'history'   },
    { path: '/donor/find-centers',  label: 'Trouver un centre', icon: 'map'      },
    { path: '/donor/appointments',  label: 'Mes Rendez-vous',  icon: 'calendar'  },
  ];
}
