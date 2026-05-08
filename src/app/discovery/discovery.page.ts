import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  QueryList,
  ViewChildren
} from '@angular/core';
import { Router } from '@angular/router';
import { GestureController, GestureDetail } from '@ionic/angular';
import { GroupDto } from '../dtos/group.dto';
import { NotificationDto } from '../dtos/notification.dto';

const ALL_GROUPS: GroupDto[] = [
  {
    id: 1,
    name: 'Senderismo Urbano',
    description: 'Exploramos senderos y parques naturales cada fin de semana. Todos los niveles bienvenidos.',
    category: 'Deporte & Naturaleza',
    memberCount: 24,
    distance: 1.2,
    backgroundColor: '#4ECDC4',
    tags: ['senderismo', 'naturaleza', 'fin de semana']
  },
  {
    id: 2,
    name: 'Book Club Café',
    description: 'Nos reunimos los jueves para discutir literatura contemporánea con un café de por medio.',
    category: 'Cultura & Lectura',
    memberCount: 12,
    distance: 0.8,
    backgroundColor: '#FF6584',
    tags: ['lectura', 'café', 'jueves']
  },
  {
    id: 3,
    name: 'Fotografía Callejera',
    description: 'Salimos a capturar la esencia de la ciudad a través del lente.',
    category: 'Arte & Creatividad',
    memberCount: 31,
    distance: 2.5,
    backgroundColor: '#6C63FF',
    tags: ['fotografía', 'arte', 'ciudad']
  },
  {
    id: 4,
    name: 'Dev Santiago',
    description: 'Comunidad de desarrolladores que se reúnen a compartir proyectos, charlas y código.',
    category: 'Tecnología',
    memberCount: 47,
    distance: 0.5,
    backgroundColor: '#26de81',
    tags: ['programación', 'tech', 'networking']
  },
  {
    id: 5,
    name: 'Jazz & Blues Club',
    description: 'Amantes del jazz y el blues que se juntan a escuchar y tocar música en vivo.',
    category: 'Música',
    memberCount: 19,
    distance: 3.1,
    backgroundColor: '#A55EEA',
    tags: ['jazz', 'blues', 'música en vivo']
  },
  {
    id: 6,
    name: 'Cocina del Mundo',
    description: 'Cocinamos recetas internacionales juntos y compartimos la mesa. ¡Siempre hay espacio!',
    category: 'Gastronomía',
    memberCount: 15,
    distance: 6.0,
    backgroundColor: '#FC5C65',
    tags: ['cocina', 'recetas', 'internacional']
  },
  {
    id: 7,
    name: 'Yoga & Meditación',
    description: 'Practicamos yoga y meditación al aire libre para reconectar cuerpo y mente.',
    category: 'Deporte & Naturaleza',
    memberCount: 22,
    distance: 4.5,
    backgroundColor: '#F7B731',
    tags: ['yoga', 'mindfulness', 'bienestar']
  },
  {
    id: 8,
    name: 'Ilustración Digital',
    description: 'Creamos arte digital, cómics e ilustraciones. Compartimos técnicas y herramientas.',
    category: 'Arte & Creatividad',
    memberCount: 28,
    distance: 8.2,
    backgroundColor: '#fd9644',
    tags: ['ilustración', 'digital', 'diseño']
  },
  {
    id: 9,
    name: 'Podcast Makers',
    description: 'Aprendemos a crear y producir podcasts desde cero. Comunidad activa y colaborativa.',
    category: 'Tecnología',
    memberCount: 11,
    distance: 12.3,
    backgroundColor: '#2bcbba',
    tags: ['podcast', 'producción', 'audio']
  },
  {
    id: 10,
    name: 'Coro Moderno',
    description: 'Cantamos juntos música pop, folk y soul. No se necesita experiencia previa.',
    category: 'Música',
    memberCount: 34,
    distance: 1.8,
    backgroundColor: '#eb3b5a',
    tags: ['canto', 'coro', 'pop']
  },
  {
    id: 11,
    name: 'Runners Matutinos',
    description: 'Corremos juntos cada mañana por el parque. Distintos ritmos, misma energía.',
    category: 'Deporte & Naturaleza',
    memberCount: 18,
    distance: 0.3,
    backgroundColor: '#45aaf2',
    tags: ['running', 'mañana', 'salud']
  },
  {
    id: 12,
    name: 'Cerveza Artesanal',
    description: 'Degustamos y elaboramos cervezas artesanales. Cada mes un estilo diferente.',
    category: 'Gastronomía',
    memberCount: 9,
    distance: 5.7,
    backgroundColor: '#f9ca24',
    tags: ['cerveza', 'artesanal', 'degustación']
  }
];

const ALL_CATEGORIES = [
  'Deporte & Naturaleza',
  'Arte & Creatividad',
  'Cultura & Lectura',
  'Tecnología',
  'Música',
  'Gastronomía'
];

