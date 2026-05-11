import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ViewWillEnter } from '@ionic/angular';
import { ThemeService } from '../services/theme.service';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { UserProfile } from '../dtos/api.dto';

const AVATAR_PALETTE = ['#6C63FF', '#FF6584', '#4ECDC4', '#F7B731', '#A55EEA', '#FC5C65', '#26de81', '#fd9644'];

function avatarColor(seed: string): string {
  let hash = 0;
  for (const c of seed) hash = (hash * 31 + c.charCodeAt(0)) | 0;
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function initials(name: string | null): string {
  if (!name?.trim()) return '?';
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

interface SettingsItem {
  icon: string;
  label: string;
  iconBg: string;
  action: string;
  value?: string;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements ViewWillEnter {
  profile: UserProfile | null = null;
  isLoading = false;

  readonly settingsSections: SettingsSection[] = [
    {
      title: 'Cuenta',
      items: [
        { icon: 'person-outline',       label: 'Editar perfil',       iconBg: '#6C63FF', action: 'editProfile'     },
        { icon: 'lock-closed-outline',  label: 'Cambiar contraseña',  iconBg: '#6C63FF', action: 'changePassword'  },
        // { icon: 'image-outline',        label: 'Foto de perfil',      iconBg: '#6C63FF', action: 'editPhoto'       }
      ]
    },
    {
      title: 'Preferencias',
      items: [
        // { icon: 'notifications-outline', label: 'Notificaciones',     iconBg: '#4ECDC4', action: 'notifications'  },
        // { icon: 'eye-outline',           label: 'Privacidad',         iconBg: '#4ECDC4', action: 'privacy'        },
        // { icon: 'language-outline',      label: 'Idioma',             iconBg: '#4ECDC4', action: 'language', value: 'Español' },
        { icon: 'color-palette-outline', label: 'Apariencia',         iconBg: '#4ECDC4', action: 'appearance', value: 'Oscuro' }
      ]
    },
    {
      title: 'Soporte',
      items: [
        // { icon: 'help-circle-outline',   label: 'Centro de ayuda',       iconBg: '#F7B731', action: 'help'   },
        // { icon: 'chatbox-outline',       label: 'Contactar soporte',     iconBg: '#F7B731', action: 'support'},
        { icon: 'flag-outline',          label: 'Reportar un problema',  iconBg: '#F7B731', action: 'report' }
      ]
    }
  ];

  constructor(
    private router: Router,
    private actionSheet: ActionSheetController,
    public themeService: ThemeService,
    private authService: AuthService,
    private apiService: ApiService,
  ) {}

  ionViewWillEnter() {
    this.isLoading = true;
    this.apiService.getMyProfile().subscribe({
      next: (p) => { this.profile = p; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  get avatarColor(): string {
    return this.profile ? avatarColor(this.profile.email) : '#6C63FF';
  }

  get initials(): string {
    return this.profile ? initials(this.profile.name) : '?';
  }

  get heroGradient(): string {
    const bg = this.themeService.theme === 'light' ? '#f2f1fb' : '#0f0c29';
    return `linear-gradient(175deg, ${this.avatarColor}55 0%, ${bg} 55%)`;
  }

  async onSettingTap(action: string) {
    if (action === 'editProfile') {
      this.router.navigate(['/tabs/profile/edit-profile']);
      return;
    }
    if (action === 'changePassword') {
      this.router.navigate(['/change-password']);
      return;
    }
    if (action === 'report') {
      this.router.navigate(['/report-problem']);
      return;
    }
    if (action === 'appearance') {
      const sheet = await this.actionSheet.create({
        header: 'Apariencia',
        buttons: [
          {
            text: 'Oscuro',
            icon: 'moon-outline',
            handler: () => this.themeService.setTheme('dark')
          },
          {
            text: 'Claro',
            icon: 'sunny-outline',
            handler: () => this.themeService.setTheme('light')
          },
          {
            text: 'Sistema',
            icon: 'phone-portrait-outline',
            handler: () => this.themeService.setTheme('system')
          },
          { text: 'Cancelar', role: 'cancel' }
        ]
      });
      await sheet.present();
      return;
    }
    console.log('Setting tapped:', action);
  }

  async signOut() {
    await this.authService.clearToken();
    this.router.navigate(['/auth/login'], { replaceUrl: true });
  }
}
