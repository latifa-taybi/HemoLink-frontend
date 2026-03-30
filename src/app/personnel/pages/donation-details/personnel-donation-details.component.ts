import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * PersonnelDonationDetailsComponent
 * Track donation process and generate blood bags
 */
@Component({
  selector: 'app-personnel-donation-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './personnel-donation-details.component.html',
  styleUrl: './personnel-donation-details.component.css',
})
export class PersonnelDonationDetailsComponent implements OnInit {
  donations = signal<any[]>([]);
  isLoading = signal(true);

  recentDonations = computed(() => {
    return this.donations().slice(0, 10);
  });

  ngOnInit(): void {
    this.loadDonations();
  }

  private loadDonations(): void {
    // TODO: Load from service
    this.isLoading.set(false);
  }

  viewDetails(donationId: number): void {
    // TODO: Show donation details modal
  }

  generateBagLabel(donationId: number): void {
    // TODO: Generate and print blood bag label
  }
}
