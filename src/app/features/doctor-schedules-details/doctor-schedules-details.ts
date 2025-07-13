// import { Component, inject, OnInit } from '@angular/core';
// import { ActivatedRoute, RouterLink } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { DoctorSchedulesService } from './../../core/services/doctor-schedules';
// import { IDoctorSchedules } from './../../core/models/idoctor-schedules';


// @Component({
//   selector: 'app-doctor-schedules-details',
//   imports: [CommonModule, RouterLink],
//   templateUrl: './doctor-schedules-details.html',
//   styleUrl: './doctor-schedules-details.scss'
// })
// export class DoctorSchedulesDetails implements OnInit {

//   private readonly _ActivatedRoute = inject(ActivatedRoute);
//   private readonly _DoctorSchedulesService = inject(DoctorSchedulesService);

//   detailsschedule : IDoctorSchedules | null = null;
//   schedulesList: IDoctorSchedules[] = [];
//   loading: boolean = false;
//   error: string | null = null;

//   getDayName(day: number): string {
//     const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
//     return days[day] ?? day;
//   }


 

//   ngOnInit(): void {
//     this._ActivatedRoute.paramMap.subscribe({
//       next:( p)=>{
//        let doctorid =  p.get('doctorId');
//        let scheduledate = p.get('date');

//        console.log('Doctor ID:', doctorid);
//        console.log('Schedule Date:', scheduledate);

//        // التحقق من وجود البيانات المطلوبة
//        if (!doctorid || !scheduledate) {
//          this.loading = false;
//          this.error = 'بيانات غير صحيحة: doctorId أو date مفقودة';
//          return;
//        }

//        this.loading = true;
//        this.error = null;

//        this._DoctorSchedulesService.getScheduleByDoctorIdAndDate(doctorid,scheduledate).subscribe({
//         next:(res)=> {
//           console.log('API Response:', res)
//           this.loading = false;
//           // التعامل مع array من المواعيد
//           if (Array.isArray(res)) {
//             this.schedulesList = res;
//             if (res.length > 0) {
//               this.detailsschedule = res[0]; // أول موعد كـ sample
//             }
//           } else if (res.data && Array.isArray(res.data)) {
//             this.schedulesList = res.data;
//             if (res.data.length > 0) {
//               this.detailsschedule = res.data[0];
//             }
//           } else if (res.data) {
//             this.schedulesList = [res.data];
//             this.detailsschedule = res.data;
//           } else {
//             this.schedulesList = [res];
//             this.detailsschedule = res;
//           }
//         },
//         error:(err)=>{
//           console.log('API Error:', err)
//           this.loading = false;
//           this.error = 'حدث خطأ في تحميل البيانات: ' + (err.error?.message || err.message || 'خطأ غير معروف');
//         }
//        })

//       }
//     })
      
//     };
  
  
// }
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DoctorSchedulesService } from './../../core/services/doctor-schedules';
import { IDoctorSchedules } from './../../core/models/idoctor-schedules';
import { Booking } from './../../core/services/booking';
import { FormsModule } from '@angular/forms'; // <-- ضروري لدعم [(ngModel)]

@Component({
  selector: 'app-doctor-schedules-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './doctor-schedules-details.html',
  styleUrl: './doctor-schedules-details.scss'
})
export class DoctorSchedulesDetails implements OnInit {
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _DoctorSchedulesService = inject(DoctorSchedulesService);
  private readonly _Booking = inject(Booking);
  private readonly _Router = inject(Router);

  detailsschedule: IDoctorSchedules | null = null;
  schedulesList: IDoctorSchedules[] = [];
  loading = false;
  error: string | null = null;

  selectedSchedule: IDoctorSchedules | null = null;
  selectedType: number = 0; // 0 = كشف، 1 = متابعة

  doctorId: string = '';
  date: string = '';

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        const doctorId = params.get('doctorId');
        const scheduleDate = params.get('date');

        if (!doctorId || !scheduleDate) {
          this.error = 'بيانات غير صحيحة';
          return;
        }

        this.doctorId = doctorId;
        this.date = scheduleDate;
        this.loading = true;
        this.error = null;

        this._DoctorSchedulesService.getScheduleByDoctorIdAndDate(doctorId, scheduleDate).subscribe({
          next: (res) => {
            this.loading = false;

            if (Array.isArray(res)) {
              this.schedulesList = res;
              this.detailsschedule = res[0] ?? null;
            } else if (res.data && Array.isArray(res.data)) {
              this.schedulesList = res.data;
              this.detailsschedule = res.data[0] ?? null;
            } else {
              this.schedulesList = [res.data ?? res];
              this.detailsschedule = res.data ?? res;
            }
          },
          error: (err) => {
            this.loading = false;
            this.error = 'حدث خطأ أثناء تحميل البيانات';
          }
        });
      }
    });
  }

  selectSchedule(schedule: IDoctorSchedules) {
    if (this.isAvailable(schedule)) {
      this.selectedSchedule = schedule;
    }
  }

  // ✅ هذا هو الفلتر الذي يمنع حجز أوقات غير متاحة
  isAvailable(schedule: IDoctorSchedules): boolean {
    const now = new Date();
    const slot = new Date(`${schedule.date}T${schedule.slotTime}`);
    if ((schedule as any)?.isBooked) return false;
    return slot > now;
  }

  bookNow() {
    if (!this.selectedSchedule || this.selectedType === null) {
      alert('يرجى اختيار الموعد ونوع الكشف');
      return;
    }

    const bookingData = {
      doctorId: this.doctorId,
      date: this.date,
      startTime: this.selectedSchedule.slotTime,
      appointmentType: this.selectedType
    };

    this._Booking.bookAppointment(bookingData).subscribe({
      next: (res) => {
        alert("✅ تم حجز الموعد بنجاح!");
        this._Router.navigate(['/appointment-details', res.id]); // ✅ توجيه المستخدم لصفحة تفاصيل الموعد
      },
      error: (err) => {
        console.error('❌ فشل في الحجز', err);
        alert('❌ حدث خطأ أثناء عملية الحجز.');
      }
    });
  }
}
