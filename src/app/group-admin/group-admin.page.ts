import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { GroupEvent, GroupMember, JoinRequest } from '../dtos/api.dto';
import { GroupEventDto } from '../dtos/group-event.dto';
import { JoinRequestDto } from '../dtos/join-request.dto';
import { GroupMemberDto } from '../dtos/group-detail.dto';

const GROUP_COLORS = ['#4ECDC4', '#FF6584', '#6C63FF', '#F7B731', '#A55EEA', '#FC5C65', '#26de81', '#45AAB8', '#f7797d'];

const CATEGORY_LABELS: Record<string, string> = {
  DEPORTES: 'Deportes', ARTE: 'Arte', CULTURA: 'Cultura',
  TECNOLOGIA: 'Tecnología', MUSICA: 'Música', GASTRONOMIA: 'Gastronomía'
};

interface AdminGroupData {
  id: number;
  name: string;
  backgroundColor: string;
  viewerRole: 'creator' | 'admin';
  joinPolicy: 'open' | 'approval';
  description: string;
  category: string;
}

@Component({
  selector: 'app-group-admin',
  templateUrl: './group-admin.page.html',
  styleUrls: ['./group-admin.page.scss'],
  standalone: false
})
export class GroupAdminPage implements OnInit {
  group: AdminGroupData | null = null;
  activeSegment = 'members';

  members: GroupMemberDto[] = [];
  pendingRequests: JoinRequestDto[] = [];
  events: GroupEventDto[] = [];

  showEventForm = false;
  eventForm: FormGroup;
  editForm: FormGroup;
  editImageSlots: (string | null)[] = [null, null, null];

  readonly categories = ['Deportes', 'Arte', 'Cultura', 'Tecnología', 'Música', 'Gastronomía'];

  readonly joinPolicies: { value: 'open' | 'approval'; label: string; sub: string; icon: string }[] = [
    { value: 'open',     label: 'Acceso libre',    sub: 'Cualquiera que da like se une directamente.',        icon: 'flash-outline' },
    { value: 'approval', label: 'Con aprobación',  sub: 'Un admin debe aprobar cada solicitud de ingreso.',   icon: 'shield-checkmark-outline' }
  ];

  get segments() {
    return [
      { value: 'members', label: 'Miembros', badge: this.pendingRequests.length },
      { value: 'events',  label: 'Eventos',  badge: 0 },
      { value: 'edit',    label: 'Editar',   badge: 0 }
    ];
  }

