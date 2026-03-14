import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminUsersService } from '../../services/admin-users.service';
import { Utilisateur, RoleUtilisateur, CreateUtilisateurDto } from '../../models/admin.models';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent implements OnInit {
  users: Utilisateur[] = [];
  filtered: Utilisateur[] = [];
  loading = true;
  error = '';
  success = '';

  showModal = false;
  showDeleteModal = false;
  selectedUser: Utilisateur | null = null;
  activeRoleFilter = 'ALL';

  form: FormGroup;
  submitting = false;

  readonly roles = Object.values(RoleUtilisateur);
  readonly roleLabels: Record<RoleUtilisateur, string> = {
    [RoleUtilisateur.ADMIN]: 'Administrateur',
    [RoleUtilisateur.DONNEUR]: 'Donneur',
    [RoleUtilisateur.TECHNICIEN_LABO]: 'Technicien Labo',
    [RoleUtilisateur.PERSONNEL_HOPITAL]: 'Personnel Hôpital',
  };

  readonly filterTabs = [
    { key: 'ALL', label: 'Tous' },
    { key: RoleUtilisateur.ADMIN, label: 'Admins' },
    { key: RoleUtilisateur.DONNEUR, label: 'Donneurs' },
    { key: RoleUtilisateur.TECHNICIEN_LABO, label: 'Labos' },
    { key: RoleUtilisateur.PERSONNEL_HOPITAL, label: 'Hôpitaux' },
  ];

  constructor(private usersService: AdminUsersService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      telephone: [''],
      role: [RoleUtilisateur.DONNEUR, Validators.required],
    });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.usersService.getAll().pipe(catchError(() => of([]))).subscribe(users => {
      this.users = users;
      this.applyFilter();
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  applyFilter(role = this.activeRoleFilter): void {
    this.activeRoleFilter = role;
    this.filtered = role === 'ALL' ? [...this.users] : this.users.filter(u => u.role === role);
  }

  openAddModal(): void {
    this.form.reset({ role: RoleUtilisateur.DONNEUR });
    this.showModal = true;
    this.error = '';
    this.success = '';
  }

  closeModal(): void { this.showModal = false; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    this.error = '';
    const dto: CreateUtilisateurDto = this.form.value;
    this.usersService.create(dto).subscribe({
      next: () => {
        this.showModal = false;
        this.submitting = false;
        this.success = 'Utilisateur créé avec succès.';
        this.load();
        this.cdr.detectChanges();
        setTimeout(() => { this.success = ''; this.cdr.detectChanges(); }, 3000);
      },
      error: () => {
        this.submitting = false;
        this.error = 'Erreur lors de la création.';
        this.cdr.detectChanges();
      },
    });
  }

  toggleStatut(user: Utilisateur): void {
    this.usersService.toggleStatut(user.id, !user.actif).pipe(catchError(() => of(null))).subscribe(updated => {
      if (updated) {
        const idx = this.users.findIndex(u => u.id === user.id);
        if (idx !== -1) { this.users[idx] = updated; this.applyFilter(); }
        this.cdr.detectChanges();
      }
    });
  }

  confirmDelete(user: Utilisateur): void {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }

  deleteUser(): void {
    if (!this.selectedUser) return;
    this.usersService.delete(this.selectedUser.id).pipe(catchError(() => of(null))).subscribe(() => {
      this.users = this.users.filter(u => u.id !== this.selectedUser!.id);
      this.applyFilter();
      this.showDeleteModal = false;
      this.selectedUser = null;
      this.success = 'Utilisateur supprimé.';
      this.cdr.detectChanges();
      setTimeout(() => { this.success = ''; this.cdr.detectChanges(); }, 3000);
    });
  }

  getField(name: string) { return this.form.get(name); }
  formatDate(d: string): string { return new Date(d).toLocaleDateString('fr-FR'); }
}
