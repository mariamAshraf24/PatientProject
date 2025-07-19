import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { initializeApp } from 'firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
} from 'firebase/messaging';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseMessaging {
  private messaging: Messaging;

  constructor(private http: HttpClient) {
    const app = initializeApp(environment.firebase);
    this.messaging = getMessaging(app);
    this.registerServiceWorker();
  }
  
  private registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration);
        })
        .catch((err) => {
          console.error('❌ Service Worker registration failed:', err);
        });
    }
  }

  async requestPermissionAndGetToken(): Promise<string | null> {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('📛 لم يتم منح الإذن بالإشعارات');
        return null;
      }

      const token = await getToken(this.messaging, {
        vapidKey:
          'BPpmjXX-HyVXu5ett5T_JpXrWR4WhwE9MLx6913LCWDyXusC8jOS6T48GKCrSWp2C4Tou0kx4RRIjGf3cU8ab1M',
      });

      return token;
    } catch (error) {
      console.error('❌ خطأ في الحصول على FCM Token:', error);
      return null;
    }
  }

  sendTokenToBackend(token: string, authToken: string) {
    return this.http.post(
      `${environment.apiBaseUrl}/Notifications`,
      { deviceToken: token },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  }

  listenForMessages() {
    onMessage(this.messaging, (payload) => {
      console.log('📩 تم استقبال رسالة:', payload);
      // يمكنك عرض إشعار أو تحديث UI هنا
    });
  }
}
