import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DoctorFilter {
  constructor(
    private _httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  updateQueryParams(filters: any) {
    const queryParams = { ...filters };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
  getFiltersFromQueryParams(): any {
    const params = this.route.snapshot.queryParams;
    return {
      name: params['name'] || '',
      specializationId: params['specializationId'] || null,
      city: params['city'] || '',
      street: params['street'] || '',
      gender: params['gender'] || '',
      minPrice: params['minPrice'] || null,
      maxPrice: params['maxPrice'] || null,
      pageNumber: params['pageNumber'] || 1,
      pageSize: params['pageSize'] || 6,
    };
  }

  getDoctors(filters: any): Observable<any> {
    let params = new HttpParams()
      .set('PageNumber', filters.pageNumber || 1)
      .set('PageSize', filters.pageSize || 6);

    if (filters.name) params = params.set('Name', filters.name);
    if (filters.gender) params = params.set('Gender', filters.gender);
    if (filters.specializationId)
      params = params.set('SpecializationId', filters.specializationId);
    if (filters.city) params = params.set('City', filters.city);
    if (filters.street) params = params.set('Street', filters.street);
    if (filters.minPrice) params = params.set('MinPrice', filters.minPrice);
    if (filters.maxPrice) params = params.set('MaxPrice', filters.maxPrice);

    return this._httpClient.get(
      `${environment.apiBaseUrl}/Doctor/GetAllDoctors`,
      { params }
    );
  }

  getDoctorProfile(id: string): Observable<any> {
    return this._httpClient.get(
      `${environment.apiBaseUrl}/Doctor/doctor-profile-for-patient/${id}`
    );
  }

  getDoctorSlots(
    doctorId: string,
    date: string
  ): Observable<{ slotTime: string }[]> {
    return this._httpClient.get<{ slotTime: string }[]>(
      `${environment.apiBaseUrl}/DoctorSchedules/${doctorId}/slots?date=${date}`
    );
  }
}
