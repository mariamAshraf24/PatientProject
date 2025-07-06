import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PatientProfileResponse } from '../models/IPatient';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private _HttpClient: HttpClient) { }

  getPatientProfile(): Observable<PatientProfileResponse> {
    return this._HttpClient.get<PatientProfileResponse>(
      `${environment.apiBaseUrl}/Patient/patient-profile`
    );
  }
}
