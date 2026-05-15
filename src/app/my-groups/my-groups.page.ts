import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { GroupSummary } from '../dtos/api.dto';

const GROUP_COLORS = ['#4ECDC4', '#FF6584', '#6C63FF', '#F7B731', '#A55EEA', '#FC5C65', '#26de81', '#45AAB8', '#f7797d'];

interface GroupDisplay {
  id: number;
  name: string;
  description: string;
  backgroundColor: string;
  role: 'admin' | 'member';
  statusLabel: string;
}

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.page.html',
  styleUrls: ['./my-groups.page.scss'],
  standalone: false
})
export class MyGroupsPage implements OnInit {
  searchQuery = '';
  groups: GroupDisplay[] = [];

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit() {
    this.api.getMyGroups().subscribe({
      next: (summaries) => {
        this.groups = summaries.map(g => this.toDisplay(g));
      }
    });
  }

  private toDisplay(g: GroupSummary): GroupDisplay {
    return {
      id: g.id,
      name: g.name,
      description: g.description,
      backgroundColor: GROUP_COLORS[g.id % GROUP_COLORS.length],
      role: g.role === 'ADMIN' ? 'admin' : 'member',
      statusLabel: g.status === 'ACTIVE' ? 'Chat activo' : 'En espera de miembros'
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
    return this.adminGroups.length + this.memberGroups.length > 0;
  }

  openGroup(group: GroupDisplay) {
    this.router.navigate(['/group-chat', group.id]);
  }

  goToCreateGroup() {
    this.router.navigate(['/create-group']);
  }
}
