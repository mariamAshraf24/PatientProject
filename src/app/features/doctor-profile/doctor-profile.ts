import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IDoctor, Schedule } from '../../core/models/IDoctor';
import { DoctorFilter } from './../../core/services/doctor-filter';
import { Booking } from './../../core/services/booking';
import { AppointmentNotifierService } from './../../core/services/appointment-notifier';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AmPmPipe } from '../../shared/am-pm-pipe';
import { MatIconModule } from '@angular/material/icon';
import { Footer } from "../footer/footer";




@Component({
  selector: 'app-doctor-profile',
  imports: [
    CommonModule,
    FormsModule,
    AmPmPipe,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    Footer
  ],
  templateUrl: './doctor-profile.html',
  styleUrl: './doctor-profile.scss',
})
export class DoctorProfile implements OnInit {
  doctor: IDoctor | null = null;
  availableSlots: string[] = [];
  selectedSlot: string | null = null;
  selectedType: number | null = null;
  selectedDate: Date = new Date();
  showCalendarModal: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  weekOrder: string[] = [
    'Saturday',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
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
    this.date =
      this.route.snapshot.queryParamMap.get('date') || this.getTodayDate();

    if (this.doctorId) {
      this._DoctorFilter.getDoctorProfile(this.doctorId).subscribe({
        next: (res) => {
          if (res.success) this.doctor = res.data;
        },
        error: (err) => console.error('فشل تحميل بيانات الدكتور', err),
      });

      this.loadAvailableSlots();
    }
  }

  getTodayDate(): string {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(today.getDate()).padStart(2, '0')}`;
  }

  get formattedDate(): string {
    return this.date === this.getTodayDate() ? 'اليوم' : this.date;
  }

  onDateChange(event: any): void {
    const dateObj: Date = event.value || event;
    this.date = `${dateObj.getFullYear()}-${String(
      dateObj.getMonth() + 1
    ).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    this.showCalendarModal = false;
    this.loadAvailableSlots();
  }

  loadAvailableSlots(): void {
    this._DoctorFilter.getDoctorSlots(this.doctorId, this.date).subscribe({
      next: (res) => {
        const now = new Date();
        const [year, month, day] = this.date.split('-').map(Number);

        this.availableSlots = res
          .filter((slot) => {
            const [hours, minutes, seconds] = slot.slotTime
              .split(':')
              .map(Number);
            const slotTime = new Date(
              year,
              month - 1,
              day,
              hours,
              minutes,
              seconds || 0
            );
            return slotTime.getTime() >= now.getTime();
          })
          .map((slot) => slot.slotTime);
      },
      error: (err) => console.error('فشل تحميل مواعيد الدكتور', err),
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


  closeCalendarModal() {
    this.showCalendarModal = false;
  }

  bookNow() {
    if (!this.selectedSlot || this.selectedType === null) {
     this.errorMessage = 'يرجى اختيار موعد ونوع الكشف';
    this.successMessage = null;
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
        console.log(' Booking Response:', res);

        const appointmentId = res.appointment?.appointment?.id;
        if (!appointmentId) {
          this.errorMessage = 'لم يتم استلام رقم الحجز!';
        this.successMessage = null;
          return;
        }

         this.successMessage = 'تم الحجز بنجاح';
      this.errorMessage = null;
        setTimeout(() => {
        this._Router.navigate(['/appointmentDetails', appointmentId]);
        this._notifier.notifyNewAppointment(appointmentId);
      }, 2000);
      },
      error: (err) => {
       console.error('فشل في الحجز', err);
      this.errorMessage = 'حدث خطأ أثناء محاولة الحجز';
      this.successMessage = null;
      },
    });
  }
}
