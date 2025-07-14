// import { ActivatedRoute, Router } from '@angular/router';
import { IDoctor, Schedule } from '../../core/models/IDoctor';
import { DoctorFilter } from './../../core/services/doctor-filter';
import { Booking } from './../../core/services/booking'; // ✅ تأكد من المسار الصحيح
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentNotifierService } from './../../core/services/appointment-notifier';

@Component({
  selector: 'app-doctor-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-profile.html',
  styleUrl: './doctor-profile.scss',
})
export class DoctorProfile implements OnInit {
  doctor: IDoctor | null = null;
  availableSlots: string[] = [];
  selectedSlot: string | null = null;
  selectedType: number | null = null;


  weekOrder: string[] = [
    'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
  ];

  private doctorId: string = '';
  private date: string = '';

  constructor(
    private _DoctorFilter: DoctorFilter,
    private _Booking: Booking,
    private route: ActivatedRoute,
    private _Router: Router,
    private _notifier: AppointmentNotifierService
  ) { }

  ngOnInit(): void {
    this.doctorId = this.route.snapshot.paramMap.get('id') || '';
    this.date = this.route.snapshot.queryParamMap.get('date') || this.getTodayDate();

    if (this.doctorId) {
      this._DoctorFilter.getDoctorProfile(this.doctorId).subscribe({
        next: (res) => {
          if (res.success) this.doctor = res.data;
        },
        error: (err) => console.error('فشل تحميل بيانات الدكتور', err),
      });

      this._DoctorFilter.getDoctorSlots(this.doctorId, this.date).subscribe({
        next: (res) => {
          this.availableSlots = res.map((slot) => slot.slotTime);
        },
        error: (err) => console.error('فشل تحميل مواعيد الدكتور', err),
      });
    }
  }

  getTodayDate(): string {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  }

  getAge(dateOfBirth: string): number {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
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
      .map((day) => this.doctor!.schedules.find((s) => s.dayOfWeek === day))
      .filter((s): s is Schedule => !!s);
  }

  bookNow() {
    if (!this.selectedSlot || this.selectedType === null) {
      alert("يرجى اختيار موعد ونوع الكشف");
      return;
    }

    const bookingData = {
      doctorId: this.doctorId,
      date: this.date,
      startTime: this.selectedSlot,
      appointmentType: this.selectedType,
    };

    this._Booking.bookAppointment(bookingData).subscribe({
      next: (res) => {
        console.log("🚀 Booking Response:", res);

        const appointmentId = res.appointment?.appointment?.id;
        if (!appointmentId) {
          alert("❌ لم يتم استلام رقم الحجز!");
          return;
        }

        alert("✅ تم الحجز بنجاح");
        this._Router.navigate(['/appointmentDetails', appointmentId]);
        this._notifier.notifyNewAppointment(appointmentId);


      },
      error: (err) => {
        console.error('❌ فشل في الحجز', err);
        alert('حدث خطأ أثناء محاولة الحجز');
      }
    });
  }


}
