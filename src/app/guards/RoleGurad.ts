import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'];
    const actualRole = localStorage.getItem('roles');

   if (actualRole === expectedRole) {
  return true;
} else {
  this.router.navigate(['/**']); 
  return false;
}

  }
}
