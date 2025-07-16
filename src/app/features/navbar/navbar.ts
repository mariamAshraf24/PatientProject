import { Router, RouterLink, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  constructor(private router: Router, private authService: Auth) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
