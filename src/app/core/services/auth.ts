import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private tokenKey = 'token';

  constructor(private _HttpClient: HttpClient) { }

  register(data: any): Observable<any> {
    return this._HttpClient.post(
      `${environment.apiBaseUrl}/Auth/register`,
      data
    );
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
  login(data: any): Observable<any> {
    return this._HttpClient.post(`${environment.apiBaseUrl}/Auth/login`, data);
  }
  forgotPassword(email: string) {
    return this._HttpClient.post(
      `${environment.apiBaseUrl}/Auth/forgot-password`,
      { email },
      { responseType: 'text' as 'json' }
    );
  }

  resetPassword(data: { token: string; newPassword: string }) {
    return this._HttpClient.post(
      `${environment.apiBaseUrl}/Auth/reset-password`,
      data,
      { responseType: 'text' as 'json' }
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }
  isPatient(): boolean {
    return localStorage.getItem('roles') === 'Patient';
  }

}
