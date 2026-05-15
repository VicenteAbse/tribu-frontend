import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { ApiService } from '../services/api.service';
import { Gender, GenderPreference, GroupCategory, JoinPolicy } from '../dtos/api.dto';

const COLOR_PALETTE = [
  '#4ECDC4', '#6C63FF', '#FF6584', '#F7B731',
  '#A55EEA', '#FC5C65', '#26de81', '#fd9644', '#2d98da'
];

const GENDER_OWN_OPTION: Record<Gender, { value: GenderPreference; label: string } | null> = {
  MALE:   { value: 'MEN_ONLY',   label: 'Solo hombres' },
  FEMALE: { value: 'WOMEN_ONLY', label: 'Solo mujeres' },
  OTHER:  null,
};

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.page.html',
  styleUrls: ['./create-group.page.scss'],
  standalone: false
})
export class CreateGroupPage implements OnInit {
  form: FormGroup;

  readonly categories: { value: GroupCategory; label: string }[] = [
    { value: 'DEPORTES',    label: 'Deporte' },
    { value: 'ARTE',        label: 'Arte & Creatividad' },
    { value: 'CULTURA',     label: 'Cultura & Ocio' },
    { value: 'TECNOLOGIA',  label: 'Tecnología' },
    { value: 'MUSICA',      label: 'Música' },
    { value: 'GASTRONOMIA', label: 'Gastronomía' },
  ];

  genderOptions: { value: GenderPreference; label: string }[] = [
    { value: 'MIXED', label: 'Mixto' },
  ];

  readonly joinPolicies: { value: JoinPolicy; label: string; sub: string; icon: string }[] = [
    {
      value: 'OPEN',
      label: 'Acceso libre',
      sub: 'Cualquiera que da like se une directamente al grupo.',
      icon: 'flash-outline'
    },
    {
      value: 'APPROVAL_REQUIRED',
      label: 'Con aprobación',
      sub: 'El creador o un admin debe aprobar cada solicitud de ingreso.',
      icon: 'shield-checkmark-outline'
    }
  ];

  imageSlots: (string | null)[] = [null, null, null];

  private latitude: number | undefined;
  private longitude: number | undefined;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.form = this.fb.group({
      name:             ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description:      ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
      genderPreference: ['MIXED', Validators.required],
      category:         ['', Validators.required],
      minMembers:       [2,  [Validators.required, Validators.min(2), Validators.max(50)]],
      maxMembers:       [20, [Validators.required, Validators.min(4), Validators.max(100)]],
      joinPolicy:       ['OPEN', Validators.required]
    });
  }

  ngOnInit() {
    this.api.getMyProfile().subscribe({
      next: (profile) => {
        const own = GENDER_OWN_OPTION[profile.gender];
        this.genderOptions = own
          ? [{ value: 'MIXED', label: 'Mixto' }, own]
          : [{ value: 'MIXED', label: 'Mixto' }];
      }
    });

    Geolocation.getCurrentPosition({ timeout: 5000 }).then((pos) => {
      this.latitude  = pos.coords.latitude;
      this.longitude = pos.coords.longitude;
    }).catch(() => {});
  }

  get nameCtrl()   { return this.form.get('name')!; }
  get descCtrl()   { return this.form.get('description')!; }
  get catCtrl()    { return this.form.get('category')!; }
  get policyCtrl() { return this.form.get('joinPolicy')!; }
  get genderCtrl() { return this.form.get('genderPreference')!; }
  get minCtrl()    { return this.form.get('minMembers')!; }
  get maxCtrl()    { return this.form.get('maxMembers')!; }

  get nameLen()     { return (this.nameCtrl.value as string).length; }
  get descLen()     { return (this.descCtrl.value as string).length; }
  get filledSlots() { return this.imageSlots.filter(Boolean).length; }

  cycleSlotColor(index: number) {
    const current = this.imageSlots[index];
    const idx = current ? COLOR_PALETTE.indexOf(current) : -1;
    this.imageSlots[index] = COLOR_PALETTE[(idx + 1) % COLOR_PALETTE.length];
  }

  clearSlot(index: number, event: Event) {
    event.stopPropagation();
    this.imageSlots[index] = null;
  }

  selectCategory(cat: GroupCategory) { this.catCtrl.setValue(cat); }
  selectGender(g: GenderPreference)  { this.genderCtrl.setValue(g); }
  setJoinPolicy(p: JoinPolicy)       { this.policyCtrl.setValue(p); }

  async onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const loading = await this.loadingCtrl.create({ message: 'Creando grupo...' });
    await loading.present();

    const v = this.form.value;
    this.api.createGroup({
      name:             (v.name as string).trim(),
      description:      (v.description as string).trim(),
      genderPreference: v.genderPreference,
      category:         v.category,
      minMembers:       +v.minMembers,
      maxMembers:       +v.maxMembers,
      joinPolicy:       v.joinPolicy,
      latitude:         this.latitude,
      longitude:        this.longitude,
    }).subscribe({
      next: async () => {
        await loading.dismiss();
        this.navCtrl.back();
      },
      error: async () => {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'No se pudo crear el grupo. Intenta de nuevo.',
          duration: 3000,
          color: 'danger',
          position: 'bottom'
        });
        await toast.present();
      }
    });
  }

  goBack() { this.navCtrl.back(); }
}
