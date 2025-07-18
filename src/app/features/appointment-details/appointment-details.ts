import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState
} from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { CommonModule, DatePipe } from '@angular/common';
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [DatePipe, CommonModule, Footer],
  templateUrl: './appointment-details.html',
  styleUrl: './appointment-details.scss'
})
export class AppointmentDetails implements OnInit, OnDestroy {
  appointmentId!: number;
  appointment: any;
  updatedTurnNumber: number | null = null;
  pendingTurnNumber: number | null = null;
  hubConnection!: HubConnection;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private _http: HttpClient,
    private ngZone: NgZone,
    private _router: Router,

  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || isNaN(Number(idParam))) {
      console.error('Invalid appointment ID');
      return;
    }

    this.appointmentId = Number(idParam);
    this.startSignalR();
    this.getAppointment();
  }

  ngOnDestroy(): void {
    if (
      this.hubConnection &&
      this.hubConnection.state === HubConnectionState.Connected
    ) {
      this.hubConnection
        .invoke('LeaveAppointmentGroup', this.appointmentId.toString())
        .then(() => console.log('Left group: appointment-' + this.appointmentId))
        .catch((err) => console.error('Error leaving group', err));
    }
  }

  getAppointment() {
    if (!this.appointmentId) return;

    this._http.get(`${environment.apiBaseUrl}/Booking/${this.appointmentId}`).subscribe({
      next: (res) => {
        this.appointment = res;
        console.log('Appointment Loaded:', this.appointment);

        if (
          this.pendingTurnNumber !== null &&
          this.pendingTurnNumber !== this.appointment?.turnNumber
        ) {
          this.ngZone.run(() => {
            this.updatedTurnNumber = this.pendingTurnNumber;
            this.appointment.turnNumber = this.pendingTurnNumber;
            this.pendingTurnNumber = null;
          });
        }
      },
      error: (err) => console.error('Error loading appointment', err)
    });
  }

  startSignalR() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.signalRHubUrl
        }`, {
        accessTokenFactory: () => localStorage.getItem('token') || ''
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Connected');

        this.hubConnection
          .invoke('JoinAppointmentGroup', this.appointmentId)
          .then(() => console.log('Joined group: appointment-' + this.appointmentId))
          .catch((err) => console.error('Error joining group', err));
      })
      .catch((err) => console.error('SignalR connection error', err));

    this.hubConnection.on('ReceiveTurnUpdate', (newTurn: number) => {
      console.log('🔄 Received Turn Update:', newTurn);

      this.ngZone.run(() => {
        if (this.appointment) {
          if (newTurn !== this.appointment.turnNumber) {
            this.updatedTurnNumber = newTurn;
            this.appointment.turnNumber = newTurn;
          }
        } else {
          this.pendingTurnNumber = newTurn;
        }
      });
    });
  }

  cancelBooking() {
    const confirmed = confirm('هل أنت متأكد أنك تريد إلغاء هذا الحجز؟');
    if (!confirmed || !this.appointment?.id) return;

    this._http
      .delete(`${environment.apiBaseUrl}/Booking/${this.appointment.id}`)
      .subscribe({
        next: () => {
          this.successMessage = 'تم إلغاء الحجز بنجاح.';
          this.errorMessage = null;
          setTimeout(() => {
            const doctorId = this.appointment?.doctorId;
            if (doctorId) {
              this._router.navigate(['/doctorProfile', doctorId]);
            } else {
              this._router.navigate(['/home']);
            }
          }, 2000);
        },
        error: (err) => {
          console.error('فشل في إلغاء الحجز', err);
        this.errorMessage = 'حدث خطأ أثناء محاولة إلغاء الحجز.';
        this.successMessage = null;
        }
      });
  }


  getAppointmentTypeArabic(type: string): string {
    switch (type?.toLowerCase()) {
      case 'checkup':
        return 'كشف';
      case 'followup':
        return 'إعادة';
      default:
        return type || '—';
    }
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
  getStatusInArabic(status: string | null | undefined): string {
    if (!status) return '—';

    const statusMap: Record<string, string> = {
      Confirmed: 'تم التأكيد',
      Delayed: 'مؤجل',
      Completed: 'مكتمل',
      Canceled: 'ملغي',
      missed: 'لم يحضر'
    };

    return statusMap[status] || status;
  }



}
