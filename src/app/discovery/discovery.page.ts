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
import { GestureController, GestureDetail, ViewWillEnter } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { GroupDiscovery, GroupCategory, GenderPreference, Notification } from '../dtos/api.dto';
import { ApiService } from '../services/api.service';

const COLOR_PALETTE = [
  '#4ECDC4', '#FF6584', '#6C63FF', '#26de81',
  '#A55EEA', '#FC5C65', '#F7B731', '#45aaf2',
  '#fd9644', '#eb3b5a', '#2bcbba', '#f9ca24'
];

export const CATEGORY_LABELS: Record<GroupCategory, string> = {
  DEPORTES:    'Deporte & Naturaleza',
  ARTE:        'Arte & Creatividad',
  CULTURA:     'Cultura & Lectura',
  TECNOLOGIA:  'Tecnología',
  MUSICA:      'Música',
  GASTRONOMIA: 'Gastronomía',
};

export const CATEGORY_ICONS: Record<GroupCategory, string> = {
  DEPORTES:    'bicycle-outline',
  ARTE:        'color-palette-outline',
  CULTURA:     'book-outline',
  TECNOLOGIA:  'code-slash-outline',
  MUSICA:      'musical-notes-outline',
  GASTRONOMIA: 'restaurant-outline',
};

const ALL_CATEGORIES: GroupCategory[] = ['DEPORTES', 'ARTE', 'CULTURA', 'TECNOLOGIA', 'MUSICA', 'GASTRONOMIA'];
const MAX_DISTANCE_DEFAULT = 20;
const THRESHOLD = 80;

@Component({
  selector: 'app-discovery',
  templateUrl: './discovery.page.html',
  styleUrls: ['./discovery.page.scss'],
  standalone: false
})
export class DiscoveryPage implements AfterViewInit, OnDestroy, ViewWillEnter {
  @ViewChildren('swipeCard') cardElements!: QueryList<ElementRef>;

  readonly allCategories = ALL_CATEGORIES;
  readonly categoryLabels = CATEGORY_LABELS;
  readonly categoryIcons = CATEGORY_ICONS;

  groups: GroupDiscovery[] = [];
  isLoading = false;

  currentIndex = 0;
  likeOpacity = 0;
  nopeOpacity = 0;
  isAnimating = false;

  // filtros activos
  selectedCategories: GroupCategory[] = [];
  maxDistance = MAX_DISTANCE_DEFAULT;

  // filtros pendientes (dentro del modal)
  filterOpen = false;
  pendingCategories: GroupCategory[] = [];
  pendingDistance = MAX_DISTANCE_DEFAULT;

  notificationsOpen = false;
  notifications: Notification[] = [];

  private userLatitude?: number;
  private userLongitude?: number;
  private activeGesture?: ReturnType<GestureController['create']>;
  private movedPx = 0;

  constructor(
    private gestureCtrl: GestureController,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService,
  ) {}

  ionViewWillEnter() {
    this.initLocation();
    this.loadNotifications();
  }

  ngAfterViewInit() {
    this.cardElements.changes.subscribe(() => setTimeout(() => this.setupGesture(), 0));
  }

  ngOnDestroy() {
    this.activeGesture?.destroy();
  }

  private async initLocation() {
    try {
      const pos = await Geolocation.getCurrentPosition({ timeout: 5000 });
      this.userLatitude  = pos.coords.latitude;
      this.userLongitude = pos.coords.longitude;
    } catch {
      // sin ubicación: la API devuelve grupos sin filtro de distancia
    } finally {
      this.loadGroups();
    }
  }

  loadGroups() {
    this.isLoading = true;
    const radiusKm = this.maxDistance < MAX_DISTANCE_DEFAULT ? this.maxDistance : undefined;
    const category = this.selectedCategories.length === 1 ? this.selectedCategories[0] : undefined;

    this.apiService.discoverGroups({
      latitude:  this.userLatitude,
      longitude: this.userLongitude,
      radiusKm,
      category,
    }).subscribe({
      next: (page) => {
        this.groups = page.content;
        this.currentIndex = 0;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  private loadNotifications() {
    this.apiService.getMyNotifications().subscribe({
      next: (data) => { this.notifications = data; },
      error: () => {}
    });
  }

  get visibleGroups(): GroupDiscovery[] {
    return this.groups.slice(this.currentIndex, this.currentIndex + 3);
  }

  get hasCards(): boolean {
    return this.currentIndex < this.groups.length;
  }

  get hasUnreadNotifications(): boolean {
    return this.notifications.some(n => !n.read);
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  get activeFilterCount(): number {
    let n = 0;
    if (this.selectedCategories.length > 0) n++;
    if (this.maxDistance < MAX_DISTANCE_DEFAULT) n++;
    return n;
  }

  readonly distanceFormatter = (v: number) => v < 20 ? `${v}km` : '∞';

  getGroupColor(id: number): string {
    return COLOR_PALETTE[id % COLOR_PALETTE.length];
  }

  getCategoryIcon(cat: GroupCategory | null): string {
    return cat ? (CATEGORY_ICONS[cat] ?? 'people-outline') : 'people-outline';
  }

  getCategoryLabel(cat: GroupCategory | null): string {
    return cat ? (CATEGORY_LABELS[cat] ?? cat) : '';
  }

  getGenderLabel(pref: GenderPreference): string {
    const map: Record<GenderPreference, string> = {
      MIXED: 'Mixto', MEN_ONLY: 'Solo hombres', WOMEN_ONLY: 'Solo mujeres'
    };
    return map[pref] ?? pref;
  }

  openNotifications() {
    this.notificationsOpen = true;
  }

  markAsRead(id: number) {
    const notif = this.notifications.find(n => n.id === id);
    if (!notif || notif.read) return;
    notif.read = true;
    this.apiService.markNotificationRead(id).subscribe({ error: () => { notif.read = false; } });
  }

  markAllRead() {
    const unread = this.notifications.filter(n => !n.read);
    unread.forEach(n => { n.read = true; });
    unread.forEach(n => this.apiService.markNotificationRead(n.id).subscribe({ error: () => { n.read = false; } }));
  }

  timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
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

  togglePendingCategory(cat: GroupCategory) {
    const idx = this.pendingCategories.indexOf(cat);
    if (idx >= 0) this.pendingCategories.splice(idx, 1);
    else this.pendingCategories.push(cat);
  }

  onDistanceChange(ev: Event) {
    this.pendingDistance = (ev as CustomEvent).detail.value;
  }

  applyFilters() {
    this.selectedCategories = [...this.pendingCategories];
    this.maxDistance = this.pendingDistance;
    this.filterOpen = false;
    this.loadGroups();
  }

  clearFilters() {
    this.selectedCategories = [];
    this.maxDistance = MAX_DISTANCE_DEFAULT;
    this.pendingCategories = [];
    this.pendingDistance = MAX_DISTANCE_DEFAULT;
    this.filterOpen = false;
    this.loadGroups();
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

    const currentGroup = this.groups[this.currentIndex];
    if (currentGroup) {
      this.apiService.swipeGroup(currentGroup.uuid, { liked }).subscribe();
    }

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

  openDetail(group: GroupDiscovery) {
    if (this.movedPx > 10) return;
    this.router.navigate(['/group-detail', group.uuid]);
  }
}
