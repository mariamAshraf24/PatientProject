export interface IDoctor {
  id: string;
  fullName: string;
  imageUrl: string;
  specializationName: string;
  bookingPrice: number;
  address: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  schedules: Schedule[]; 
}

export interface Schedule {}

export interface DoctorProfileResponse {
  success: boolean;
  message: string;
  data: IDoctor;
  errors: any;
}
