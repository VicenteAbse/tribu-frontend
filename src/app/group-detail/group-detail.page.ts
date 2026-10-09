import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UserProfileModalComponent } from '../user-profile-modal/user-profile-modal.component';
import { GroupEvent, GroupMember, GroupMemberRole, GroupStatus } from '../dtos/api.dto';

const GROUP_COLORS = ['#4ECDC4', '#FF6584', '#6C63FF', '#F7B731', '#A55EEA', '#FC5C65', '#26de81', '#45AAB8', '#f7797d'];

const CATEGORY_LABELS: Record<string, string> = {
  DEPORTES: 'Deportes', ARTE: 'Arte', CULTURA: 'Cultura',
  TECNOLOGIA: 'Tecnología', MUSICA: 'Música', GASTRONOMIA: 'Gastronomía'
};

interface MemberDisplay {
  id: number;
  uuid: string;
  name: string;
  initials: string;
  role: 'admin' | 'member';
}

interface EventDisplay {
  id: number;
  title: string;
  date: string;
  location: string;
  isPast: boolean;
}

interface GroupDisplay {
  uuid: string;
  id: number;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  minMembers: number;
  distanceKm: number | null;
  backgroundColor: string;
  coverImageBase64: string | null;
  createdBy: string;
  status: GroupStatus;
  myRole: GroupMemberRole | null;
  members: MemberDisplay[];
  events: EventDisplay[];
}

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.page.html',
  styleUrls: ['./group-detail.page.scss'],
  standalone: false
})
export class GroupDetailPage implements OnInit {
  group: GroupDisplay | null = null;
  isAdmin = false;
  isMember = false;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private api: ApiService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    const uuid = this.route.snapshot.paramMap.get('id')!;
    this.loadData(uuid);
  }

  private loadData(uuid: string) {
    Promise.all([
      this.api.getMyProfile().toPromise(),
      this.api.getGroup(uuid).toPromise(),
    ]).then(async ([profile, detail]) => {
      const myMembership = detail!.members.find(m => m.userUuid === profile!.uuid);
      const isMember = !!myMembership;
      const events: GroupEvent[] = isMember
        ? await this.api.getGroupEvents(uuid).toPromise().catch(() => []) as GroupEvent[]
        : [];

      this.isMember = isMember;
      this.isAdmin = myMembership?.role === 'ADMIN' || myMembership?.role === 'OWNER';

      this.group = {
        uuid: detail!.uuid,
        id: detail!.id,
        name: detail!.name,
        description: detail!.description,
        category: CATEGORY_LABELS[detail!.category ?? ''] ?? (detail!.category ?? ''),
        memberCount: detail!.members.length,
        minMembers: detail!.minMembers,
        distanceKm: detail!.distanceKm,
        backgroundColor: GROUP_COLORS[detail!.id % GROUP_COLORS.length],
        coverImageBase64: detail!.coverImageBase64 ?? null,
        createdBy: detail!.creatorName,
        status: detail!.status,
        myRole: myMembership?.role ?? null,
        members: detail!.members.map(m => this.toMemberDisplay(m)),
        events: (events as GroupEvent[] ?? []).map(e => this.toEventDisplay(e))
      };
      this.isLoading = false;
    }).catch(() => {
      this.group = null;
      this.isLoading = false;
    });
  }

  private toMemberDisplay(m: GroupMember): MemberDisplay {
    const parts = m.name.trim().split(' ');
    const initials = parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : m.name.substring(0, 2).toUpperCase();
    return { id: m.id, uuid: m.userUuid, name: m.name, initials, role: m.role === 'ADMIN' ? 'admin' : 'member' };
  }

  private toEventDisplay(e: GroupEvent): EventDisplay {
    const date = new Date(e.eventDate);
    return {
      id: e.id,
      title: e.title,
      date: date.toLocaleString('es', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      location: e.location,
      isPast: date < new Date()
    };
  }

  get upcomingEvents(): EventDisplay[] {
    return this.group?.events.filter(e => !e.isPast) ?? [];
  }

  get currentMembers(): number {
    if (!this.group) return 0;
    // likesCount + 1 (el creador) = miembros actuales, pero ya tenemos members[]
    return this.group.memberCount;
  }

  get membersNeeded(): number {
    if (!this.group) return 0;
    return Math.max(0, this.group.minMembers - this.group.memberCount);
  }

  get progressPercent(): number {
    if (!this.group || this.group.minMembers === 0) return 0;
    return Math.min(100, Math.round((this.group.memberCount / this.group.minMembers) * 100));
  }

  get isOwner(): boolean { return this.group?.myRole === 'OWNER'; }

  async confirmDelete() {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar grupo',
      message: '¿Estás seguro? Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.deleteGroup()
        }
      ]
    });
    await alert.present();
  }

  private async deleteGroup() {
    const toast = await this.toastCtrl.create({
      message: 'La eliminación de grupos estará disponible próximamente.',
      duration: 2500,
      position: 'bottom'
    });
    await toast.present();
  }

  goBack()    { this.navCtrl.back(); }

  async openUserProfile(uuid: string) {
    const modal = await this.modalCtrl.create({
      component: UserProfileModalComponent,
      componentProps: { userUuid: uuid },
      cssClass: 'user-profile-modal',
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });
    await modal.present();
  }
  goToAdmin() { if (this.group) this.router.navigate(['/group-admin', this.group.uuid]); }
  goToChat()  { if (this.group) this.router.navigate(['/group-chat',  this.group.uuid]); }
}
