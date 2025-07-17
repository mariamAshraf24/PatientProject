import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { cities } from './../../core/constants/cities'; // عدّل المسار حسب مكان الملف
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-doctor-list',
  imports: [FormsModule , RouterLink],
  templateUrl: './doctor-list.html',
  styleUrl: './doctor-list.scss'
})
export class DoctorList {
 
  doctors: any[] = [];
  specializations: any[] = [];
  cities: string[] = cities;
  citySuggestions: string[] = [];
  filters = {
    specializationId: '',
    gender: '',
    minPrice: '',
    maxPrice: '',
    name: '',
    city: '',
    street: '',
    pageNumber: 1,
    pageSize: 6
  };
  totalPages: number = 0;

  todayDate = new Date().toISOString().split('T')[0];
  
  
  constructor(private _HttpClient: HttpClient) { }

  ngOnInit(): void {
    this.getDoctors();
    this.getSpecializations();
  }
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getSpecializations() {
    this._HttpClient.get<any>('https://nazzem.runasp.net/api/Specializations')
      .subscribe(res => {
        this.specializations = res.data;
      });
  }
  getDoctors() {
    let params = new HttpParams();
    for (let key in this.filters) {
      if (this.filters[key as keyof typeof this.filters]) {
        params = params.set(key, this.filters[key as keyof typeof this.filters]);
      }
    }
    this._HttpClient.get<any>('https://nazzem.runasp.net/api/Doctor/GetAllDoctors', { params })
      .subscribe(res => {
        this.doctors = res.items;
        this.totalPages = res.totalPages;
      });
  }

  onFilterChange() {
    this.filters.pageNumber = 1;
    this.getDoctors();
  }

  changePage(page: number) {
    this.filters.pageNumber = page;
    this.getDoctors();
  }
  suggestCity(input: string) {
    this.citySuggestions = this.cities.filter(city =>
      city.toLowerCase().includes(input.toLowerCase())
    );
  }

}
