import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LaboService, PocheSang, TestLaboDto } from '../../../services/labo.service';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-labo-tests',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './labo-tests.component.html',
  styleUrl: './labo-tests.component.css'
})
export class LaboTestsComponent implements OnInit {
  poches: PocheSang[] = [];
  loading = true;
  
  // Modal state
  isModalOpen = false;
  selectedPoche: PocheSang | null = null;
  technicienId: number | undefined;
  
  // Form model
  testForm = {
    vih: false,
    syphilis: false,
    hepatiteB: false,
    hepatiteC: false
  };

  submitting = false;
  message = { text: '', type: '' };

  constructor(
    private laboService: LaboService,
    private authService: Auth,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.technicienId = user?.id;
    });
    this.loadPochesSANS_TEST();
  }

  loadPochesSANS_TEST(): void {
    this.loading = true;
    this.laboService.getPochesSansTest().subscribe({
      next: (data) => {
        this.poches = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.showMessage('Erreur lors du chargement des poches non testées.', 'error');
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  openTestModal(poche: PocheSang): void {
    this.selectedPoche = poche;
    this.testForm = { vih: false, syphilis: false, hepatiteB: false, hepatiteC: false };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedPoche = null;
  }

  submitTest(): void {
    if (!this.selectedPoche) return;

    this.submitting = true;
    const dto: TestLaboDto = {
      pocheSangId: this.selectedPoche.id,
      technicienLaboId: this.technicienId,
      vih: this.testForm.vih,
      syphilis: this.testForm.syphilis,
      hepatiteB: this.testForm.hepatiteB,
      hepatiteC: this.testForm.hepatiteC
    };

    this.laboService.enregistrerTest(dto).subscribe({
      next: () => {
        this.showMessage('Analyse biologique enregistrée avec succès.', 'success');
        this.poches = this.poches.filter(p => p.id !== this.selectedPoche!.id);
        this.submitting = false;
        this.closeModal();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.showMessage(err.error?.message || 'Erreur lors de l’enregistrement du test.', 'error');
        this.submitting = false;
        this.cdr.markForCheck();
      }
    });
  }

  showMessage(text: string, type: string): void {
    this.message = { text, type };
    setTimeout(() => {
      this.message = { text: '', type: '' };
      this.cdr.markForCheck();
    }, 4000);
  }
}
