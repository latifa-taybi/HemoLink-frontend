import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DonorService } from '../../services/donor.service';
import { Don } from '../../models/donor.models';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-donor-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './donor-history.component.html',
  styleUrl: './donor-history.component.css'
})
export class DonorHistoryComponent implements OnInit {
  private readonly donorService = inject(DonorService);
  private readonly authService = inject(Auth);
  private readonly cdr = inject(ChangeDetectorRef);

  history: Don[] = [];
  loading = true;

  constructor() {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user && user.id > 0) {
      this.donorService.getProfile(user.id).subscribe({
        next: (d) => {
          this.donorService.getHistory(d.id).subscribe({
            next: (h) => {
              this.history = h.sort((a, b) => new Date(b.dateDon).getTime() - new Date(a.dateDon).getTime());
              this.loading = false;
              this.cdr.markForCheck();
            },
            error: () => { this.loading = false; this.cdr.markForCheck(); }
          });
        },
        error: () => { this.loading = false; this.cdr.markForCheck(); }
      });
    } else {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      EN_ATTENTE_TEST: '🔬 En analyse',
      DISPONIBLE: '✅ Validé',
      TRANSFUSEE: '❤️ Transfusé',
      ECARTEE: '⚠️ Écarté',
      EXPIREE: '⏰ Expiré'
    };
    return map[status] || status;
  }

  getStatusClass(status: string): string {
    if (status === 'DISPONIBLE' || status === 'TRANSFUSEE') return 'status-ok';
    if (status === 'EN_ATTENTE_TEST') return 'status-pending';
    return 'status-error';
  }
}
