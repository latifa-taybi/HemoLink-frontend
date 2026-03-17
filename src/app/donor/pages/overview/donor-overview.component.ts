import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DonorService } from '../../services/donor.service';
import { Donneur, Eligibilite } from '../../models/donor.models';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-donor-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './donor-overview.component.html',
  styleUrl: './donor-overview.component.css'
})
export class DonorOverviewComponent implements OnInit {
  private readonly donorService = inject(DonorService);
  private readonly authService = inject(Auth);
  private readonly cdr = inject(ChangeDetectorRef);

  donor: Donneur | null = null;
  eligibility: Eligibilite | null = null;
  loading = true;

  constructor() {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user && user.id > 0) {
      this.donorService.getProfile(user.id).subscribe({
        next: (d) => {
          this.donor = d;
          this.checkEligibility(d.id);
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  checkEligibility(doneurId: number): void {
    this.donorService.getEligibility(doneurId).subscribe({
      next: (e) => {
        this.eligibility = e;
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
