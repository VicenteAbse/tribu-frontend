import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { ApiService } from './api.service';

export type PushNotificationType =
  | 'chat'
  | 'new_member'
  | 'group_status'
  | 'event'
  | 'join_request';

export interface PushNotificationData {
  type: PushNotificationType;
  groupId?: string;
}

@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  constructor(private api: ApiService, private router: Router) {}

  async initialize(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;

    const permission = await PushNotifications.requestPermissions();
    if (permission.receive !== 'granted') return;

    await PushNotifications.register();
    this.registerListeners();
  }

  async unregister(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    this.api.removeFcmToken().subscribe();
    await PushNotifications.removeAllListeners();
  }

  private registerListeners(): void {
    PushNotifications.addListener('registration', (token: Token) => {
      this.api.registerFcmToken(token.value).subscribe();
    });

    PushNotifications.addListener('registrationError', () => {
      // silencioso — la app funciona sin push
    });

    // notificación recibida con app en primer plano (solo muestra badge/toast si se quiere)
    PushNotifications.addListener('pushNotificationReceived', () => {});

    // usuario tocó la notificación
    PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
      const data = action.notification.data as PushNotificationData;
      this.navigateFromPush(data);
    });
  }

  private navigateFromPush(data: PushNotificationData): void {
    if (!data?.type) return;

    switch (data.type) {
      case 'chat':
        if (data.groupId) this.router.navigate(['/group-chat', data.groupId]);
        break;
      case 'new_member':
      case 'group_status':
      case 'event':
        if (data.groupId) this.router.navigate(['/group-detail', data.groupId]);
        break;
      case 'join_request':
        if (data.groupId) this.router.navigate(['/group-admin', data.groupId]);
        break;
    }
  }
}
