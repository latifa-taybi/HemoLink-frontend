import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, RoleUtilisateur } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let defaultEmail = 'admin@hemolink.com';
    
    this.route.queryParams.subscribe(params => {
      if (params['email']) defaultEmail = params['email'];
      if (params['registered'] === 'true') this.success = 'Inscription réussie ! Veuillez vous connecter.';
    });

    this.loginForm = this.fb.group({
      email: [defaultEmail, [Validators.required, Validators.email]],
      password: ['admin123', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = '';

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        const user = this.authService.getUser();
        
        // Fetch complete user data from backend
        if (user?.id && user.id > 0) {
          this.authService.fetchUserData().subscribe({
            next: (updatedUser) => {
              this.navigateByRole(updatedUser.role);
            },
            error: () => {
              // Navigate even if fetch fails, use decoded token data
              this.navigateByRole(user.role);
            }
          });
        } else {
          this.navigateByRole(user?.role);
        }
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401 || err.status === 403) {
          this.error = 'Email ou mot de passe incorrect';
        } else if (err.error?.message) {
          this.error = err.error.message;
        } else {
          this.error = 'Erreur de connexion. Veuillez réessayer.';
        }
      }
    });
  }

  private navigateByRole(role?: RoleUtilisateur): void {
    switch (role) {
      case RoleUtilisateur.ADMIN: this.router.navigate(['/admin']); break;
      case RoleUtilisateur.DONNEUR: this.router.navigate(['/donor']); break;
      case RoleUtilisateur.LABO_PERSONNEL: this.router.navigate(['/labo']); break;
      case RoleUtilisateur.HOPITAL: this.router.navigate(['/hopital']); break;
      case RoleUtilisateur.PERSONNEL_CENTRE: this.router.navigate(['/centre']); break;
      default: this.router.navigate(['/auth/login']);
    }
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