const MAX_DISTANCE_DEFAULT = 20;
const THRESHOLD = 80;

const now = Date.now();
const NOTIFICATIONS: NotificationDto[] = [
  {
    id: 1,
    groupId: 4,
    groupName: 'Dev Santiago',
    groupBackgroundColor: '#26de81',
    groupCategory: 'Tecnología',
    message: 'Dev Santiago publicó un nuevo evento: "Hackathon de IA" este sábado. ¡No te lo pierdas!',
    timestamp: new Date(now - 5 * 60 * 1000),
    isRead: false
  },
  {
    id: 2,
    groupId: 1,
    groupName: 'Senderismo Urbano',
    groupBackgroundColor: '#4ECDC4',
    groupCategory: 'Deporte & Naturaleza',
    message: 'Senderismo Urbano tiene una caminata programada para el domingo. ¡Quedan 3 cupos!',
    timestamp: new Date(now - 32 * 60 * 1000),
    isRead: false
  },
  {
    id: 3,
    groupId: 3,
    groupName: 'Fotografía Callejera',
    groupBackgroundColor: '#6C63FF',
    groupCategory: 'Arte & Creatividad',
    message: 'Tu solicitud para unirte a Fotografía Callejera fue aceptada.',
    timestamp: new Date(now - 2 * 60 * 60 * 1000),
    isRead: false
  },
  {
    id: 4,
    groupId: 2,
    groupName: 'Book Club Café',
    groupBackgroundColor: '#FF6584',
    groupCategory: 'Cultura & Lectura',
    message: 'Book Club Café actualizó el libro del mes: "Cien años de soledad".',
    timestamp: new Date(now - 5 * 60 * 60 * 1000),
    isRead: true
  },
  {
    id: 5,
    groupId: 10,
    groupName: 'Coro Moderno',
    groupBackgroundColor: '#eb3b5a',
    groupCategory: 'Música',
    message: 'Coro Moderno invitó a 5 nuevos miembros. ¡El grupo sigue creciendo!',
    timestamp: new Date(now - 24 * 60 * 60 * 1000),
    isRead: true
  },
  {
    id: 6,
    groupId: 7,
    groupName: 'Yoga & Meditación',
    groupBackgroundColor: '#F7B731',
    groupCategory: 'Deporte & Naturaleza',
    message: 'Yoga & Meditación recordatorio: sesión mañana a las 8:00 AM en el parque.',
    timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000),
    isRead: true
  }
];

@Component({
  selector: 'app-discovery',
  templateUrl: './discovery.page.html',
  styleUrls: ['./discovery.page.scss'],
  standalone: false
})
export class DiscoveryPage implements AfterViewInit, OnDestroy {
  @ViewChildren('swipeCard') cardElements!: QueryList<ElementRef>;

  readonly allCategories = ALL_CATEGORIES;

  currentIndex = 0;
  likeOpacity = 0;
  nopeOpacity = 0;
  isAnimating = false;

  // Active filters
  selectedCategories: string[] = [];
  maxDistance = MAX_DISTANCE_DEFAULT;

  // Pending filters (shown inside the modal before applying)
  filterOpen = false;
  pendingCategories: string[] = [];
  pendingDistance = MAX_DISTANCE_DEFAULT;

  // Notifications
  notificationsOpen = false;
  notifications: NotificationDto[] = [...NOTIFICATIONS];

  private activeGesture?: ReturnType<GestureController['create']>;
  private movedPx = 0;

