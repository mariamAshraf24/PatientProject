import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Booking {

  constructor(private _http: HttpClient) { }

  bookAppointment(data: {
    doctorId: string,
    date: string,
    startTime: string,
    appointmentType: number
  }) {
    return this._http.post<any>(`${environment.apiBaseUrl}/Booking`, data);
  }

  getBookingById(id: number) {
    return this._http.get<any>(`${environment.apiBaseUrl}/Booking/${id}`);
  }

  deleteBooking(id: number) {
    return this._http.delete(`${environment.apiBaseUrl}/Booking/${id}`);
  }
}
