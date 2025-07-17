export interface IPatient {
  id: string;
  fName: string;
  lName: string;
  city: string;
  street: string;
  country: string;
  dateOfBirth: string;
  age: number;
  gender: number;
}

export interface PatientProfileResponse {
  success: boolean;
  message: string;
  data: IPatient;
  errors: null | any;
}
