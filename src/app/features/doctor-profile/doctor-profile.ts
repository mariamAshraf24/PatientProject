import { ActivatedRoute } from '@angular/router';
import { IDoctor, Schedule } from '../../core/models/IDoctor';
import { DoctorFilter } from './../../core/services/doctor-filter';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctor-profile',
  imports: [CommonModule , FormsModule],
  templateUrl: './doctor-profile.html',
  styleUrl: './doctor-profile.scss',
})
export class DoctorProfile implements OnInit {
  doctor: IDoctor | null = null;
  weekOrder: string[] = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];


  constructor(
    private _DoctorFilter: DoctorFilter,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const doctorId = this.route.snapshot.paramMap.get('id');
    console.log('Doctor ID:', doctorId);
    if (doctorId) {
      this._DoctorFilter.getDoctorProfile(doctorId).subscribe({
        next: (res) => {
          if (res.success) {
            this.doctor = res.data;
          }
        },
        error: (err) => {
          console.error('فشل تحميل بيانات الدكتور', err);
        },
      });
    }
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

  getArabicDay(day: string): string {
  const days: Record<string, string> = {
    Sunday: 'الأحد',
    Monday: 'الإثنين',
    Tuesday: 'الثلاثاء',
    Wednesday: 'الأربعاء',
    Thursday: 'الخميس',
    Friday: 'الجمعة',
    Saturday: 'السبت',
  };
  return days[day] || day;
}

get sortedSchedules(): Schedule[] {
  if (!this.doctor?.schedules) return [];
  return this.weekOrder
    .map(day => this.doctor!.schedules.find(s => s.dayOfWeek === day))
    .filter((s): s is Schedule => !!s);
}

}
