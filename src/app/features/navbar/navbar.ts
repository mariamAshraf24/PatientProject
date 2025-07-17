import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../core/services/auth';
import { PatientService } from '../../core/services/patient-service';
import { IPatient } from '../../core/models/IPatient';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  showProfileDropdown = false;
  patient: IPatient | null = null;
  unreadCount = 0;

  constructor(
    private router: Router,
    private authService: Auth,
    private _patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadPatientProfile();
    this.loadUnreadNotifications();
  }

  loadPatientProfile() {
    this._patientService.getPatientProfile().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.patient = res.data;
        }
      },
      error: (err: any) => {
        console.error('فشل تحميل بيانات المريض', err);
      },
    });
  }

  loadUnreadNotifications() {
    this._patientService.getNotifications().subscribe((res) => {
      if (res.success) {
        const all = res.data;
        const readIds = this._patientService.getReadNotificationIds();
        this.unreadCount = all.filter((n) => !readIds.includes(n.id!)).length;
      }
    });
  }

  getAge(dateOfBirth: string): number {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  toggleProfileDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  @HostListener('document:click')
  closeDropdown() {
    this.showProfileDropdown = false;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
