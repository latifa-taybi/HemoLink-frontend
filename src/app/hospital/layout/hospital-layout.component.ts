// Fix resolution
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth, UtilisateurResponseDto } from '../../services/auth';

@Component({
  selector: 'app-hospital-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './hospital-layout.component.html',
  styleUrl: './hospital-layout.component.css'
})
export class HospitalLayoutComponent implements OnInit {
  user: UtilisateurResponseDto | null = null;
  isSidebarCollapsed = false;

  constructor(
    private authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.cdr.markForCheck();
    });
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
