import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

/**
 * PersonnelDonationsComponent - Record new donations
 */
@Component({
  selector: 'app-personnel-donations',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './personnel-donations.component.html',
  styleUrl: './personnel-donations.component.css',
})
export class PersonnelDonationsComponent implements OnInit {
  private fb = inject(FormBuilder);

  isLoading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  donationForm = this.fb.group({
    donorId: ['', Validators.required],
    volumeMl: [450, [Validators.required, Validators.min(400), Validators.max(500)]],
    bloodPressure: ['', Validators.required],
    hemoglobin: ['', Validators.required],
    temperature: ['', Validators.required],
    notes: [''],
  });

  ngOnInit(): void {}

  submitDonation(): void {
    if (this.donationForm.invalid) return;

    this.isLoading.set(true);
    // TODO: Call service to record donation
    setTimeout(() => {
      this.successMessage.set('Donation recorded successfully');
      this.isLoading.set(false);
      this.donationForm.reset();
    }, 1000);
  }
}
