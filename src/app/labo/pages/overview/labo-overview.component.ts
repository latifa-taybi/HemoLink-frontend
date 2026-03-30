import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LaboService, PocheSang, StatutSang } from '../../../services/labo.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-labo-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './labo-overview.component.html',
  styleUrl: './labo-overview.component.css'
})
export class LaboOverviewComponent implements OnInit {
  pochesSansTest = 0;
  pochesDisponibles = 0;
  pochesEcartees = 0;
  totalPoches = 0;
  loading = true;

  constructor(private laboService: LaboService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.laboService.getToutesLesPoches().subscribe({
      next: (poches) => {
        this.totalPoches = poches.length;
        this.pochesSansTest = poches.filter(p => p.statut === StatutSang.EN_ATTENTE_TEST).length;
        this.pochesDisponibles = poches.filter(p => p.statut === StatutSang.DISPONIBLE).length;
        this.pochesEcartees = poches.filter(p => p.statut === StatutSang.ECARTEE).length;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
