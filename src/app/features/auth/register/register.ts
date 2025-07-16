import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Auth } from './../../../core/services/auth';
import { Component, OnInit } from '@angular/core';
import { FirebaseMessaging } from '../../../core/services/firebase-messaging';
import { cities } from '../../../core/constants/cities';
import { RouterLink, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgSelectModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  selectedImage: File | null = null;
  usernameError: string = '';
  Cities = cities;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: Auth,
    private _FirebaseMessaging: FirebaseMessaging,
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
      Street: ['', [Validators.pattern(/^[\u0600-\u06FFa-zA-Z0-9\s\-]*$/)]],
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

  async registerSubmit(): Promise<void> {
    this.usernameError = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    try {
      // 1. Get FCM token
      const fcmToken =
        await this._FirebaseMessaging.requestPermissionAndGetToken();

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
      const res: any = await this._authService.register(formData).toPromise();

      if (res.isSuccess && res.token) {
        this._authService.saveToken(res.token);
        this.registerForm.reset();
        if (fcmToken) {
          try {
            await this._FirebaseMessaging
              .sendTokenToBackend(fcmToken, res.token)
              .toPromise();
            console.log('✅ FCM token sent to backend');
          } catch (error) {
            console.error('❌ Error sending FCM token:', error);
          }
        }

        alert('succesful');
        this._router.navigate(['/home']);
      } else {
        alert('حدث خطأ أثناء التسجيل');
      }
    } catch (err: any) {
      console.error('❌ Error during registration:', err);
      const message = err.error?.message;
      if (err.error?.message?.includes('Username already exists')) {
        this.usernameError = 'اسم المستخدم موجود بالفعل، يرجى اختيار اسم آخر';
        this.registerForm.get('userName')?.setErrors({ notUnique: true });
        this.registerForm.get('userName')?.markAsTouched();
      } else if (
        message?.includes('Username') &&
        message?.includes('is invalid')
      ) {
        this.usernameError =
          'اسم المستخدم غير صالح، يجب أن يحتوي فقط على حروف انجليزي أو أرقام';
        this.registerForm.get('userName')?.setErrors({ invalidFormat: true });
        this.registerForm.get('userName')?.markAsTouched();
      } 
      else if (message?.includes('Email') && message?.includes('taken')) {
        this.usernameError = 'الايميل موجود بالفعل، يرجى كتابه ايميل آخر';
        this.registerForm.get('Email')?.setErrors({ emailTaken: true });
        this.registerForm.get('Email')?.markAsTouched();
      } else {
        alert('❌ حدث خطأ أثناء التسجيل');
      }
    }
  }
}
