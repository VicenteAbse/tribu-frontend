import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { GroupEvent, GroupMember, GroupStatus } from '../dtos/api.dto';

const GROUP_COLORS = ['#4ECDC4', '#FF6584', '#6C63FF', '#F7B731', '#A55EEA', '#FC5C65', '#26de81', '#45AAB8', '#f7797d'];

const CATEGORY_LABELS: Record<string, string> = {
  DEPORTES: 'Deportes', ARTE: 'Arte', CULTURA: 'Cultura',
  TECNOLOGIA: 'Tecnología', MUSICA: 'Música', GASTRONOMIA: 'Gastronomía'
};

interface MemberDisplay {
  id: number;
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
  id: number;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  distanceKm: number | null;
  backgroundColor: string;
  createdBy: string;
  status: GroupStatus;
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private api: ApiService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData(id);
  }

  private loadData(id: number) {
    Promise.all([
      this.api.getMyProfile().toPromise(),
      this.api.getGroup(id).toPromise(),
      this.api.getGroupEvents(id).toPromise().catch(() => [])
    ]).then(([profile, detail, events]) => {
      const myEmail = profile!.email;
      const myMembership = detail!.members.find(m => m.email === myEmail);

      this.isMember = !!myMembership;
      this.isAdmin = myMembership?.role === 'ADMIN';

      this.group = {
        id: detail!.id,
        name: detail!.name,
        description: detail!.description,
        category: CATEGORY_LABELS[detail!.category ?? ''] ?? (detail!.category ?? ''),
        memberCount: detail!.members.length,
        distanceKm: detail!.distanceKm,
        backgroundColor: GROUP_COLORS[detail!.id % GROUP_COLORS.length],
        createdBy: detail!.creatorName,
        status: detail!.status,
        members: detail!.members.map(m => this.toMemberDisplay(m)),
        events: (events as GroupEvent[] ?? []).map(e => this.toEventDisplay(e))
      };
    }).catch(() => {
      this.group = null;
    });
  }

  private toMemberDisplay(m: GroupMember): MemberDisplay {
    const parts = m.name.trim().split(' ');
    const initials = parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : m.name.substring(0, 2).toUpperCase();
    return { id: m.id, name: m.name, initials, role: m.role === 'ADMIN' ? 'admin' : 'member' };
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

  goBack()    { this.navCtrl.back(); }
  goToAdmin() { if (this.group) this.router.navigate(['/group-admin', this.group.id]); }
  goToChat()  { if (this.group) this.router.navigate(['/group-chat',  this.group.id]); }
}
