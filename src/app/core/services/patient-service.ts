import { NotificationResponse } from './../models/INotification';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PatientProfileResponse } from '../models/IPatient';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class PatientService {
  constructor(private _HttpClient: HttpClient) {}

  getPatientProfile(): Observable<PatientProfileResponse> {
    return this._HttpClient.get<PatientProfileResponse>(
      `${environment.apiBaseUrl}/Patient/patient-profile`
    );
  }

  updatePatientProfile(data: any): Observable<any> {
    return this._HttpClient.put(
      `${environment.apiBaseUrl}/Patient/update-patient-profile`,
      data
    );
  }

  getNotifications(): Observable<NotificationResponse> {
    return this._HttpClient.get<NotificationResponse>(
      `${environment.apiBaseUrl}/Patient/Get Notifications`
    );
  }
}
