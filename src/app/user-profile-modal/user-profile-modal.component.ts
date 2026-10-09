import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { PublicUserProfile } from '../dtos/api.dto';

const AVATAR_PALETTE = ['#6C63FF', '#FF6584', '#4ECDC4', '#F7B731', '#A55EEA', '#FC5C65', '#26de81', '#fd9644'];

function avatarColor(seed: string): string {
  let hash = 0;
  for (const c of seed) hash = (hash * 31 + c.charCodeAt(0)) | 0;
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

@Component({
  selector: 'app-user-profile-modal',
  templateUrl: './user-profile-modal.component.html',
  styleUrls: ['./user-profile-modal.component.scss'],
  standalone: false
})
export class UserProfileModalComponent implements OnInit {
  @Input() userUuid!: string;

  profile: PublicUserProfile | null = null;
  isLoading = true;

  constructor(private modalCtrl: ModalController, private api: ApiService) {}

  ngOnInit() {
    this.api.getUserProfile(this.userUuid).subscribe({
      next: (p) => { this.profile = p; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  get avatarColor(): string {
    return this.profile ? avatarColor(this.profile.uuid) : '#6C63FF';
  }

  get initials(): string {
    if (!this.profile?.name?.trim()) return '?';
    return this.profile.name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  }

  get memberSince(): string {
    if (!this.profile?.createdAt) return '';
    return new Date(this.profile.createdAt).toLocaleDateString('es', { month: 'long', year: 'numeric' });
  }

  get genderLabel(): string {
    const map: Record<string, string> = { MALE: 'Hombre', FEMALE: 'Mujer', OTHER: 'Otro' };
    return this.profile ? (map[this.profile.gender] ?? '') : '';
  }

  dismiss() { this.modalCtrl.dismiss(); }
}
