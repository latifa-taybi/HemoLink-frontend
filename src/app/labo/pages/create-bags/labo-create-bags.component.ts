import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LaboService, Don, PocheSang } from '../../../services/labo.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-labo-create-bags',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './labo-create-bags.component.html',
  styleUrl: './labo-create-bags.component.css'
})
export class LaboCreateBagsComponent implements OnInit {
  dons: Don[] = [];
  unseparatedDons: Don[] = [];
  loading = true;
  processingId: number | null = null;
  message = { text: '', type: '' };

  constructor(private laboService: LaboService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadDonsAndPoches();
  }

  loadDonsAndPoches(): void {
    this.loading = true;
    forkJoin({
      dons: this.laboService.getTousLesDons(),
      poches: this.laboService.getToutesLesPoches()
    }).subscribe({
      next: (res) => {
        // Collect IDs of dons that have already been converted to Poches
        const separatedDonIds = new Set(res.poches.map(p => p.donId));
        
        this.dons = res.dons.sort((a, b) => new Date(b.dateDon).getTime() - new Date(a.dateDon).getTime());
        // Filter out dons that already represent a PocheSang
        this.unseparatedDons = this.dons.filter(d => !separatedDonIds.has(d.id));
        
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.showMessage('Erreur lors du chargement des données.', 'error');
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  creerPoche(donId: number): void {
    this.processingId = donId;
    this.laboService.creerPocheDepuisDon(donId).subscribe({
      next: (poche) => {
        this.showMessage(`Poche #${poche.id} séparée avec succès !`, 'success');
        this.unseparatedDons = this.unseparatedDons.filter(d => d.id !== donId);
        this.processingId = null;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.showMessage(err.error?.message || 'Erreur lors de la séparation.', 'error');
        this.processingId = null;
        this.cdr.markForCheck();
      }
    });
  }

  showMessage(text: string, type: string): void {
    this.message = { text, type };
    setTimeout(() => {
      this.message = { text: '', type: '' };
      this.cdr.markForCheck();
    }, 4000);
  }
}
