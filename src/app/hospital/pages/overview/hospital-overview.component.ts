// Fix resolution
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HospitalService, CommandeSang, StatutCommande } from '../../../services/hospital.service';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-hospital-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hospital-overview.component.html',
  styleUrl: './hospital-overview.component.css'
})
export class HospitalOverviewComponent implements OnInit {
  recentOrders: CommandeSang[] = [];
  stats = {
    total: 0,
    pending: 0,
    urgent: 0,
    delivered: 0
  };
  loading = true;
  hospitalId: number | null = null;

  constructor(
    private hospitalService: HospitalService,
    private auth: Auth,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.auth.getUser();
    if (user) {
      // In a real app, the hospital personnel might be linked to a specific hospital ID
      // For now, we'll try to find if there's an associated hospital or just fetch all for demonstration
      // If the backend stores hospitalId in the user object, we use it.
      // Let's assume for this demo we fetch all orders or use a default ID if available
      this.loadDashboardData();
    }
  }

  loadDashboardData(): void {
    this.loading = true;
    this.hospitalService.getCommandes().subscribe({
      next: (orders) => {
        this.recentOrders = orders.sort((a, b) => new Date(b.dateCommande).getTime() - new Date(a.dateCommande).getTime()).slice(0, 5);
        this.calculateStats(orders);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  calculateStats(orders: CommandeSang[]): void {
    this.stats.total = orders.length;
    this.stats.pending = orders.filter(o => o.statut === StatutCommande.EN_ATTENTE || o.statut === StatutCommande.EN_PREPARATION).length;
    this.stats.urgent = orders.filter(o => o.urgence && o.statut !== StatutCommande.LIVREE && o.statut !== StatutCommande.ANNULEE).length;
    this.stats.delivered = orders.filter(o => o.statut === StatutCommande.LIVREE).length;
  }

  getStatusClass(statut: StatutCommande): string {
    switch (statut) {
      case StatutCommande.EN_ATTENTE: return 'status-pending';
      case StatutCommande.EN_PREPARATION: return 'status-prep';
      case StatutCommande.EN_LIVRAISON: return 'status-shipping';
      case StatutCommande.LIVREE: return 'status-delivered';
      case StatutCommande.ANNULEE: return 'status-cancelled';
      default: return '';
    }
  }
}
