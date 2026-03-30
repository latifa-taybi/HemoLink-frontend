import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', []],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('motDePasse');
    const confirmPassword = control.get('confirmPassword');
    if (!password || !confirmPassword) return null;
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.error = '';

    const { prenom, nom, email, motDePasse, telephone } = this.registerForm.value;
    this.authService.register(prenom, nom, email, motDePasse, telephone).subscribe({
      next: () => {
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/auth/login'], { queryParams: { email, registered: true } });
        }, 1000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || (err.status === 400 ? 'Vérifiez vos données' : 'Erreur inscription');
      }
    });
  }

  get prenom() { return this.registerForm.get('prenom'); }
  get nom() { return this.registerForm.get('nom'); }
  get email() { return this.registerForm.get('email'); }
  get telephone() { return this.registerForm.get('telephone'); }
  get motDePasse() { return this.registerForm.get('motDePasse'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get passwordMismatch(): boolean {
    return this.registerForm.hasError('passwordMismatch') && (this.confirmPassword?.touched || false);
  }
}
