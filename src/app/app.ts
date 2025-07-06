import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Register } from "./features/auth/register/register";
import { Login } from './features/auth/login/login';
import { DoctorList } from "./features/doctor-list/doctor-list";
import { UserAppointment } from "./features/user-appointment/user-appointment";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Login, DoctorList, UserAppointment],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'PatientProject';
}
