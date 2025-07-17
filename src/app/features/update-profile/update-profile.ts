import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../core/services/patient-service';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-update-profile',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, Footer],
  templateUrl: './update-profile.html',
  styleUrl: './update-profile.scss',
})
export class UpdateProfile {
  form!: FormGroup;
  loading = false;

  constructor(
    private _PatientService: PatientService,
    private _FormBuilder: FormBuilder,
    private _Router: Router
  ) {}

  ngOnInit(): void {
    this.form = this._FormBuilder.group({
      username:['', Validators.required],
      fName: ['', Validators.required],
      lName: ['', Validators.required],
      city: [''],
      street: [''],
      country: ['Egypt'],
      phoneNumber: ['', [Validators.pattern(/^(010|011|012|015)[0-9]{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.loadCurrentData();
  }

  loadCurrentData(): void {
  this.loading = true;
  this._PatientService.getPatientProfile().subscribe({
    next: (res) => {
      console.log('Patient Data:', res.data)

      if (res.success) {
        this.form.patchValue({
          username:res.data.username,
          fName: res.data.fName,
          lName: res.data.lName,
          city: res.data.city,
          street: res.data.street,
          country: res.data.country || 'Egypt',
          phoneNumber: res.data.phone || res.data.phone, // لو الاسم phone فقط
          email:res.data.email
        });
      }
      this.loading = false;
    },
    error: (err: HttpErrorResponse) => {
      console.error('❌ Error loading profile:', err);
      this.loading = false;
    },
  });
}

  
  onSubmit(): void {
    if (this.form.invalid) {
      
      console.log("error appear")
      this.form.markAllAsTouched();
      return;
    }

    this._PatientService.updatePatientProfile(this.form.value).subscribe({
      next: (res) => {
        if (res.success) {
          alert(' تم تحديث البيانات بنجاح');
          this._Router.navigate(['/profile']);
        } else {
          alert(' فشل التحديث');
        }
      },
      error: (err) => {
        console.error('Error updating profile:', err);
console.log('Validation Errors:', err?.error?.errors);

        alert(' حدث خطأ أثناء التحديث');
      },
    });
  }


}
