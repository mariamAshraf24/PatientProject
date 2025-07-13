import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./features/navbar/navbar";

import { AppointmentDetails } from "./features/appointment-details/appointment-details";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, AppointmentDetails],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'PatientProject';
}
