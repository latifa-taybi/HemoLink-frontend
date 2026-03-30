/**
 * ADMIN MODULE - Complete Implementation
 * File: src/app/admin/admin.component.ts
 * Module root component for admin functionality
 */

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * AdminComponent - Root module component
 * Serves as entry point for admin module routing
 */
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class AdminComponent {}
