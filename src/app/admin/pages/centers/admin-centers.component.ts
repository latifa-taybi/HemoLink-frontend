import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AdminCentersService } from '../../services/admin-centers.service';
import { CentreCollecte, CreateCentreDto, HoraireCentre, JOURS_SEMAINE, JOURS_LABELS } from '../../models/admin.models';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-admin-centers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-centers.component.html',
  styleUrl: './admin-centers.component.css',
})
export class AdminCentersComponent implements OnInit {
  centers: CentreCollecte[] = [];
  loading = true;
  error = '';
  success = '';

  showModal = false;
  showDeleteModal = false;
  showHoursModal = false;
  editingCenter: CentreCollecte | null = null;
  selectedCenter: CentreCollecte | null = null;

  form: FormGroup;
  hoursForm: FormGroup;
  submitting = false;

  readonly jours = JOURS_SEMAINE;
  readonly joursLabels = JOURS_LABELS;

  constructor(private centersService: AdminCentersService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      latitude: [''],
      longitude: [''],
      telephone: ['', Validators.pattern('^[0-9+() -]*$')],
    });

    this.hoursForm = this.fb.group({
      horaires: this.fb.array(
        JOURS_SEMAINE.map(jour => {
          const group = this.fb.group({
            id: [null],
            jour: [jour],
            ouverture: [{ value: '08:00', disabled: jour === 'SUNDAY' }],
            fermeture: [{ value: '17:00', disabled: jour === 'SUNDAY' }],
            ouvert: [jour !== 'SUNDAY'],
          });

          group.get('ouvert')?.valueChanges.subscribe(isOpen => {
            if (isOpen) {
              group.get('ouverture')?.enable();
              group.get('fermeture')?.enable();
            } else {
              group.get('ouverture')?.disable();
              group.get('fermeture')?.disable();
            }
          });
          return group;
        })
      ),
  });
}

ngOnInit(): void { this.load(); }

load(): void {
  this.loading = true;
  this.centersService.getAll().pipe(catchError(() => of([]))).subscribe(centers => {
    this.centers = centers;
    this.loading = false;
    this.cdr.detectChanges();
  });
}

  get horaireArray(): FormArray { return this.hoursForm.get('horaires') as FormArray; }

openAdd(): void {
  this.editingCenter = null;
  this.form.reset();
  this.showModal = true;
  this.error = '';
}

openEdit(c: CentreCollecte): void {
  this.editingCenter = c;
  this.form.patchValue(c);
  this.showModal = true;
  this.error = '';
}

closeModal(): void { this.showModal = false; }

submit(): void {
  if(this.form.invalid) { this.form.markAllAsTouched(); return; }
this.submitting = true;
const rawValue = this.form.value;
const dto: CreateCentreDto = {
  ...rawValue,
  latitude: rawValue.latitude ? Number(rawValue.latitude) : undefined,
  longitude: rawValue.longitude ? Number(rawValue.longitude) : undefined,
  horaires: this.editingCenter ? undefined : this.horaireArray.getRawValue()
};
const obs = this.editingCenter
  ? this.centersService.update(this.editingCenter.id, dto)
  : this.centersService.create(dto);
obs.subscribe({
  next: () => {
    this.showModal = false;
    this.submitting = false;
    this.success = this.editingCenter ? 'Centre modifié.' : 'Centre créé.';
    this.load();
    this.cdr.detectChanges();
    setTimeout(() => { this.success = ''; this.cdr.detectChanges(); }, 3000);
  },
  error: () => { this.submitting = false; this.error = 'Erreur lors de la sauvegarde.'; },
});
  }

  openHours(c: CentreCollecte): void {
    this.selectedCenter = c;
    // Reset IDs first
    this.horaireArray.controls.forEach(ctrl => ctrl.patchValue({ id: null }));
    // Pre-fill if center has horaires
    if(c.horaires?.length) {
      c.horaires.forEach(h => {
        const idx = JOURS_SEMAINE.indexOf(h.jour);
        if (idx !== -1) {
          this.horaireArray.at(idx).patchValue(h);
        }
      });
    }
    this.showHoursModal = true;
  }

closeHoursModal(): void { this.showHoursModal = false; }

  submitHours(): void {
    if(!this.selectedCenter) return;
    const horaires: HoraireCentre[] = this.horaireArray.getRawValue();
    this.centersService.updateHoraires(this.selectedCenter.id, horaires).subscribe({
    next: () => {
      this.showHoursModal = false;
      this.success = 'Horaires mis à jour.';
      this.load();
      this.cdr.detectChanges();
      setTimeout(() => { this.success = ''; this.cdr.detectChanges(); }, 3000);
    },
    error: () => { this.error = 'Erreur lors de la mise à jour des horaires.'; },
  });
}

confirmDelete(c: CentreCollecte): void { this.selectedCenter = c; this.showDeleteModal = true; }

deleteCenter(): void {
  if(!this.selectedCenter) return;
  this.centersService.delete(this.selectedCenter.id).pipe(catchError(() => of(null))).subscribe(() => {
    this.centers = this.centers.filter(c => c.id !== this.selectedCenter!.id);
    this.showDeleteModal = false;
    this.success = 'Centre supprimé.';
    this.selectedCenter = null;
    this.cdr.detectChanges();
    setTimeout(() => { this.success = ''; this.cdr.detectChanges(); }, 3000);
  });
}

getField(name: string) { return this.form.get(name); }
}
