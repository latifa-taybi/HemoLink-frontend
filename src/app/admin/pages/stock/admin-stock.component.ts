import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminStockService } from '../../services/admin-stock.service';
import { AdminCentersService } from '../../services/admin-centers.service';
import {
  StockParGroupe, StockParCentre, CentreCollecte, GroupeSanguin, GROUPE_SANGUIN_LABELS
} from '../../models/admin.models';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-admin-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-stock.component.html',
  styleUrl: './admin-stock.component.css',
})
export class AdminStockComponent implements OnInit {
  stockParGroupe: StockParGroupe[] = [];
  stockParCentre: StockParCentre[] = [];
  centers: CentreCollecte[] = [];
  loading = true;

  selectedCenter = '';
  selectedGroupe = '';

  readonly groupeLabels = GROUPE_SANGUIN_LABELS;
  readonly groupes = Object.values(GroupeSanguin);

  constructor(
    private stockService: AdminStockService,
    private centersService: AdminCentersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    forkJoin({
      groupe: this.stockService.getStockParGroupe().pipe(catchError(() => of([]))),
      centre: this.stockService.getStockParCentre().pipe(catchError(() => of([]))),
      centers: this.centersService.getAll().pipe(catchError(() => of([]))),
    }).subscribe(({ groupe, centre, centers }) => {
      this.stockParGroupe = groupe;
      this.stockParCentre = centre;
      this.centers = centers;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  get filteredCentreStock(): StockParCentre[] {
    return this.selectedCenter
      ? this.stockParCentre.filter(c => String(c.centreId) === this.selectedCenter)
      : this.stockParCentre;
  }

  get filteredGroupeStock(): StockParGroupe[] {
    return this.selectedGroupe
      ? this.stockParGroupe.filter(s => s.groupeSanguin === this.selectedGroupe)
      : this.stockParGroupe;
  }

  getStockLevel(qty: number): 'critical' | 'low' | 'ok' {
    if (qty === 0) return 'critical';
    if (qty < 5) return 'low';
    return 'ok';
  }

  totalDisponible(): number {
    return this.stockParGroupe.reduce((s, g) => s + g.quantiteDisponible, 0);
  }
  totalExpirant(): number {
    return this.stockParGroupe.reduce((s, g) => s + g.pochesBientotExpirees, 0);
  }
}
