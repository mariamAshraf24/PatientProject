import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserAppointments } from '../../core/services/user-appointments';
import { AppointmentNotifierService } from '../../core/services/appointment-notifier';
import { Subscription } from 'rxjs';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router'; // ✅ استيراد Router
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-appointment',
  templateUrl: './user-appointment.html',
  styleUrl: './user-appointment.scss',
  standalone: true,
  imports: [NgClass, FormsModule]
})
export class UserAppointment implements OnInit, OnDestroy {
  appointments: any[] = [];
  highlightedId: number | null = null;
  private notifierSub!: Subscription;
  searchTerm: string = '';
  selectedFilter: string = 'الكل';
  selectedStatus: string | null = null;
  selectedStat: string = 'all';

  selectStatus(status: string | null) {
    this.selectedStatus = status;
  }

  selectFilter(filter: string) {
    this.selectedFilter = filter;
  }

  // قائمة الحالات الممكنة من الـ API
  statusOptions = [
    { key: null, label: 'الكل' },
    { key: 'confirmed', label: 'قادمة' },
    { key: 'completed', label: 'مكتملة' },
    { key: 'canceled', label: 'ملغاة' },
    { key: 'delayed', label: 'مؤجلة' },
    { key: 'missed', label: 'لم يحضر' },
  ];

  // دالة تحويل رقم الحالة إلى نص عربي
  getStatusArabicFromNumber(statusNum: number): string {
    switch (statusNum) {
      case 0: return 'قادمة'; // Confirmed
      case 1: return 'مؤجلة'; // Delayed
      case 2: return 'مكتملة'; // Completed
      case 3: return 'ملغاة'; // Canceled
      case 4: return 'لم يحضر'; // missed
      default: return 'غير معروف';
    }
  }

  // عدادات حسب رقم الحالة
  get countUpcoming() {
    return this.appointments?.filter(a => a.appointmantStatus === 0)?.length || 0;
  }
  get countPostponed() {
    return this.appointments?.filter(a => a.appointmantStatus === 1)?.length || 0;
  }
  get countCompleted() {
    return this.appointments?.filter(a => a.appointmantStatus === 2)?.length || 0;
  }
  get countCancelled() {
    return this.appointments?.filter(a => a.appointmantStatus === 3)?.length || 0;
  }
  get countNoShow() {
    return this.appointments?.filter(a => a.appointmantStatus === 4)?.length || 0;
  }

  // فلترة حسب رقم الحالة
  get filteredAppointments() {
    let filtered = this.appointments;
    if (this.searchTerm) {
      filtered = filtered.filter(a =>
        (a.doctorName && a.doctorName.includes(this.searchTerm))
      );
    }
    const today = new Date();
    if (this.selectedFilter === 'اليوم') {
      filtered = filtered.filter(a => new Date(a.date).toDateString() === today.toDateString());
    } else if (this.selectedFilter === 'الأسبوع') {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      filtered = filtered.filter(a => {
        const d = new Date(a.date);
        return d >= weekStart && d <= weekEnd;
      });
    } else if (this.selectedFilter === 'الشهر') {
      filtered = filtered.filter(a => new Date(a.date).getMonth() === today.getMonth());
    }
    if (this.selectedStatus !== null) {
      filtered = filtered.filter(a => this.getStatusArabicFromNumber(a.appointmantStatus) === this.selectedStatus);
    }
    return filtered;
  }

  // أضف دالة مساعدة لإرجاع مفتاح الحالة الإنجليزي
  getStatusKey(status: string): string {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'حجز قادم':
      case 'قادم':
        return 'confirmed';
      case 'delayed':
      case 'مؤجل':
        return 'delayed';
      case 'completed':
      case 'مكتمل':
        return 'completed';
      case 'canceled':
      case 'ملغي':
        return 'canceled';
      case 'missed':
      case 'لم يحضر':
        return 'missed';
      default:
        return status?.toLowerCase() || '';
    }
  }

  // ترجمة الحالة للعربية للعرض فقط
  getStatusArabic(status: string): string {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'قادمة';
      case 'delayed':
        return 'مؤجلة';
      case 'completed':
        return 'مكتملة';
      case 'canceled':
        return 'ملغاة';
      case 'missed':
        return 'لم يحضر';
      default:
        return status || '';
    }
  }

  getStatusBadgeClass(statusNum: number): string {
    switch (statusNum) {
      case 0: return 'badge-upcoming';   // قادمة
      case 1: return 'badge-delayed';    // مؤجلة
      case 2: return 'badge-completed';  // مكتملة
      case 3: return 'badge-canceled';   // ملغاة
      case 4: return 'badge-missed';     // لم يحضر
      default: return 'badge-unknown';
    }
  }
  getStatusIcon(statusNum: number): string {
    switch (statusNum) {
      case 0: return 'fa-calendar-check'; // قادمة
      case 1: return 'fa-hourglass-half'; // مؤجلة
      case 2: return 'fa-check-circle';   // مكتملة
      case 3: return 'fa-times-circle';   // ملغاة
      case 4: return 'fa-user-slash';     // لم يحضر
      default: return 'fa-question-circle';
    }
  }

  getAppointmentTypeText(typeNum: number): string {
    switch (typeNum) {
      case 0: return 'كشف';
      case 1: return 'متابعة';
      default: return 'غير معروف';
    }
  }

  constructor(
    private _appointmentService: UserAppointments,
    private _notifier: AppointmentNotifierService,
    private _router: Router // ✅ إضافة Router هنا
  ) {}

  ngOnInit(): void {
    this.loadAppointments();

    this.notifierSub = this._notifier.newAppointment$.subscribe((newId) => {
      this.highlightedId = newId;
      this.loadAppointments();

      setTimeout(() => {
        this.highlightedId = null;
      }, 5000);
    });
  }

  ngOnDestroy(): void {
    this.notifierSub?.unsubscribe();
  }

  // عدل loadAppointments لإبقاء status كما هو من الـ API
  loadAppointments() {
    this._appointmentService.getAppointments().subscribe((res) => {
      if (res.success && res.data) {
        this.appointments = res.data.sort(
          (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        if (this.appointments.length > 0) {
          console.log('أول عنصر من المواعيد:', this.appointments[0]);
        }
      }
    });
  }

  getFormattedTime(timeStr: string): string {
    if (!timeStr) return '—';
    const date = new Date(`1970-01-01T${timeStr}`);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  getFormattedDate(dateStr: string): string {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // ✅ دالة فتح صفحة تفاصيل الحجز
  goToDetails(id: number) {
    if (id) {
      this._router.navigate(['/appointmentDetails', id]);
    }
  }
}