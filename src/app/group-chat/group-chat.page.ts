import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import { ChatMessageDto } from '../dtos/chat-message.dto';
import { ApiService } from '../services/api.service';
import { ChatWebSocketService } from '../services/chat-websocket.service';
import { Message } from '../dtos/api.dto';

const GROUP_COLORS = ['#4ECDC4', '#FF6584', '#6C63FF', '#F7B731', '#A55EEA', '#FC5C65', '#26de81', '#45AAB8', '#f7797d'];

interface GroupInfo {
  id: number;
  uuid: string;
  name: string;
  backgroundColor: string;
  coverImageBase64: string | null;
  memberCount: number;
}

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.page.html',
  styleUrls: ['./group-chat.page.scss'],
  standalone: false
})
export class GroupChatPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(IonContent) content!: IonContent;

  groupUuid!: string;
  group: GroupInfo | null = null;
  isLoading = true;
  messages: ChatMessageDto[] = [];
  newMessage = '';
  pinnedDismissed = false;
  errorMsg = '';

  private currentUserName = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private api: ApiService,
    private ws: ChatWebSocketService
  ) {}

  ngOnInit() {
    this.groupUuid = this.route.snapshot.paramMap.get('id')!;
    this.loadData();
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    this.ws.unsubscribeFromGroup();
  }

  private async loadData() {
    this.isLoading = true;
    try {
      const [profile, groupDetail, page] = await Promise.all([
        this.api.getMyProfile().toPromise(),
        this.api.getGroup(this.groupUuid).toPromise(),
        this.api.getMessages(this.groupUuid, 0, 50).toPromise()
      ]);

      this.currentUserName = profile!.name;
      this.group = {
        id: groupDetail!.id,
        uuid: groupDetail!.uuid,
        name: groupDetail!.name,
        backgroundColor: GROUP_COLORS[groupDetail!.id % GROUP_COLORS.length],
        coverImageBase64: groupDetail!.coverImageBase64 ?? null,
        memberCount: groupDetail!.members.length
      };
      this.messages = page!.content.map(m => this.toDto(m));
      this.isLoading = false;
      this.scrollToBottom();

      // conectar WebSocket y suscribirse al topic del grupo
      await this.ws.connect();
      this.ws.subscribeToGroup(this.groupUuid, (msg) => this.onNewMessage(msg));
    } catch (e: any) {
      this.errorMsg = e?.error?.message ?? 'No se pudo cargar el chat';
      this.isLoading = false;
    }
  }

  private onNewMessage(msg: Message) {
    const dto = this.toDto(msg);
    // evitar duplicados si el mismo mensaje ya está en la lista
    if (!this.messages.some(m => m.id === dto.id)) {
      this.messages.push(dto);
      this.scrollToBottom();
    }
  }

  private toDto(m: Message): ChatMessageDto {
    const date = new Date(m.sentAt);
    return {
      id: m.id,
      senderId: m.senderId,
      senderName: m.senderName,
      text: m.content,
      time: date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
      isOwn: m.senderName === this.currentUserName
    };
  }

  get textMessages(): ChatMessageDto[] {
    return this.messages.filter(m => m.type !== 'event');
  }

  get pinnedEvent(): ChatMessageDto | null {
    if (this.pinnedDismissed) return null;
    const events = this.messages.filter(m => m.type === 'event');
    return events.length > 0 ? events[events.length - 1] : null;
  }

  goBack() {
    this.navCtrl.back();
  }

  goToGroupDetail() {
    if (this.group) {
      this.router.navigate(['/group-detail', this.groupUuid]);
    }
  }

  sendMessage() {
    const text = this.newMessage.trim();
    if (!text) return;

    this.newMessage = '';
    // envía vía WebSocket; el mensaje vuelve por la suscripción al topic del grupo
    this.ws.sendMessage(this.groupUuid, text);
  }

  private scrollToBottom() {
    setTimeout(() => this.content?.scrollToBottom(300), 50);
  }
}
