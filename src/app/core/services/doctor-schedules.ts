import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DoctorSchedulesService {
  constructor(private _httpclient:HttpClient) { }




  // getScheduleById(id: string): Observable<any> {
  //     return this._httpclient.get(`${environment.apiBaseUrl}/DoctorSchedules/${id}`);
  // }


  getScheduleByDoctorIdAndDate(doctorId: string | null , date:any): Observable<any> {
      console.log('Calling API with:', { doctorId, date });
      // استخدام الـ endpoint الصحيح مباشرة
      return this._httpclient.get(`${environment.apiBaseUrl}/DoctorSchedules/${doctorId}/slots?date=${date}`);
  }
  //slots?date=

}
