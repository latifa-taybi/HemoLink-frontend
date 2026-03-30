import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupeSanguin } from '../../../models';

/**
 * HospitalSearchComponent
 * Search donor-compatible blood availability
 */
@Component({
  selector: 'app-hospital-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hospital-search.component.html',
  styleUrl: './hospital-search.component.css',
})
export class HospitalSearchComponent implements OnInit {
  bloodGroups = Object.values(GroupeSanguin);
  selectedBloodType = signal('');
  searchResults = signal<any[]>([]);
  isLoading = signal(false);

  ngOnInit(): void {}

  search(): void {
    if (!this.selectedBloodType()) return;

    this.isLoading.set(true);
    // TODO: Call service to search
    setTimeout(() => {
      this.isLoading.set(false);
    }, 1000);
  }
}
