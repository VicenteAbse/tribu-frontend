import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren
} from '@angular/core';
import { Router } from '@angular/router';
import { GestureController, GestureDetail } from '@ionic/angular';
import { GroupDto } from '../dtos/group.dto';

const GROUPS: GroupDto[] = [
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
  }
];

const THRESHOLD = 80;

@Component({
  selector: 'app-discovery',
  templateUrl: './discovery.page.html',
  styleUrls: ['./discovery.page.scss'],
  standalone: false
})
export class DiscoveryPage implements AfterViewInit, OnDestroy {
  @ViewChildren('swipeCard') cardElements!: QueryList<ElementRef>;

  readonly groups: GroupDto[] = GROUPS;
  currentIndex = 0;
  likeOpacity = 0;
  nopeOpacity = 0;
  isAnimating = false;

  private activeGesture?: ReturnType<GestureController['create']>;
  private movedPx = 0;

  constructor(
    private gestureCtrl: GestureController,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.cardElements.changes.subscribe(() => this.setupGesture());
    this.setupGesture();
  }

  ngOnDestroy() {
    this.activeGesture?.destroy();
  }

  get visibleGroups(): GroupDto[] {
    return this.groups.slice(this.currentIndex, this.currentIndex + 3);
  }

  get hasCards(): boolean {
    return this.currentIndex < this.groups.length;
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
      this.currentIndex++;
      this.isAnimating = false;
      this.movedPx = 0;
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
    // Solo navegar si el usuario no estaba arrastrando la tarjeta
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
