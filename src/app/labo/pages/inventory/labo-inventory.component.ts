// Trigger reload
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LaboService, PocheSang, StatutSang } from '../../../services/labo.service';

@Component({
  selector: 'app-labo-inventory',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './labo-inventory.component.html',
  styleUrl: './labo-inventory.component.css'
})
export class LaboInventoryComponent implements OnInit {
  poches: PocheSang[] = [];
  filteredPoches: PocheSang[] = [];
  loading = true;
  activeFilter: 'ALL' | 'DISPONIBLE' | 'ECARTEE' | 'EN_ATTENTE_TEST' = 'ALL';
  processingId: number | null = null;
  message = { text: '', type: '' };

  // To expose Enum to template
  StatutSang = StatutSang;

  constructor(private laboService: LaboService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.loading = true;
    this.laboService.getToutesLesPoches().subscribe({
      next: (data) => {
        this.poches = data.sort((a, b) => new Date(b.dateCollecte).getTime() - new Date(a.dateCollecte).getTime());
        this.applyFilter();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.showMessage('Erreur lors du chargement de l\'inventaire.', 'error');
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  setFilter(filter: 'ALL' | 'DISPONIBLE' | 'ECARTEE' | 'EN_ATTENTE_TEST'): void {
    this.activeFilter = filter;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.activeFilter === 'ALL') {
      this.filteredPoches = [...this.poches];
    } else {
      this.filteredPoches = this.poches.filter(p => p.statut === this.activeFilter);
    }
  }

  ecarterPoche(id: number): void {
    if (!confirm('Voulez-vous vraiment écarter cette poche (destruction) ?')) return;
    this.updateStatus(id, 'ECARTER');
  }

  transfuserPoche(id: number): void {
    if (!confirm('Confirmer la transfusion d\'urgence pour cette poche ?')) return;
    this.updateStatus(id, 'TRANSFUSER');
  }

  private updateStatus(id: number, action: 'ECARTER' | 'TRANSFUSER'): void {
    this.processingId = id;
    const req = action === 'ECARTER' ? this.laboService.ecarterPoche(id) : this.laboService.transfuserPoche(id);
    
    req.subscribe({
      next: (updatedPoche) => {
        const index = this.poches.findIndex(p => p.id === id);
        if (index !== -1) {
          this.poches[index] = updatedPoche;
          this.applyFilter();
        }
        this.showMessage(`Statut de la poche #${id} mis à jour.`, 'success');
        this.processingId = null;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.showMessage(err.error?.message || 'Erreur lors de la mise à jour.', 'error');
        this.processingId = null;
        this.cdr.markForCheck();
      }
    });
  }

  showMessage(text: string, type: string): void {
    this.message = { text, type };
    setTimeout(() => {
      this.message = { text, type };
      this.cdr.markForCheck();
    }, 4000);
  }
}
