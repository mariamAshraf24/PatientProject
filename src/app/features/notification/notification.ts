import { Component, OnInit } from '@angular/core';
import { PatientService } from './../../core/services/patient-service';
import { notification } from './../../core/models/INotification';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBell,
  faXmark,
  faClock,
  faCalendarDays,
  faQuestion
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.html',
  styleUrls: ['./notification.scss'],
  standalone: true,
  imports: [CommonModule, FontAwesomeModule]
})
export class Notification implements OnInit {
  allNotifications: notification[] = [];
  visibleNotifications: notification[] = [];
  notificationsPerPage = 4;
  currentPage = 0;
iconReminder = faBell;           // تذكير
iconBooking = faCalendarDays;    // حجز
iconCancel = faXmark;            // إلغاء
iconDelay = faClock;             // تأجيل
iconUnknown = faQuestion;        // غير معروف


  constructor(private _PatientService: PatientService) {}

  ngOnInit(): void {
    this._PatientService.getNotifications().subscribe((res) => {
      if (res.success) {
        this.allNotifications = res.data;
        this.loadMore();
      }
    });
  }

  loadMore(): void {
    const nextPage = this.allNotifications.slice(
      this.currentPage * this.notificationsPerPage,
      (this.currentPage + 1) * this.notificationsPerPage
    );
    this.visibleNotifications = [...this.visibleNotifications, ...nextPage];
    this.currentPage++;
  }

  getTypeLabel(type: number): string {
    switch (type) {
      case 0: return 'تذكيرك بموعد طبى';
      case 1: return 'حجز';
      case 2: return 'الغاء موعد طبى';
      case 3: return 'تأجيل موعد طبى';
      default: return 'غير معروف';
    }
  }

  getFaIcon(type: number) {
    switch (type) {
     case 0: return this.iconReminder;  // تذكير
    case 1: return this.iconBooking;   // حجز
    case 2: return this.iconCancel;    // إلغاء
    case 3: return this.iconDelay;     // تأجيل
    default: return this.iconUnknown;  // غير معروف
    }
  }
  getOldAndNewTime(message: string): { oldTime: string; newTime: string } | null {
  const regex = /من\s(.*?)\sإلى\s(.*)/;
  const match = message.match(regex);
  if (match) {
    return {
      oldTime: match[1],  // الموعد القديم
      newTime: match[2],  // الموعد الجديد
    };
  }
  return null;
}

}
