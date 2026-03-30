import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HospitalService, StatutCommande, CreateCommandeDto } from '../../../services/hospital.service';
import { GroupeSanguin } from '../../../services/labo.service';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-hospital-create-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './hospital-create-order.component.html',
  styleUrl: './hospital-create-order.component.css'
})
export class HospitalCreateOrderComponent implements OnInit {
  orderForm: FormGroup;
  loading = false;
  loadingCentres = true;
  centres: { id: number; nom: string; ville: string }[] = [];
  message: { text: string, type: 'success' | 'error' | '' } = { text: '', type: '' };

  bloodGroups = Object.values(GroupeSanguin);

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.orderForm = this.fb.group({
      centreCollecteId: ['', Validators.required],
      groupeSanguin: ['', Validators.required],
      quantite: [1, [Validators.required, Validators.min(1)]],
      urgence: [false]
    });
  }

  ngOnInit(): void {
    this.loadCentres();
  }

  loadCentres(): void {
    this.loadingCentres = true;
    this.hospitalService.getCentresCollecte().subscribe({
      next: (data) => {
        this.centres = data;
        this.loadingCentres = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.showMessage('Impossible de charger les centres de collecte.', 'error');
        this.loadingCentres = false;
        this.cdr.markForCheck();
      }
    });
  }

  onSubmit(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const user = this.auth.getUser();
    if (!user) {
      this.showMessage('Utilisateur non identifié.', 'error');
      return;
    }

    this.loading = true;
    const formValues = this.orderForm.value;

    const commandeDto: CreateCommandeDto = {
      hopitalId: (user as any).hopitalId ?? 1,
      centreCollecteId: Number(formValues.centreCollecteId),
      groupeSanguin: formValues.groupeSanguin,
      quantite: formValues.quantite,
      urgence: formValues.urgence,
      statut: StatutCommande.EN_ATTENTE,
      dateCommande: new Date().toISOString()
    };

    this.hospitalService.creerCommande(commandeDto).subscribe({
      next: () => {
        this.showMessage('Demande enregistrée avec succès. Redirection...', 'success');
        setTimeout(() => {
          this.router.navigate(['/hospital/orders']);
        }, 2000);
      },
      error: (err) => {
        this.showMessage(err.error?.message || 'Erreur lors de la création de la commande.', 'error');
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message = { text, type };
    this.cdr.markForCheck();
  }
}
