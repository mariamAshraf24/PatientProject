import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserAppointments } from '../../core/services/user-appointments';
import { AppointmentNotifierService } from '../../core/services/appointment-notifier';
import { Subscription } from 'rxjs';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-user-appointment',
  templateUrl: './user-appointment.html',
  styleUrl: './user-appointment.scss',
  standalone: true,
  imports: [NgClass]
})
export class UserAppointment implements OnInit, OnDestroy {
  appointments: any[] = [];
  highlightedId: number | null = null;
  private notifierSub!: Subscription;

  constructor(
    private _appointmentService: UserAppointments,
    private _notifier: AppointmentNotifierService
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

  loadAppointments() {
    this._appointmentService.getAppointments().subscribe((res) => {
      if (res.success && res.data) {
        this.appointments = res.data.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
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
}
