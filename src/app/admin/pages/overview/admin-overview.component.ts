import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminStatsService } from '../../services/admin-stats.service';
import { AdminStockService } from '../../services/admin-stock.service';
import { AdminUsersService } from '../../services/admin-users.service';
import { AdminOrdersService } from '../../services/admin-orders.service';
import { AdminCentersService } from '../../services/admin-centers.service';
import {
  StatistiquesAdmin, StockParGroupe, GroupeSanguin,
  GROUPE_SANGUIN_LABELS, StatutCommande
} from '../../models/admin.models';
import { Chart, registerables } from 'chart.js';
import { forkJoin, catchError, of } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-overview.component.html',
  styleUrl: './admin-overview.component.css',
})
export class AdminOverviewComponent implements OnInit, AfterViewInit {
  @ViewChild('stockChart') stockChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('wasteChart') wasteChartRef!: ElementRef<HTMLCanvasElement>;

  stats: StatistiquesAdmin | null = null;
  stockData: StockParGroupe[] = [];
  loading = true;
  error = false;

  kpis = [
    { label: 'Utilisateurs', value: 0, icon: 'users', color: 'blue', sub: 'comptes actifs' },
    { label: 'Centres actifs', value: 0, icon: 'location', color: 'green', sub: 'en service' },
    { label: 'Poches disponibles', value: 0, icon: 'droplet', color: 'red', sub: 'prêtes à distribuer' },
    { label: 'Commandes en attente', value: 0, icon: 'orders', color: 'orange', sub: 'à traiter' },
  ];

  private stockChart?: Chart;
  private wasteChart?: Chart;

  constructor(
    private statsService: AdminStatsService,
    private stockService: AdminStockService,
    private usersService: AdminUsersService,
    private ordersService: AdminOrdersService,
    private centersService: AdminCentersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {}

  private loadData(): void {
    this.statsService.getStatistiques().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.stockData = stats.stocksParGroupe;

        this.kpis[0].value = stats.totalUtilisateurs;
        this.kpis[1].value = stats.totalCentres;
        this.kpis[2].value = stats.totalPochesDisponibles;
        this.kpis[3].value = stats.totalCommandesEnAttente;

        this.loading = false;
        this.cdr.detectChanges();
        setTimeout(() => this.buildCharts(), 100);
      },
      error: () => {
        this.loading = false;
        this.error = true;
        this.cdr.detectChanges();
      }
    });
  }

  private buildCharts(): void {
    const labels = this.stockData.map(s => GROUPE_SANGUIN_LABELS[s.groupeSanguin]);
    const quantities = this.stockData.map(s => s.quantiteDisponible);
    const reserved = this.stockData.map(s => s.quantiteReservee);
    const expiring = this.stockData.map(s => s.pochesBientotExpirees);

    // Bar chart – stock by group
    if (this.stockChartRef?.nativeElement) {
      this.stockChart?.destroy();
      this.stockChart = new Chart(this.stockChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Disponibles',
              data: quantities,
              backgroundColor: 'rgba(220,38,38,0.8)',
              borderRadius: 6,
            },
            {
              label: 'Réservées',
              data: reserved,
              backgroundColor: 'rgba(251,146,60,0.7)',
              borderRadius: 6,
            },
            {
              label: 'Bientôt expirées',
              data: expiring,
              backgroundColor: 'rgba(239,68,68,0.3)',
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top' } },
          scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
        },
      });
    }

    // Doughnut – waste
    const totalOk = quantities.reduce((a, b) => a + b, 0);
    const totalExpiring = expiring.reduce((a, b) => a + b, 0);
    if (this.wasteChartRef?.nativeElement) {
      this.wasteChart?.destroy();
      this.wasteChart = new Chart(this.wasteChartRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['Stock sain', 'Bientôt expirées'],
          datasets: [{
            data: [Math.max(totalOk - totalExpiring, 0), totalExpiring],
            backgroundColor: ['rgba(34,197,94,0.8)', 'rgba(239,68,68,0.8)'],
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: { callbacks: { label: (c) => ` ${c.label}: ${c.raw} poches` } },
          },
        },
      });
    }
  }

  getStockStatus(qty: number): 'critical' | 'low' | 'ok' {
    if (qty === 0) return 'critical';
    if (qty < 5) return 'low';
    return 'ok';
  }

  readonly groupeLabel = GROUPE_SANGUIN_LABELS;
  readonly groupes = Object.values(GroupeSanguin);

  getStockForGroup(g: GroupeSanguin): StockParGroupe | undefined {
    return this.stockData.find(s => s.groupeSanguin === g);
  }
}
