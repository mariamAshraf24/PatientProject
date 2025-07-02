import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Auth } from './../../../core/services/auth';
import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})

export class Register {
  registerForm!: FormGroup;
  selectedImage: File | null = null;
  usernameError: string = '';

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: Auth,
    private _router: Router
  ) {}
  
  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      Email: [null, [Validators.required, Validators.email]],
      Password: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/),
        ],
      ],
      Role: ['Patient'],
      userName: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z\u0600-\u06FF0-9]*$/),
        ],
      ],
      FName: [
        null,
        [Validators.required, Validators.pattern(/^[\u0600-\u06FFa-zA-Z ]+$/)],
      ],
      LName: [
        null,
        [Validators.required, Validators.pattern(/^[\u0600-\u06FFa-zA-Z ]+$/)],
      ],
      City: [''],
      Street: [
        '',
        [
          Validators.pattern(/^[\u0600-\u06FFa-zA-Z0-9\s\-]*$/),
        ],
      ],
      Country: ['مصر'],
      DateOfBirth: [null, [Validators.required]],
      gender: [null, Validators.required],
      Phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(010|011|012|015)[0-9]{8}$/),
        ],
      ],
      LicenceNumber: [''],
      SpecializationId: [],
      BookingPrice: [],
      ImageFile: [],
    });
  }

  registerSubmit(): void {
    this.usernameError = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const formData = new FormData();

    Object.keys(this.registerForm.value).forEach((key) => {
    const value = this.registerForm.get(key)?.value;

    if (key === 'DateOfBirth' && value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        formData.append(key, date.toISOString());
      }
    } else {
      formData.append(key, value ?? '');
    }
  });

    // const formData = this.registerForm.value;
    this._authService.register(formData).subscribe({
      next: (res: any) => {
        if (res.isSuccess && res.token) {
          this._authService.saveToken(res.token);
          this.registerForm.reset();
          alert('succesful');
          // this._router.navigate(['/home']);
        } else {
          alert('حدث خطأ أثناء التسجيل');
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        if (err.error?.message?.includes('Username already exists')) {
          this.usernameError = 'اسم المستخدم موجود بالفعل، يرجى اختيار اسم آخر';
          this.registerForm.get('userName')?.setErrors({ notUnique: true });
          this.registerForm.get('userName')?.markAsTouched();
        }
        // alert('حدث خطأ أثناء التسجيل');
      },
    });
  }

}