import { Routes } from '@angular/router';
import { DoctorList } from './features/doctor-list/doctor-list';
import { DoctorProfile } from './features/doctor-profile/doctor-profile';
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { Profile } from './features/profile/profile';
import { UpdateProfile } from './features/update-profile/update-profile';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: DoctorList }, // Home page = doctor list
  { path: 'doctorProfile/:id', component: DoctorProfile },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile },
  { path: 'update-profile', component: UpdateProfile },
];