  constructor(
    private gestureCtrl: GestureController,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit() {
    this.cardElements.changes.subscribe(() => setTimeout(() => this.setupGesture(), 0));
    this.setupGesture();
  }

  ngOnDestroy() {
    this.activeGesture?.destroy();
  }

  get filteredGroups(): GroupDto[] {
    return ALL_GROUPS.filter(g => {
      const catMatch = this.selectedCategories.length === 0 || this.selectedCategories.includes(g.category);
      const distMatch = g.distance <= this.maxDistance;
      return catMatch && distMatch;
    });
  }

  get visibleGroups(): GroupDto[] {
    return this.filteredGroups.slice(this.currentIndex, this.currentIndex + 3);
  }

  get hasCards(): boolean {
    return this.currentIndex < this.filteredGroups.length;
  }

  get hasUnreadNotifications(): boolean {
    return this.notifications.some(n => !n.isRead);
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  get activeFilterCount(): number {
    let n = 0;
    if (this.selectedCategories.length > 0) n++;
    if (this.maxDistance < MAX_DISTANCE_DEFAULT) n++;
    return n;
  }

  get filteredCountForPending(): number {
    return ALL_GROUPS.filter(g => {
      const catMatch = this.pendingCategories.length === 0 || this.pendingCategories.includes(g.category);
      const distMatch = g.distance <= this.pendingDistance;
      return catMatch && distMatch;
    }).length;
  }

  readonly distanceFormatter = (v: number) => v < 20 ? `${v}km` : '∞';

  openNotifications() {
    this.notificationsOpen = true;
  }

  markAsRead(id: number) {
    const n = this.notifications.find(n => n.id === id);
    if (n) n.isRead = true;
  }

  markAllRead() {
    this.notifications.forEach(n => n.isRead = true);
  }

  timeAgo(date: Date): string {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'ahora';
    if (minutes < 60) return `hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `hace ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'ayer';
    return `hace ${days} días`;
  }

  openFilters() {
    this.pendingCategories = [...this.selectedCategories];
    this.pendingDistance = this.maxDistance;
    this.filterOpen = true;
  }

  togglePendingCategory(cat: string) {
    const idx = this.pendingCategories.indexOf(cat);
    if (idx >= 0) {
      this.pendingCategories.splice(idx, 1);
    } else {
      this.pendingCategories.push(cat);
    }
  }

  onDistanceChange(ev: Event) {
    this.pendingDistance = (ev as CustomEvent).detail.value;
  }

  applyFilters() {
    this.selectedCategories = [...this.pendingCategories];
    this.maxDistance = this.pendingDistance;
    this.currentIndex = 0;
    this.filterOpen = false;
  }

  clearFilters() {
    this.selectedCategories = [];
    this.maxDistance = MAX_DISTANCE_DEFAULT;
    this.pendingCategories = [];
    this.pendingDistance = MAX_DISTANCE_DEFAULT;
    this.currentIndex = 0;
    this.filterOpen = false;
  }

  private setupGesture() {
    this.activeGesture?.destroy();
    const cards = this.cardElements.toArray();
    if (!cards.length) return;

    const topEl = cards[0].nativeElement as HTMLElement;

    this.activeGesture = this.gestureCtrl.create({
      el: topEl,
      gestureName: 'card-swipe',
      threshold: 10,
      onStart: () => {
        this.movedPx = 0;
        topEl.style.transition = 'none';
      },
      onMove: (ev: GestureDetail) => {
        this.movedPx = Math.abs(ev.deltaX);
        const rotate = ev.deltaX * 0.06;
        topEl.style.transform = `translateX(${ev.deltaX}px) rotate(${rotate}deg)`;
        const progress = Math.min(this.movedPx / THRESHOLD, 1);
        this.likeOpacity = ev.deltaX > 0 ? progress : 0;
        this.nopeOpacity = ev.deltaX < 0 ? progress : 0;
      },
      onEnd: (ev: GestureDetail) => {
        this.likeOpacity = 0;
        this.nopeOpacity = 0;
        if (Math.abs(ev.deltaX) >= THRESHOLD) {
          this.flyOut(topEl, ev.deltaX > 0);
        } else {
          topEl.style.transition = 'transform 0.35s ease';
          topEl.style.transform = '';
          setTimeout(() => {
            topEl.style.transition = '';
            this.movedPx = 0;
          }, 350);
        }
      }
    });

    this.activeGesture.enable(true);
  }

  private flyOut(el: HTMLElement, liked: boolean) {
    if (this.isAnimating) return;
    this.isAnimating = true;
    const x = liked ? window.innerWidth + 200 : -(window.innerWidth + 200);
    const rotate = liked ? 30 : -30;
    el.style.transition = 'transform 0.38s ease';
    el.style.transform = `translateX(${x}px) rotate(${rotate}deg)`;
    setTimeout(() => {
      this.ngZone.run(() => {
        this.currentIndex++;
        this.isAnimating = false;
        this.movedPx = 0;
      });
    }, 390);
  }

  swipeLeft() {
    if (this.isAnimating || !this.hasCards) return;
    const cards = this.cardElements.toArray();
    if (!cards.length) return;
    this.flyOut(cards[0].nativeElement, false);
  }

  swipeRight() {
    if (this.isAnimating || !this.hasCards) return;
    const cards = this.cardElements.toArray();
    if (!cards.length) return;
    this.flyOut(cards[0].nativeElement, true);
  }

  openDetail(group: GroupDto) {
    if (this.movedPx > 10) return;
    this.router.navigate(['/group-detail', group.id]);
  }

  getCategoryIcon(category: string): string {
    const map: Record<string, string> = {
      'Deporte & Naturaleza': 'bicycle-outline',
      'Cultura & Lectura':    'book-outline',
      'Arte & Creatividad':   'color-palette-outline',
      'Tecnología':           'code-slash-outline',
      'Música':               'musical-notes-outline',
      'Gastronomía':          'restaurant-outline'
    };
    return map[category] ?? 'people-outline';
  }
}
