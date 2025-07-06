import { Component } from '@angular/core';
import { UserAppointments } from '../../core/services/user-appointments';

@Component({
  selector: 'app-user-appointment',
  imports: [],
  templateUrl: './user-appointment.html',
  styleUrl: './user-appointment.scss'
})
export class UserAppointment {
  appointments: any[] = [];

  constructor(private _appointmentService: UserAppointments) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments() {
    this._appointmentService.getAppointments().subscribe(res => {
      if (res.success && res.data) {
        this.appointments = res.data;
      }
    });
  }
}
