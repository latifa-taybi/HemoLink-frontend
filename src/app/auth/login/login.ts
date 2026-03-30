import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth, RoleUtilisateur } from '../../services/auth';

@Component({
  selector: 'app-login',
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
    private authService: Auth,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let defaultEmail = 'admin@hemolink.local';
    
    // Récupérer les query params (email après registration)
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        defaultEmail = params['email'];
      }
      if (params['registered'] === 'true') {
        this.success = 'Inscription réussie ! Veuillez vous connecter.';
      }
    });

    this.loginForm = this.fb.group({
      email: [defaultEmail, [Validators.required, Validators.email]],
      password: ['Admin@123', [Validators.required, Validators.minLength(6)]]
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
        switch (user?.role) {
          case RoleUtilisateur.ADMIN:
            this.router.navigate(['/admin']);
            break;
          case RoleUtilisateur.DONNEUR:
            this.router.navigate(['/donor']);
            break;
          case RoleUtilisateur.TECHNICIEN_LABO:
            this.router.navigate(['/labo']);
            break;
          case RoleUtilisateur.PERSONNEL_HOPITAL:
            this.router.navigate(['/hopital']);
            break;
          default:
            this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        // Extraire le message d'erreur du backend
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

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
