import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PatientService } from '../../core/services/patient-service';
import { IPatient } from '../../core/models/IPatient';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule , RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  patient: IPatient | null = null;
  constructor(private _PatientService: PatientService) {}

  ngOnInit(): void {
    this._PatientService.getPatientProfile().subscribe({
      next: (res) => {
        if (res.success) {
          this.patient = res.data;
        }
      },
      error: (err) => {
        console.error('فشل تحميل بيانات المريض', err);
      },
    });
  }

  getAge(dateOfBirth: string): number {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
}
