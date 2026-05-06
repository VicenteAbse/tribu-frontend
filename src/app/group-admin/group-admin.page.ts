import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';
import { GroupEventDto } from '../dtos/group-event.dto';
import { JoinRequestDto } from '../dtos/join-request.dto';
import { GroupMemberDto } from '../dtos/group-detail.dto';

interface AdminGroupData {
  id: number;
  name: string;
  backgroundColor: string;
  viewerRole: 'creator' | 'admin';
  joinPolicy: 'open' | 'approval';
  description: string;
  category: string;
  members: GroupMemberDto[];
  pendingRequests: JoinRequestDto[];
  events: GroupEventDto[];
}

const ADMIN_DATA: Record<number, AdminGroupData> = {
  1: {
    id: 1, name: 'Senderismo Urbano', backgroundColor: '#4ECDC4',
    viewerRole: 'admin', joinPolicy: 'approval',
    description: 'Exploramos senderos y parques naturales cada fin de semana. Todos los niveles bienvenidos.',
    category: 'Deporte & Naturaleza',
    members: [
      { id: 1, name: 'Ana García',   initials: 'AG', role: 'admin'  },
      { id: 2, name: 'Carlos López', initials: 'CL', role: 'member' },
      { id: 3, name: 'María Torres', initials: 'MT', role: 'member' },
      { id: 4, name: 'Pedro Ruiz',   initials: 'PR', role: 'member', isMuted: true },
      { id: 5, name: 'Lucía Méndez', initials: 'LM', role: 'member' },
      { id: 6, name: 'Diego Vargas', initials: 'DV', role: 'member' }
    ],
    pendingRequests: [
      { id: 1, userId: 20, userName: 'Roberto Sánchez', userInitials: 'RS', userAvatarColor: '#FF6584', bio: 'Fanático del trekking y la montaña 🏔️', requestedAt: 'Hace 2 horas' },
      { id: 2, userId: 21, userName: 'Carmen Ibáñez',   userInitials: 'CI', userAvatarColor: '#F7B731', bio: 'Me encanta la naturaleza y el deporte al aire libre.', requestedAt: 'Hace 5 horas' },
      { id: 3, userId: 22, userName: 'Felipe Morales',  userInitials: 'FM', userAvatarColor: '#A55EEA', bio: 'Principiante en senderismo pero con muchas ganas de aprender.', requestedAt: 'Ayer' }
    ],
    events: [
      { id: 1, title: 'Ruta Norte del Parque',      description: 'Senderismo de dificultad media, ~2 horas.', date: 'Sáb 10 Mayo · 8:00 AM',  location: 'Parque Metropolitano Norte', createdBy: 'Ana García', isPast: false },
      { id: 2, title: 'Taller de Foto en Ruta',     description: 'Fotografía de paisajes mientras caminamos.', date: 'Sáb 17 Mayo · 9:00 AM', location: 'Parque Mapocho',            createdBy: 'Ana García', isPast: false },
      { id: 3, title: 'Ruta del Río',               description: 'Ruta de 3 horas siguiendo el cauce del río.', date: 'Sáb 3 Mayo · 8:30 AM', location: 'Río Mapocho sur',           createdBy: 'Ana García', isPast: true  }
    ]
  },
  3: {
    id: 3, name: 'Fotografía Callejera', backgroundColor: '#6C63FF',
    viewerRole: 'creator', joinPolicy: 'open',
    description: 'Salimos a capturar la esencia de la ciudad a través del lente.',
    category: 'Arte & Creatividad',
    members: [
      { id: 1, name: 'Tomás Reyes',  initials: 'TR', role: 'admin'  },
      { id: 2, name: 'Isabel Lara',  initials: 'IL', role: 'member' },
      { id: 3, name: 'Rafael Díaz',  initials: 'RD', role: 'member' },
      { id: 4, name: 'Carmen Vega',  initials: 'CV', role: 'member' },
      { id: 5, name: 'Miguel Ángel', initials: 'MA', role: 'member' },
      { id: 6, name: 'Natalia Ríos', initials: 'NR', role: 'member' }
    ],
    pendingRequests: [],
    events: [
      { id: 1, title: 'Street Photo: Barrio Histórico', description: 'Capturamos la vida cotidiana del centro.', date: 'Dom 11 Mayo · 10:00 AM', location: 'Plaza Mayor',  createdBy: 'Tomás Reyes', isPast: false },
      { id: 2, title: 'Salida Nocturna',                description: 'Fotografía nocturna urbana.',              date: 'Vie 16 Mayo · 9:00 PM',  location: 'Barrio Italia', createdBy: 'Tomás Reyes', isPast: false }
    ]
  }
};

