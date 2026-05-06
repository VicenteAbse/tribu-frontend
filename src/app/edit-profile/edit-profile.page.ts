import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { UserProfileDto } from '../dtos/user-profile.dto';

const AVATAR_COLORS = [
  '#6C63FF', '#FF6584', '#4ECDC4', '#F7B731',
  '#A55EEA', '#FC5C65', '#26de81', '#fd9644', '#2d98da'
];

const CURRENT_PROFILE: UserProfileDto = {
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
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: false
})
export class EditProfilePage {
  readonly avatarColors = AVATAR_COLORS;
  readonly maxBioLength = 160;

  form: FormGroup;
  selectedColor: string;
  showColorPicker = false;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController
  ) {
    this.selectedColor = CURRENT_PROFILE.avatarColor;

    this.form = this.fb.group({
      name: [CURRENT_PROFILE.name, [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
      bio:  [CURRENT_PROFILE.bio,  [Validators.maxLength(this.maxBioLength)]]
    });
  }

  get nameCtrl() { return this.form.get('name')!; }
  get bioCtrl()  { return this.form.get('bio')!; }
  get bioLength(): number { return (this.bioCtrl.value ?? '').length; }

  get initials(): string {
    const name: string = this.nameCtrl.value ?? '';
    return name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('');
  }

  selectColor(color: string) {
    this.selectedColor = color;
    this.showColorPicker = false;
  }

  onSave() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    // TODO: conectar con servicio real
    console.log('Guardando perfil:', {
      ...this.form.value,
      avatarColor: this.selectedColor,
      initials: this.initials
    });

    this.navCtrl.back();
  }

  goBack() {
    this.navCtrl.back();
  }
}
