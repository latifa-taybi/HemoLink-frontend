import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PersonnelService, CreateDonDto } from '../../../services/personnel.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-personnel-create-donation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './personnel-create-donation.component.html',
  styleUrl: './personnel-create-donation.component.css'
})
export class PersonnelCreateDonationComponent implements OnInit {
  donForm: FormGroup;
  loading = false;
  message: { text: string, type: 'success' | 'error' | '' } = { text: '', type: '' };

  constructor(
    private fb: FormBuilder,
    private personnelService: PersonnelService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.donForm = this.fb.group({
      donneurId: ['', [Validators.required, Validators.min(1)]],
      volumeMl: [450, [Validators.required, Validators.min(200), Validators.max(600)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.donForm.invalid) {
      this.donForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValues = this.donForm.value;

    this.authService.fetchUserData().subscribe({
      next: (user) => {
        const centreId = user?.centreCollecteId;

        if (!centreId) {
          this.showMessage('Erreur : Votre profil n\'est pas rattaché à un centre.', 'error');
          this.loading = false;
          this.cdr.markForCheck();
          return;
        }

        const dto: CreateDonDto = {
          donneurId: Number(formValues.donneurId),
          centreId: centreId, // Use REAL centreId
          dateDon: new Date().toISOString(),
          volumeMl: formValues.volumeMl
        };

        this.personnelService.enregistrerDon(dto).subscribe({
          next: () => {
            this.showMessage('Don enregistré avec succès et notifié au laboratoire !', 'success');
            this.loading = false;
            this.donForm.reset({ volumeMl: 450 });
            this.cdr.markForCheck();
          },
          error: (err) => {
            const errorMessage = err.error?.message || err.message || 'Une erreur est survenue lors de l\'enregistrement.';
            this.showMessage('Erreur api : ' + errorMessage, 'error');
            this.loading = false;
            this.cdr.markForCheck();
          }
        });
      },
      error: () => {
        this.showMessage('Erreur lors de la récupération de votre profil (centreId introuvable).', 'error');
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message = { text, type };
    setTimeout(() => {
      this.message = { text: '', type: '' };
      this.cdr.markForCheck();
    }, 5000);
  }
}
