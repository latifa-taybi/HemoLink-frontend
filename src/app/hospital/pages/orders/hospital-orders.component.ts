import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HospitalService, CommandeSang, StatutCommande } from '../../../services/hospital.service';

@Component({
  selector: 'app-hospital-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DatePipe],
  templateUrl: './hospital-orders.component.html',
  styleUrl: './hospital-orders.component.css'
})
export class HospitalOrdersComponent implements OnInit {
  orders: CommandeSang[] = [];
  filteredOrders: CommandeSang[] = [];
  loading = true;
  activeFilter: 'ALL' | 'PENDING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED' = 'ALL';
  processingId: number | null = null;
  message: { text: string, type: 'success' | 'error' | '' } = { text: '', type: '' };

  StatutCommande = StatutCommande; // expose enum to template

  constructor(
    private hospitalService: HospitalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.hospitalService.getCommandes().subscribe({
      next: (data) => {
        this.orders = data.sort((a, b) => new Date(b.dateCommande).getTime() - new Date(a.dateCommande).getTime());
        this.applyFilter();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.showMessage('Erreur lors du chargement des commandes.', 'error');
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  setFilter(filter: any): void {
    this.activeFilter = filter;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.activeFilter === 'ALL') {
      this.filteredOrders = [...this.orders];
    } else {
      const statusMap: any = {
        'PENDING': [StatutCommande.EN_ATTENTE, StatutCommande.EN_PREPARATION],
        'SHIPPING': [StatutCommande.EN_LIVRAISON],
        'DELIVERED': [StatutCommande.LIVREE],
        'CANCELLED': [StatutCommande.ANNULEE]
      };
      const allowedStatuses = statusMap[this.activeFilter];
      this.filteredOrders = this.orders.filter(o => allowedStatuses.includes(o.statut));
    }
  }

  // ─── Transition actions ────────────────────────────────────────────
  preparerOrder(id: number): void {
    this.doTransition(id, this.hospitalService.preparerCommande(id), 'Commande mise en préparation.');
  }

  expedierOrder(id: number): void {
    this.doTransition(id, this.hospitalService.expedierCommande(id), 'Commande expédiée.');
  }

  livrerOrder(id: number): void {
    this.doTransition(id, this.hospitalService.livrerCommande(id), 'Commande marquée comme livrée.');
  }

  cancelOrder(id: number): void {
    if (!confirm('Voulez-vous vraiment annuler cette commande ?')) return;
    this.doTransition(id, this.hospitalService.annulerCommande(id), 'Commande annulée avec succès.');
  }

  private doTransition(id: number, request$: any, successMsg: string): void {
    this.processingId = id;
    request$.subscribe({
      next: (updatedOrder: CommandeSang) => {
        const index = this.orders.findIndex(o => o.id === id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
          this.applyFilter();
        }
        this.showMessage(successMsg, 'success');
        this.processingId = null;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.showMessage(err.error?.message || 'Erreur lors de la mise à jour.', 'error');
        this.processingId = null;
        this.cdr.markForCheck();
      }
    });
  }

  // ─── Guard helpers ────────────────────────────────────────────────
  canPreparer(order: CommandeSang): boolean {
    return order.statut === StatutCommande.EN_ATTENTE;
  }

  canExpedier(order: CommandeSang): boolean {
    return order.statut === StatutCommande.EN_PREPARATION;
  }

  canLivrer(order: CommandeSang): boolean {
    return order.statut === StatutCommande.EN_LIVRAISON;
  }

  canCancel(order: CommandeSang): boolean {
    return order.statut !== StatutCommande.LIVREE;
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

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message = { text, type };
    setTimeout(() => {
      this.message = { text: '', type: '' };
      this.cdr.markForCheck();
    }, 4000);
  }
}
