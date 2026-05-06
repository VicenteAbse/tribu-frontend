import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GroupRole, MyGroupDto } from '../dtos/my-group.dto';

const MY_GROUPS: MyGroupDto[] = [
  {
    id: 4,
    name: 'Runners Matutinos',
    category: 'Deporte & Naturaleza',
    backgroundColor: '#F7B731',
    lastMessageSender: 'Carlos M.',
    lastMessageText: 'Mañana: ruta por el parque central, 6:30 AM',
    lastMessageTime: 'Ayer',
    unreadCount: 3,
    role: 'creator'
  },
  {
    id: 1,
    name: 'Senderismo Urbano',
    category: 'Deporte & Naturaleza',
    backgroundColor: '#4ECDC4',
    lastMessageSender: 'Ana García',
    lastMessageText: '¡El sábado salimos a las 8! No olviden el agua 💧',
    lastMessageTime: '10:42',
    unreadCount: 5,
    role: 'admin'
  },
  {
    id: 7,
    name: 'Yoga & Mindfulness',
    category: 'Bienestar',
    backgroundColor: '#26de81',
    lastMessageSender: 'Tú',
    lastMessageText: 'Gracias por la clase de hoy 🙏',
    lastMessageTime: 'Dom',
    unreadCount: 0,
    role: 'admin'
  },
  {
    id: 2,
    name: 'Book Club Café',
    category: 'Cultura & Lectura',
    backgroundColor: '#FF6584',
    lastMessageSender: 'Tú',
    lastMessageText: 'Me encantó el final del capítulo 12',
    lastMessageTime: '9:15',
    unreadCount: 0,
    role: 'member'
  },
  {
    id: 3,
    name: 'Fotografía Callejera',
    category: 'Arte & Creatividad',
    backgroundColor: '#6C63FF',
    lastMessageSender: 'Tomás Reyes',
    lastMessageText: 'Subí las fotos de ayer al álbum compartido 📷',
    lastMessageTime: 'Ayer',
    unreadCount: 12,
    role: 'member'
  },
  {
    id: 5,
    name: 'Cine & Debate',
    category: 'Cultura & Ocio',
    backgroundColor: '#A55EEA',
    lastMessageSender: 'Valentina',
    lastMessageText: 'La próxima es el viernes, vemos Dune II 🍿',
    lastMessageTime: 'Lun',
    unreadCount: 0,
    role: 'member'
  },
  {
    id: 6,
    name: 'Cocina del Mundo',
    category: 'Gastronomía',
    backgroundColor: '#FC5C65',
    lastMessageSender: 'Lucía P.',
    lastMessageText: 'Receta del ramen enviada al grupo ✅',
    lastMessageTime: 'Lun',
    unreadCount: 1,
    role: 'member'
  }
];

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.page.html',
  styleUrls: ['./my-groups.page.scss'],
  standalone: false
})
export class MyGroupsPage {
  searchQuery = '';
  readonly myGroups: MyGroupDto[] = MY_GROUPS;

  constructor(private router: Router) {}

  private byRole(role: GroupRole): MyGroupDto[] {
    const q = this.searchQuery.trim().toLowerCase();
    const ofRole = this.myGroups.filter(g => g.role === role);
    if (!q) return ofRole;
    return ofRole.filter(
      g =>
        g.name.toLowerCase().includes(q) ||
        g.lastMessageText.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q)
    );
  }

  get createdGroups()  { return this.byRole('creator'); }
  get adminGroups()    { return this.byRole('admin');   }
  get memberGroups()   { return this.byRole('member');  }

  get hasAnyResults(): boolean {
    return (
      this.createdGroups.length +
      this.adminGroups.length +
      this.memberGroups.length > 0
    );
  }

  get totalUnread(): number {
    return this.myGroups.reduce((sum, g) => sum + g.unreadCount, 0);
  }

  openGroup(group: MyGroupDto) {
    this.router.navigate(['/group-chat', group.id]);
  }

  goToCreateGroup() {
    this.router.navigate(['/create-group']);
  }
}
