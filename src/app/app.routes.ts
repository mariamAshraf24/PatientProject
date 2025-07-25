import { AppointmentDetails } from './features/appointment-details/appointment-details';
import { Routes } from '@angular/router';
import { DoctorList } from './features/doctor-list/doctor-list';
import { DoctorProfile } from './features/doctor-profile/doctor-profile';
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { Profile } from './features/profile/profile';
import { UpdateProfile } from './features/update-profile/update-profile';
import { Notification } from './features/notification/notification';
import { UserAppointment } from './features/user-appointment/user-appointment';
import { NotFound } from './features/not-found/not-found';
import { Component } from '@angular/core';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: DoctorList },
  { path: 'doctorProfile/:id', component: DoctorProfile },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile },
  { path: 'userAppointment', component: UserAppointment},
  { path:  'appointmentDetails/:id', component: AppointmentDetails},
  { path: 'update-profile', component: UpdateProfile },
  { path: 'notification', component: Notification },
  {path : 'forget' , component : ForgotPassword},
  { path: '**', component: NotFound }
];