  get upcomingEvents(): GroupEventDto[] { return this.events.filter(e => !e.isPast); }
  get pastEvents():     GroupEventDto[] { return this.events.filter(e =>  e.isPast); }

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private fb: FormBuilder,
    private api: ApiService
  ) {
    this.eventForm = this.fb.group({
      title:       ['', Validators.required],
      description: [''],
      eventDate:   ['', Validators.required],
      location:    ['']
    });

    this.editForm = this.fb.group({
      name:        ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
      category:    ['', Validators.required],
      joinPolicy:  ['open', Validators.required]
    });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    Promise.all([
      this.api.getGroup(id).toPromise(),
      this.api.getGroupEvents(id).toPromise().catch(() => [] as GroupEvent[]),
      this.api.getJoinRequests(id).toPromise().catch(() => [] as JoinRequest[])
    ]).then(([detail, events, requests]) => {
      if (!detail) { this.navCtrl.back(); return; }

      this.group = {
        id: detail.id,
        name: detail.name,
        backgroundColor: GROUP_COLORS[detail.id % GROUP_COLORS.length],
        viewerRole: 'admin',
        joinPolicy: detail.joinPolicy === 'OPEN' ? 'open' : 'approval',
        description: detail.description,
        category: CATEGORY_LABELS[detail.category ?? ''] ?? (detail.category ?? '')
      };

      this.members = detail.members.map(m => this.toMemberDisplay(m));
      this.events  = (events  as GroupEvent[]).map(e => this.toEventDisplay(e));
      this.pendingRequests = (requests as JoinRequest[]).map(r => this.toRequestDisplay(r));

      this.editForm.patchValue({
        name:       detail.name,
        description: detail.description,
        category:   CATEGORY_LABELS[detail.category ?? ''] ?? (detail.category ?? ''),
        joinPolicy: detail.joinPolicy === 'OPEN' ? 'open' : 'approval'
      });

      this.editImageSlots = [GROUP_COLORS[detail.id % GROUP_COLORS.length], null, null];
    }).catch(() => this.navCtrl.back());
  }

  private toMemberDisplay(m: GroupMember): GroupMemberDto {
    const parts = m.name.trim().split(' ');
    const initials = parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : m.name.substring(0, 2).toUpperCase();
    return { id: m.id, name: m.name, initials, role: m.role === 'ADMIN' ? 'admin' : 'member', isMuted: m.muted };
  }

  private toEventDisplay(e: GroupEvent): GroupEventDto {
    const date = new Date(e.eventDate);
    return {
      id: e.id,
      title: e.title,
      description: e.description,
      date: date.toLocaleString('es', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      location: e.location,
      createdBy: e.creatorName,
      isPast: date < new Date()
    };
  }

  private toRequestDisplay(r: JoinRequest): JoinRequestDto {
    const parts = r.name.trim().split(' ');
    const initials = parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : r.name.substring(0, 2).toUpperCase();
    const date = new Date(r.createdAt);
    return {
      id: r.id,
      userId: r.userId,
      userName: r.name,
      userInitials: initials,
      userAvatarColor: GROUP_COLORS[r.userId % GROUP_COLORS.length],
      bio: r.email,
      requestedAt: date.toLocaleDateString('es', { day: 'numeric', month: 'short' })
    };
  }

  goBack() { this.navCtrl.back(); }

  onSegmentChange(ev: CustomEvent) {
    this.activeSegment = ev.detail.value;
    this.showEventForm = false;
  }

  // ── Solicitudes ───────────────────────────────
  approveRequest(req: JoinRequestDto) {
    this.api.approveJoinRequest(this.group!.id, req.id).subscribe({
      next: () => {
        this.pendingRequests = this.pendingRequests.filter(r => r.id !== req.id);
        this.api.getMembers(this.group!.id).subscribe(members => {
          this.members = members.map(m => this.toMemberDisplay(m));
        });
      }
    });
  }

  rejectRequest(req: JoinRequestDto) {
    this.api.rejectJoinRequest(this.group!.id, req.id).subscribe({
      next: () => {
        this.pendingRequests = this.pendingRequests.filter(r => r.id !== req.id);
      }
    });
  }

  // ── Miembros ──────────────────────────────────
  async openMemberActions(member: GroupMemberDto) {
    const sheet = await this.actionSheetCtrl.create({
      header: member.name,
      cssClass: 'admin-action-sheet',
      buttons: [
        {
          text: 'Asignar como admin',
          icon: 'shield-outline',
          handler: () => {
            this.api.promoteMember(this.group!.id, member.id).subscribe({
              next: () => { member.role = 'admin'; }
            });
          }
        },
        {
          text: member.isMuted ? 'Desactivar silencio' : 'Silenciar',
          icon: member.isMuted ? 'volume-high-outline' : 'volume-mute-outline',
          handler: () => {
            this.api.muteMember(this.group!.id, member.id).subscribe({
              next: (updated) => { member.isMuted = updated.muted; }
            });
          }
        },
        {
          text: 'Expulsar del grupo',
          icon: 'person-remove-outline',
          role: 'destructive',
          handler: () => this.confirmKick(member)
        },
        { text: 'Cancelar', icon: 'close-outline', role: 'cancel' }
      ]
    });
    await sheet.present();
  }

  async confirmKick(member: GroupMemberDto) {
    const alert = await this.alertCtrl.create({
      header: 'Expulsar miembro',
      message: `¿Estás seguro que quieres expulsar a ${member.name}?`,
      cssClass: 'admin-alert',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Expulsar',
          role: 'destructive',
          handler: () => {
            this.api.removeMember(this.group!.id, member.id).subscribe({
              next: () => { this.members = this.members.filter(m => m.id !== member.id); }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  // ── Eventos ───────────────────────────────────
  submitEvent() {
    this.eventForm.markAllAsTouched();
    if (this.eventForm.invalid) return;

    const { title, description, eventDate, location } = this.eventForm.value;
    const eventDateStr = (eventDate as string).length === 16 ? eventDate + ':00' : eventDate;

    this.api.createGroupEvent(this.group!.id, { title, description, eventDate: eventDateStr, location }).subscribe({
      next: (event) => {
        this.events = [this.toEventDisplay(event), ...this.events];
        this.eventForm.reset();
        this.showEventForm = false;
      }
    });
  }

  // ── Editar grupo ──────────────────────────────
  get editFilledSlots(): number { return this.editImageSlots.filter(Boolean).length; }
  get editNameLen(): number { return (this.editForm.get('name')!.value as string).length; }
  get editDescLen(): number { return (this.editForm.get('description')!.value as string).length; }

  cycleEditSlotColor(index: number) {
    const current = this.editImageSlots[index];
    const idx = current ? GROUP_COLORS.indexOf(current) : -1;
    this.editImageSlots[index] = GROUP_COLORS[(idx + 1) % GROUP_COLORS.length];
  }

  clearEditSlot(index: number, event: Event) {
    event.stopPropagation();
    this.editImageSlots[index] = null;
  }

  selectCategory(cat: string) { this.editForm.get('category')!.setValue(cat); }
  setJoinPolicy(p: string)    { this.editForm.get('joinPolicy')!.setValue(p); }

  saveGroupEdit() {
    this.editForm.markAllAsTouched();
    if (this.editForm.invalid) return;

    const { name, description, joinPolicy } = this.editForm.value;
    this.api.updateGroup(this.group!.id, {
      name,
      description,
      joinPolicy: joinPolicy === 'open' ? 'OPEN' : 'APPROVAL_REQUIRED'
    }).subscribe({
      next: () => this.navCtrl.back()
    });
  }
}
