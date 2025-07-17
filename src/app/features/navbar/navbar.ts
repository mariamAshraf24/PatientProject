import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // ضروري عشان *ngIf
import { Auth } from '../../core/services/auth';
import { PatientService } from '../../core/services/patient-service'; // تأكد من المسار الصحيح
import { IPatient } from '../../core/models/IPatient'; // تأكد من المسار الصحيح

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  standalone: true, // لو بتستخدم Angular standalone components
})
export class Navbar {
  showProfileDropdown = false;
  patient: IPatient | null = null;

  constructor(
    private router: Router,
    private authService: Auth,
    private _PatientService: PatientService
  ) {}

  ngOnInit(): void {
    this._PatientService.getPatientProfile().subscribe({
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
