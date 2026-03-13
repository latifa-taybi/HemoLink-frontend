import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminStockService } from '../../services/admin-stock.service';
import { AdminUsersService } from '../../services/admin-users.service';
import { AdminOrdersService } from '../../services/admin-orders.service';
import { AdminCentersService } from '../../services/admin-centers.service';
import { GROUPE_SANGUIN_LABELS, GroupeSanguin, StatutCommande } from '../../models/admin.models';
import { forkJoin, catchError, of } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-reports.component.html',
  styleUrl: './admin-reports.component.css',
})
export class AdminReportsComponent {
  loading = false;
  success = '';
  error = '';

  readonly groupeLabels = GROUPE_SANGUIN_LABELS;

  constructor(
    private stockService: AdminStockService,
    private usersService: AdminUsersService,
    private ordersService: AdminOrdersService,
    private centersService: AdminCentersService,
    private cdr: ChangeDetectorRef
  ) {}

  generateStockReport(): void {
    this.loading = true;
    forkJoin({
      stock: this.stockService.getStockParGroupe().pipe(catchError(() => of([]))),
      centers: this.centersService.getAll().pipe(catchError(() => of([]))),
    }).subscribe(({ stock, centers }) => {
      const doc = new jsPDF();

      // Header
      doc.setFillColor(220, 38, 38);
      doc.rect(0, 0, 210, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('HémoLink – Rapport National des Stocks', 14, 18);

      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Généré le : ${new Date().toLocaleDateString('fr-FR')}`, 14, 40);
      doc.text(`Centres actifs : ${centers.length}`, 14, 47);
      doc.text(`Total poches disponibles : ${stock.reduce((s, g) => s + g.quantiteDisponible, 0)}`, 14, 54);

      autoTable(doc, {
        startY: 65,
        head: [['Groupe Sanguin', 'Disponibles', 'Réservées', 'Bientôt expirées']],
        body: stock.map(s => [
          GROUPE_SANGUIN_LABELS[s.groupeSanguin],
          s.quantiteDisponible,
          s.quantiteReservee,
          s.pochesBientotExpirees,
        ]),
        headStyles: { fillColor: [220, 38, 38] },
        alternateRowStyles: { fillColor: [254, 242, 242] },
        styles: { font: 'helvetica', fontSize: 10 },
      });

      doc.save(`hemolink-stock-${new Date().toISOString().slice(0,10)}.pdf`);
      this.loading = false;
      this.success = 'Rapport de stock généré avec succès.';
      this.cdr.detectChanges();
      setTimeout(() => { this.success = ''; this.cdr.detectChanges(); }, 4000);
    });
  }

  generateWasteReport(): void {
    this.loading = true;
    forkJoin({
      stock: this.stockService.getStockParGroupe().pipe(catchError(() => of([]))),
      orders: this.ordersService.getAll().pipe(catchError(() => of([]))),
    }).subscribe(({ stock, orders }) => {
      const doc = new jsPDF();

      doc.setFillColor(185, 28, 28);
      doc.rect(0, 0, 210, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('HémoLink – Rapport de Gaspillage', 14, 18);

      const totalExpiring = stock.reduce((s, g) => s + g.pochesBientotExpirees, 0);
      const cancelled = orders.filter(o => o.statut === StatutCommande.ANNULEE).length;

      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 14, 40);
      doc.text(`Poches bientôt expirées (< 7 jours) : ${totalExpiring}`, 14, 47);
      doc.text(`Commandes annulées : ${cancelled}`, 14, 54);

      autoTable(doc, {
        startY: 65,
        head: [['Groupe', 'Disponibles', 'Bientôt expirées', 'Risque']],
        body: stock.map(s => [
          GROUPE_SANGUIN_LABELS[s.groupeSanguin],
          s.quantiteDisponible,
          s.pochesBientotExpirees,
          s.pochesBientotExpirees > 0
            ? `⚠️ ${Math.round((s.pochesBientotExpirees / Math.max(s.quantiteDisponible, 1)) * 100)}%`
            : '✅ OK',
        ]),
        headStyles: { fillColor: [185, 28, 28] },
        alternateRowStyles: { fillColor: [254, 242, 242] },
      });

      doc.save(`hemolink-gaspillage-${new Date().toISOString().slice(0,10)}.pdf`);
      this.loading = false;
      this.success = 'Rapport de gaspillage généré.';
      this.cdr.detectChanges();
      setTimeout(() => { this.success = ''; this.cdr.detectChanges(); }, 4000);
    });
  }
}
