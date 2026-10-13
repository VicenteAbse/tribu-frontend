import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ChatWebSocketService } from '../services/chat-websocket.service';
import { AlertController, ToastController } from '@ionic/angular';
import { ChatNotification, GroupStatus, GroupSummary, PendingGroupSummary } from '../dtos/api.dto';

const GROUP_COLORS = ['#4ECDC4', '#FF6584', '#6C63FF', '#F7B731', '#A55EEA', '#FC5C65', '#26de81', '#45AAB8', '#f7797d'];

interface GroupDisplay {
  uuid: string;
  id: number;
  name: string;
  description: string;
  backgroundColor: string;
  coverImageBase64: string | null;
  role: 'admin' | 'member';
  status: GroupStatus;
  statusLabel: string;
  unreadCount: number;
}

interface PendingDisplay {
  uuid: string;
  id: number;
  name: string;
  backgroundColor: string;
  coverImageBase64: string | null;
  type: 'LIKE' | 'JOIN_REQUEST';
  typeLabel: string;
  minMembers: number;
  currentMembers: number;
  progressPercent: number;
  since: string;
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
  pendingGroups: PendingDisplay[] = [];
  isLoading = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private ws: ChatWebSocketService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.loadGroups();
    this.connectNotifications();
    this.route.queryParams.subscribe(params => {
      if (params['updated']) this.loadGroups();
    });
  }

  ngOnDestroy() {
    // no desconectamos el WS global; solo dejamos de usarlo en esta página
  }

  ionViewWillEnter() {
    // refresca la lista cuando el usuario vuelve de un chat
    this.loadGroups();
  }

  private loadGroups() {
    this.isLoading = true;
    Promise.all([
      this.api.getMyGroups().toPromise(),
      this.api.getMyPendingGroups().toPromise().catch(() => [] as PendingGroupSummary[]),
    ]).then(([summaries, pending]) => {
      const prevCounts = new Map(this.groups.map(g => [g.uuid, g.unreadCount]));
      this.groups = (summaries ?? []).map(g => ({
        ...this.toDisplay(g),
        unreadCount: prevCounts.get(g.uuid) ?? 0
      }));
      this.pendingGroups = (pending ?? []).map(p => this.toPendingDisplay(p));
      this.isLoading = false;
    }).catch(() => { this.isLoading = false; });
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

  private toPendingDisplay(p: PendingGroupSummary): PendingDisplay {
    const sinceDate = new Date(p.since + 'Z');
    const since = sinceDate.toLocaleDateString('es', { day: 'numeric', month: 'short' });
    return {
      uuid: p.uuid,
      id: p.id,
      name: p.name,
      backgroundColor: GROUP_COLORS[p.id % GROUP_COLORS.length],
      coverImageBase64: p.coverImageBase64 ?? null,
      type: p.type,
      typeLabel: p.type === 'JOIN_REQUEST' ? 'Solicitud enviada' : 'En espera de miembros',
      minMembers: p.minMembers,
      currentMembers: p.currentMembers,
      progressPercent: Math.min(100, Math.round((p.currentMembers / p.minMembers) * 100)),
      since,
    };
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
      status: g.status,
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
    return this.adminGroups.length + this.memberGroups.length + this.pendingGroups.length > 0;
  }

  openGroup(group: GroupDisplay) {
    if (group.status === 'ACTIVE') {
      group.unreadCount = 0;
      this.router.navigate(['/group-chat', group.uuid]);
    } else {
      this.router.navigate(['/group-detail', group.uuid]);
    }
  }

  goToCreateGroup() {
    this.router.navigate(['/create-group']);
  }

  openPendingDetail(p: PendingDisplay) {
    this.router.navigate(['/group-detail', p.uuid], {
      queryParams: { pendingType: p.type }
    });
  }

  async confirmRetract(p: PendingDisplay) {
    const isRequest = p.type === 'JOIN_REQUEST';
    const alert = await this.alertCtrl.create({
      header: isRequest ? 'Cancelar solicitud' : 'Retirar like',
      message: isRequest
        ? `¿Cancelar tu solicitud para unirte a "${p.name}"?`
        : `¿Retirar tu like de "${p.name}"? El grupo volverá a aparecer en el explorador.`,
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: isRequest ? 'Cancelar solicitud' : 'Retirar',
          role: 'destructive',
          handler: () => this.retract(p)
        }
      ]
    });
    await alert.present();
  }

  private retract(p: PendingDisplay) {
    this.api.retractSwipe(p.uuid).subscribe({
      next: async () => {
        this.pendingGroups = this.pendingGroups.filter(x => x.uuid !== p.uuid);
        const toast = await this.toastCtrl.create({
          message: 'Retirado correctamente.',
          duration: 2000,
          position: 'bottom',
        });
        await toast.present();
      },
      error: async () => {
        const toast = await this.toastCtrl.create({
          message: 'No se pudo retirar. Intenta de nuevo.',
          duration: 2500,
          position: 'bottom',
          color: 'danger',
        });
        await toast.present();
      }
    });
  }
}
