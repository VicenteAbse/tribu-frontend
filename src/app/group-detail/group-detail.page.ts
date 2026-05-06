import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { GroupDetailDto } from '../dtos/group-detail.dto';

const GROUP_DETAILS: Record<number, GroupDetailDto> = {
  1: {
    id: 1,
    name: 'Senderismo Urbano',
    description: 'Exploramos senderos y parques naturales cada fin de semana.',
    longDescription: 'Somos un grupo apasionado por el senderismo y la naturaleza dentro y fuera de la ciudad. Cada fin de semana organizamos rutas de diferente dificultad para que todos puedan participar, desde principiantes hasta expertos. Nos preocupamos por el respeto al medio ambiente y fomentamos el compañerismo entre miembros.',
    category: 'Deporte & Naturaleza',
    memberCount: 24,
    distance: 1.2,
    backgroundColor: '#4ECDC4',
    tags: ['senderismo', 'naturaleza', 'fin de semana'],
    location: 'Parque Metropolitano Central',
    nextEvent: 'Sábado 10 Mayo · 8:00 AM',
    createdBy: 'Ana García',
    members: [
      { id: 1, name: 'Ana García',    initials: 'AG', role: 'admin'  },
      { id: 2, name: 'Carlos López',  initials: 'CL', role: 'member' },
      { id: 3, name: 'María Torres',  initials: 'MT', role: 'member' },
      { id: 4, name: 'Pedro Ruiz',    initials: 'PR', role: 'member' },
      { id: 5, name: 'Lucía Méndez',  initials: 'LM', role: 'member' },
      { id: 6, name: 'Diego Vargas',  initials: 'DV', role: 'member' }
    ]
  },
  2: {
    id: 2,
    name: 'Book Club Café',
    description: 'Nos reunimos los jueves para discutir literatura contemporánea.',
    longDescription: 'Un espacio íntimo para amantes de la lectura que buscan compartir ideas, reflexionar sobre libros y disfrutar de buena conversación. Cada mes elegimos un libro por votación. Las reuniones son los jueves a las 7 PM en diferentes cafés de la ciudad. No se necesita experiencia previa, solo ganas de leer y conversar.',
    category: 'Cultura & Lectura',
    memberCount: 12,
    distance: 0.8,
    backgroundColor: '#FF6584',
    tags: ['lectura', 'café', 'jueves'],
    location: 'Café La Página, Centro',
    nextEvent: 'Jueves 8 Mayo · 7:00 PM',
    createdBy: 'Sofía Herrera',
    members: [
      { id: 1, name: 'Sofía Herrera', initials: 'SH', role: 'admin'  },
      { id: 2, name: 'Javier Mora',   initials: 'JM', role: 'member' },
      { id: 3, name: 'Elena Castro',  initials: 'EC', role: 'member' },
      { id: 4, name: 'Andrés Silva',  initials: 'AS', role: 'member' },
      { id: 5, name: 'Paula Nieto',   initials: 'PN', role: 'member' }
    ]
  },
  3: {
    id: 3,
    name: 'Fotografía Callejera',
    description: 'Salimos a capturar la esencia de la ciudad a través del lente.',
    longDescription: 'Grupo de fotógrafos urbanos que exploran la ciudad buscando momentos auténticos y rincones ocultos. Realizamos salidas fotográficas quincenales, talleres de edición y exposiciones de los mejores trabajos del grupo. Todos los niveles son bienvenidos, desde quienes usan el móvil hasta fotógrafos con cámara profesional.',
    category: 'Arte & Creatividad',
    memberCount: 31,
    distance: 2.5,
    backgroundColor: '#6C63FF',
    tags: ['fotografía', 'arte', 'ciudad'],
    location: 'Plaza Mayor (punto de encuentro variable)',
    nextEvent: 'Domingo 11 Mayo · 10:00 AM',
    createdBy: 'Tomás Reyes',
    members: [
      { id: 1, name: 'Tomás Reyes',   initials: 'TR', role: 'admin'  },
      { id: 2, name: 'Isabel Lara',   initials: 'IL', role: 'member' },
      { id: 3, name: 'Rafael Díaz',   initials: 'RD', role: 'member' },
      { id: 4, name: 'Carmen Vega',   initials: 'CV', role: 'member' },
      { id: 5, name: 'Miguel Ángel',  initials: 'MA', role: 'member' },
      { id: 6, name: 'Natalia Ríos',  initials: 'NR', role: 'member' }
    ]
  }
};

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.page.html',
  styleUrls: ['./group-detail.page.scss'],
  standalone: false
})
export class GroupDetailPage implements OnInit {
  group: GroupDetailDto | null = null;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.group = GROUP_DETAILS[id] ?? null;
  }

  goBack() {
    this.navCtrl.back();
  }
}
