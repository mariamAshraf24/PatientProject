// appointment-notifier.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppointmentNotifierService {
  private newAppointmentSubject = new Subject<number>();
  newAppointment$ = this.newAppointmentSubject.asObservable();

  notifyNewAppointment(appointmentId: number) {
    this.newAppointmentSubject.next(appointmentId);
  }
}
