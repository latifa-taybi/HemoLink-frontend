import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * Donor Module Root Component
 * Serves as the entry point for the donor role module
 * Handles routing for all donor-related pages
 */
@Component({
  selector: 'app-donor',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class DonorComponent {}
