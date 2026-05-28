import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ChatWebSocketService } from '../services/chat-websocket.service';
import { ChatNotification, GroupSummary } from '../dtos/api.dto';

const GROUP_COLORS = ['#4ECDC4', '#FF6584', '#6C63FF', '#F7B731', '#A55EEA', '#FC5C65', '#26de81', '#45AAB8', '#f7797d'];

interface GroupDisplay {
  uuid: string;
  id: number;
  name: string;
  description: string;
  backgroundColor: string;
  coverImageBase64: string | null;
  role: 'admin' | 'member';
  statusLabel: string;
  unreadCount: number;
}

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.page.html',
  styleUrls: ['./my-groups.page.scss'],
  standalone: false
})
export class MyGroupsPage implements OnInit, OnDestroy {
  searchQuery = '';
  groups: GroupDisplay[] = [];

  constructor(
    private router: Router,
    private api: ApiService,
    private ws: ChatWebSocketService
  ) {}

  ngOnInit() {
    this.loadGroups();
    this.connectNotifications();
  }

  ngOnDestroy() {
    // no desconectamos el WS global; solo dejamos de usarlo en esta página
  }

  ionViewWillEnter() {
    // refresca la lista cuando el usuario vuelve de un chat
    this.loadGroups();
  }

  private loadGroups() {
    this.api.getMyGroups().subscribe({
      next: (summaries) => {
        // preserva unreadCount de los grupos ya cargados
        const prevCounts = new Map(this.groups.map(g => [g.uuid, g.unreadCount]));
        this.groups = summaries.map(g => ({
          ...this.toDisplay(g),
          unreadCount: prevCounts.get(g.uuid) ?? 0
        }));
      }
    });
  }

  private async connectNotifications() {
    try {
      const profile = await this.api.getMyProfile().toPromise();
      await this.ws.connect();
      this.ws.subscribeToNotifications(profile!.uuid, (n: ChatNotification) => {
        this.onChatNotification(n);
      });
    } catch {
      // si falla el WS la app sigue funcionando en modo REST
    }
  }

  private onChatNotification(notification: ChatNotification) {
    const group = this.groups.find(g => g.uuid === notification.groupUuid);
    if (group) {
      group.unreadCount++;
      // mueve el grupo al tope de su sección
      const idx = this.groups.indexOf(group);
      this.groups.splice(idx, 1);
      this.groups.unshift(group);
    }
  }

  private toDisplay(g: GroupSummary): GroupDisplay {
    return {
      uuid: g.uuid,
      id: g.id,
      name: g.name,
      description: g.description,
      backgroundColor: GROUP_COLORS[g.id % GROUP_COLORS.length],
      coverImageBase64: g.coverImageBase64 ?? null,
      role: (g.role === 'ADMIN' || g.role === 'OWNER') ? 'admin' : 'member',
      statusLabel: g.status === 'ACTIVE' ? 'Chat activo' : 'En espera de miembros',
      unreadCount: 0
    };
  }

  private filtered(role: 'admin' | 'member'): GroupDisplay[] {
    const q = this.searchQuery.trim().toLowerCase();
    const ofRole = this.groups.filter(g => g.role === role);
    if (!q) return ofRole;
    return ofRole.filter(g =>
      g.name.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q)
    );
  }

  get adminGroups()  { return this.filtered('admin');  }
  get memberGroups() { return this.filtered('member'); }

  get hasAnyResults(): boolean {
    return this.adminGroups.length + this.memberGroups.length > 0;
  }

  openGroup(group: GroupDisplay) {
    group.unreadCount = 0;
    this.router.navigate(['/group-chat', group.uuid]);
  }

  goToCreateGroup() {
    this.router.navigate(['/create-group']);
  }
}
