import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * LaboResultsComponent - View test results and reports
 */
@Component({
  selector: 'app-labo-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './labo-results.component.html',
  styleUrl: './labo-results.component.css',
})
export class LaboResultsComponent implements OnInit {
  results = signal<any[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadResults();
  }

  private loadResults(): void {
    // TODO: Load from service
    this.isLoading.set(false);
  }

  downloadReport(resultId: number): void {
    // TODO: Implement download
  }
}
