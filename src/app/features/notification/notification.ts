import { PatientService } from './../../core/services/patient-service';
import { notification} from './../../core/models/INotification';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.html',
  styleUrl: './notification.scss'
})
export class Notification implements OnInit{
   allNotifications: notification[] = [];
   visibleNotifications: notification[] = [];
   notificationsPerPage = 15;
   currentPage = 0;

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
      case 0: return 'تذكير';
      case 1: return 'حجز';
      case 2: return 'إلغاء';
      case 3: return 'تأجيل';
      default: return 'غير معروف';
    }
  }
}
