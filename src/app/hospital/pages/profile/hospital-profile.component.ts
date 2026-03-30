// Fix resolution
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HospitalService, Hopital } from '../../../services/hospital.service';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-hospital-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hospital-profile.component.html',
  styleUrl: './hospital-profile.component.css'
})
export class HospitalProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading = true;
  saving = false;
  message: { text: string, type: 'success' | 'error' | '' } = { text: '', type: '' };
  hospitalId: number = 1; // Default for prototype

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private auth: Auth,
    private cdr: ChangeDetectorRef
  ) {
    this.profileForm = this.fb.group({
      nom: ['', Validators.required],
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9\\+\\s]*$')]]
    });
  }

  ngOnInit(): void {
    this.loadHospitalData();
  }

  loadHospitalData(): void {
    this.loading = true;
    this.hospitalService.getHopitalById(this.hospitalId).subscribe({
      next: (data) => {
        this.profileForm.patchValue(data);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.showMessage('Erreur lors du chargement des informations.', 'error');
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.hospitalService.updateHopital(this.hospitalId, this.profileForm.value).subscribe({
      next: (updated) => {
        this.profileForm.patchValue(updated);
        this.showMessage('Informations mises à jour avec succès.', 'success');
        this.saving = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.showMessage(err.error?.message || 'Erreur lors de la mise à jour.', 'error');
        this.saving = false;
        this.cdr.markForCheck();
      }
    });
  }

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message = { text, type };
    this.cdr.markForCheck();
    setTimeout(() => {
      this.message = { text: '', type: '' };
      this.cdr.markForCheck();
    }, 4000);
  }
}