const CATEGORIES = [
  'Deporte & Naturaleza', 'Cultura & Lectura', 'Arte & Creatividad',
  'Tecnología', 'Música', 'Gastronomía'
];

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

  readonly categories = CATEGORIES;

  get segments() {
    const segs: { value: string; label: string; badge: number }[] = [];
    if (this.group?.joinPolicy === 'approval') {
      segs.push({ value: 'requests', label: 'Solicitudes', badge: this.pendingRequests.length });
    }
    segs.push({ value: 'members', label: 'Miembros', badge: 0 });
    segs.push({ value: 'events',  label: 'Eventos',   badge: 0 });
    if (this.group?.viewerRole === 'creator') {
      segs.push({ value: 'edit', label: 'Editar', badge: 0 });
    }
    return segs;
  }

  get upcomingEvents(): GroupEventDto[] { return this.events.filter(e => !e.isPast); }
  get pastEvents():     GroupEventDto[] { return this.events.filter(e =>  e.isPast); }

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private fb: FormBuilder
  ) {
    this.eventForm = this.fb.group({
      title:       ['', Validators.required],
      description: [''],
      date:        ['', Validators.required],
      location:    ['']
    });

    this.editForm = this.fb.group({
      name:        ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      category:    ['', Validators.required],
      joinPolicy:  ['open']
    });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const data = ADMIN_DATA[id];
    if (!data) { this.navCtrl.back(); return; }

    this.group = data;
    this.members = [...data.members];
    this.pendingRequests = [...data.pendingRequests];
    this.events = [...data.events];

    this.activeSegment = this.pendingRequests.length > 0 ? 'requests' : 'members';

    this.editForm.patchValue({
      name: data.name, description: data.description,
      category: data.category, joinPolicy: data.joinPolicy
    });
  }

  goBack() { this.navCtrl.back(); }

  onSegmentChange(ev: CustomEvent) {
    this.activeSegment = ev.detail.value;
    this.showEventForm = false;
  }

  // ── Solicitudes ───────────────────────────────
  approveRequest(req: JoinRequestDto) {
    this.pendingRequests = this.pendingRequests.filter(r => r.id !== req.id);
    this.members.push({ id: req.userId, name: req.userName, initials: req.userInitials, role: 'member' });
  }

  rejectRequest(req: JoinRequestDto) {
    this.pendingRequests = this.pendingRequests.filter(r => r.id !== req.id);
  }

  // ── Miembros ──────────────────────────────────
  async openMemberActions(member: GroupMemberDto) {
    if (member.role === 'admin') return;

    const sheet = await this.actionSheetCtrl.create({
      header: member.name,
      cssClass: 'admin-action-sheet',
      buttons: [
        {
          text: member.isMuted ? 'Desactivar silencio' : 'Silenciar',
          icon: member.isMuted ? 'volume-high-outline' : 'volume-mute-outline',
          handler: () => { member.isMuted = !member.isMuted; }
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
          handler: () => { this.members = this.members.filter(m => m.id !== member.id); }
        }
      ]
    });
    await alert.present();
  }

  // ── Eventos ───────────────────────────────────
  submitEvent() {
    this.eventForm.markAllAsTouched();
    if (this.eventForm.invalid) return;

    const { title, description, date, location } = this.eventForm.value;
    this.events = [
      { id: Date.now(), title, description, date, location, createdBy: 'Tú', isPast: false },
      ...this.events
    ];
    this.eventForm.reset();
    this.showEventForm = false;
  }

  // ── Editar grupo ──────────────────────────────
  selectCategory(cat: string) { this.editForm.get('category')!.setValue(cat); }
  setJoinPolicy(p: string)    { this.editForm.get('joinPolicy')!.setValue(p); }

  saveGroupEdit() {
    this.editForm.markAllAsTouched();
    if (this.editForm.invalid) return;
    console.log('Guardando grupo:', this.editForm.value);
    this.navCtrl.back();
  }
}
