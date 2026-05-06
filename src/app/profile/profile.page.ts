import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileDto } from '../dtos/user-profile.dto';

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

const MY_PROFILE: UserProfileDto = {
  id: 0,
  name: 'Vicente Abse',
  username: '@vicenteabse',
  bio: 'Amante de la fotografía urbana y el senderismo 🏔️ Siempre en busca de nuevas aventuras y personas con quienes compartirlas.',
  location: 'Santiago, Chile',
  avatarColor: '#6C63FF',
  initials: 'VA',
  interests: ['Deporte & Naturaleza', 'Arte & Creatividad', 'Fotografía', 'Senderismo', 'Cultura & Lectura'],
  stats: { groupsCreated: 1, groupsJoined: 7, totalMembers: 124 },
  joinedDate: 'Enero 2024'
};

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage {
  readonly profile: UserProfileDto = MY_PROFILE;

  readonly settingsSections: SettingsSection[] = [
    {
      title: 'Cuenta',
      items: [
        { icon: 'person-outline',       label: 'Editar perfil',       iconBg: '#6C63FF', action: 'editProfile'     },
        { icon: 'lock-closed-outline',  label: 'Cambiar contraseña',  iconBg: '#6C63FF', action: 'changePassword'  },
        { icon: 'image-outline',        label: 'Foto de perfil',      iconBg: '#6C63FF', action: 'editPhoto'       }
      ]
    },
    {
      title: 'Preferencias',
      items: [
        { icon: 'notifications-outline', label: 'Notificaciones',     iconBg: '#4ECDC4', action: 'notifications'  },
        { icon: 'eye-outline',           label: 'Privacidad',         iconBg: '#4ECDC4', action: 'privacy'        },
        { icon: 'language-outline',      label: 'Idioma',             iconBg: '#4ECDC4', action: 'language', value: 'Español' },
        { icon: 'color-palette-outline', label: 'Apariencia',         iconBg: '#4ECDC4', action: 'appearance', value: 'Oscuro' }
      ]
    },
    {
      title: 'Soporte',
      items: [
        { icon: 'help-circle-outline',   label: 'Centro de ayuda',       iconBg: '#F7B731', action: 'help'   },
        { icon: 'chatbox-outline',       label: 'Contactar soporte',     iconBg: '#F7B731', action: 'support'},
        { icon: 'flag-outline',          label: 'Reportar un problema',  iconBg: '#F7B731', action: 'report' }
      ]
    }
  ];

  constructor(private router: Router) {}

  get heroGradient(): string {
    return `linear-gradient(175deg, ${this.profile.avatarColor}55 0%, #0f0c29 55%)`;
  }

  onSettingTap(action: string) {
    console.log('Setting tapped:', action);
    // TODO: conectar con navegación/servicios reales
  }

  signOut() {
    console.log('Cerrando sesión...');
    this.router.navigate(['/auth/login']);
  }
}
