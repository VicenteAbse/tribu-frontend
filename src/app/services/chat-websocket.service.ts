import { Injectable } from '@angular/core';
import { Client, StompSubscription } from '@stomp/stompjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { ChatNotification, Message } from '../dtos/api.dto';

@Injectable({ providedIn: 'root' })
export class ChatWebSocketService {
  private client: Client;
  private connectPromise: Promise<void> | null = null;
  private groupSub: StompSubscription | null = null;
  private notifSub: StompSubscription | null = null;

  constructor(private authService: AuthService) {
    this.client = new Client({
      brokerURL: environment.wsUrl,
      reconnectDelay: 5000,
    });
  }

  connect(): Promise<void> {
    if (this.client.connected) return Promise.resolve();
    if (this.connectPromise) return this.connectPromise;

    this.connectPromise = new Promise<void>((resolve, reject) => {
      this.client.connectHeaders = {
        Authorization: `Bearer ${this.authService.getToken()}`
      };
      this.client.onConnect = () => resolve();
      this.client.onStompError = (frame) => {
        this.connectPromise = null;
        reject(new Error(frame.headers['message'] || 'WebSocket error'));
      };
      this.client.onDisconnect = () => {
        this.connectPromise = null;
      };
      this.client.activate();
    });

    return this.connectPromise;
  }

  subscribeToGroup(groupUuid: string, onMessage: (msg: Message) => void): void {
    this.groupSub?.unsubscribe();
    this.groupSub = this.client.subscribe(
      `/topic/group/${groupUuid}`,
      (frame) => onMessage(JSON.parse(frame.body))
    );
  }

  subscribeToNotifications(userUuid: string, onNotification: (n: ChatNotification) => void): void {
    this.notifSub?.unsubscribe();
    this.notifSub = this.client.subscribe(
      `/topic/user/${userUuid}/notifications`,
      (frame) => onNotification(JSON.parse(frame.body))
    );
  }

  sendMessage(groupUuid: string, content: string): void {
    this.client.publish({
      destination: `/app/group/${groupUuid}/message`,
      body: JSON.stringify({ content })
    });
  }

  unsubscribeFromGroup(): void {
    this.groupSub?.unsubscribe();
    this.groupSub = null;
  }

  disconnect(): void {
    this.groupSub?.unsubscribe();
    this.notifSub?.unsubscribe();
    this.client.deactivate();
    this.connectPromise = null;
  }
}
