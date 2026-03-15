import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminOrdersService } from '../../services/admin-orders.service';
import { Commande, StatutCommande, GROUPE_SANGUIN_LABELS } from '../../models/admin.models';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css',
})
export class AdminOrdersComponent implements OnInit {
  orders: Commande[] = [];
  filtered: Commande[] = [];
  loading = true;
  success = '';

  activeFilter = 'ALL';

  readonly statutOptions = Object.values(StatutCommande);
  readonly groupeLabels = GROUPE_SANGUIN_LABELS;

  readonly filterTabs = [
    { key: 'ALL', label: 'Toutes' },
    { key: 'URGENTE_FLAG', label: '🚨 Urgentes' },
    { key: StatutCommande.EN_ATTENTE, label: 'En attente' },
    { key: StatutCommande.EN_PREPARATION, label: 'En préparation' },
    { key: StatutCommande.EN_LIVRAISON, label: 'En livraison' },
    { key: StatutCommande.LIVREE, label: 'Livrées' },
    { key: StatutCommande.ANNULEE, label: 'Annulées' },
  ];

  readonly statutLabels: Record<StatutCommande, string> = {
    [StatutCommande.EN_ATTENTE]: 'En attente',
    [StatutCommande.EN_PREPARATION]: 'En préparation',
    [StatutCommande.EN_LIVRAISON]: 'En livraison',
    [StatutCommande.LIVREE]: 'Livrée',
    [StatutCommande.ANNULEE]: 'Annulée',
  };

  constructor(private ordersService: AdminOrdersService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.ordersService.getAll().pipe(catchError(() => of([]))).subscribe(orders => {
      this.orders = orders;
      this.applyFilter();
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  applyFilter(key = this.activeFilter): void {
    this.activeFilter = key;
    if (key === 'ALL') this.filtered = [...this.orders];
    else if (key === 'URGENTE_FLAG') this.filtered = this.orders.filter(o => o.urgence);
    else this.filtered = this.orders.filter(o => o.statut === key);
  }

  updateStatut(order: Commande, newStatut: string): void {
    this.ordersService.updateStatut(order.id, newStatut as StatutCommande).subscribe({
      next: (updated) => {
        const idx = this.orders.findIndex(o => o.id === order.id);
        if (idx !== -1) { this.orders[idx] = updated; this.applyFilter(); }
        this.success = `Commande #${order.id} mise à jour.`;
        this.cdr.detectChanges();
        setTimeout(() => { this.success = ''; this.cdr.detectChanges(); }, 3000);
      },
    });
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
  }

  urgentCount(): number { return this.orders.filter(o => o.urgence).length; }
}
