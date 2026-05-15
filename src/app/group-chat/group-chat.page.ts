import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import { ChatMessageDto } from '../dtos/chat-message.dto';
import { ApiService } from '../services/api.service';
import { Message } from '../dtos/api.dto';

const GROUP_COLORS = ['#4ECDC4', '#FF6584', '#6C63FF', '#F7B731', '#A55EEA', '#FC5C65', '#26de81', '#45AAB8', '#f7797d'];

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.page.html',
  styleUrls: ['./group-chat.page.scss'],
  standalone: false
})
export class GroupChatPage implements OnInit, AfterViewInit {
  @ViewChild(IonContent) content!: IonContent;

  groupId!: number;
  group: { id: number; name: string; backgroundColor: string; memberCount: number } | null = null;
  messages: ChatMessageDto[] = [];
  newMessage = '';
  pinnedDismissed = false;
  errorMsg = '';

  private currentUserName = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  private loadData() {
    Promise.all([
      this.api.getMyProfile().toPromise(),
      this.api.getGroup(this.groupId).toPromise(),
      this.api.getMessages(this.groupId, 0, 50).toPromise()
    ]).then(([profile, groupDetail, page]) => {
      this.currentUserName = profile!.name;
      this.group = {
        id: groupDetail!.id,
        name: groupDetail!.name,
        backgroundColor: GROUP_COLORS[groupDetail!.id % GROUP_COLORS.length],
        memberCount: groupDetail!.members.length
      };
      this.messages = page!.content.map(m => this.toDto(m));
      this.scrollToBottom();
    }).catch((e) => {
      this.errorMsg = e?.error?.message ?? 'No se pudo cargar el chat';
      this.group = null;
    });
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
      this.router.navigate(['/group-detail', this.group.id]);
    }
  }

  sendMessage() {
    const text = this.newMessage.trim();
    if (!text) return;

    this.newMessage = '';
    this.api.sendMessage(this.groupId, { content: text }).subscribe({
      next: (msg) => {
        this.messages.push(this.toDto(msg));
        this.scrollToBottom();
      },
      error: () => {
        this.newMessage = text;
      }
    });
  }

  private scrollToBottom() {
    setTimeout(() => this.content?.scrollToBottom(300), 50);
  }
}
