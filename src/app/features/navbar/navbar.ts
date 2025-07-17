import { Router, RouterLink, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { PatientService } from '../../core/services/patient-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit{
  unreadCount = 0;

  constructor(
    private router: Router,
    private _patientService: PatientService,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    this._patientService.getNotifications().subscribe((res) => {
      if (res.success) {
        const all = res.data;
        const readIds = this._patientService.getReadNotificationIds();
        this.unreadCount = all.filter((n) => !readIds.includes(n.id!)).length;
      }
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
