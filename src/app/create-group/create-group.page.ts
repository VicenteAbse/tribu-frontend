import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { CreateGroupDto, JoinPolicy } from '../dtos/create-group.dto';

const COLOR_PALETTE = [
  '#4ECDC4', '#6C63FF', '#FF6584', '#F7B731',
  '#A55EEA', '#FC5C65', '#26de81', '#fd9644', '#2d98da'
];

const MAX_IMAGES = 3;

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.page.html',
  styleUrls: ['./create-group.page.scss'],
  standalone: false
})
export class CreateGroupPage {
  form: FormGroup;

  readonly categories = [
    'Deporte & Naturaleza',
    'Cultura & Lectura',
    'Arte & Creatividad',
    'Tecnología',
    'Música',
    'Gastronomía',
    'Bienestar',
    'Cultura & Ocio'
  ];

  readonly joinPolicies: { value: JoinPolicy; label: string; sub: string; icon: string }[] = [
    {
      value: 'open',
      label: 'Acceso libre',
      sub: 'Cualquiera que da like se une directamente al grupo.',
      icon: 'flash-outline'
    },
    {
      value: 'approval',
      label: 'Con aprobación',
      sub: 'El creador o un admin debe aprobar cada solicitud de ingreso.',
      icon: 'shield-checkmark-outline'
    }
  ];

  imageSlots: (string | null)[] = [null, null, null];

  constructor(private fb: FormBuilder, private navCtrl: NavController) {
    this.form = this.fb.group({
      name:        ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
      category:    ['', Validators.required],
      joinPolicy:  ['open', Validators.required]
    });
  }

  get nameCtrl()   { return this.form.get('name')!; }
  get descCtrl()   { return this.form.get('description')!; }
  get catCtrl()    { return this.form.get('category')!; }
  get policyCtrl() { return this.form.get('joinPolicy')!; }

  get nameLen()   { return (this.nameCtrl.value as string).length; }
  get descLen()   { return (this.descCtrl.value as string).length; }
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

  selectCategory(cat: string) {
    this.catCtrl.setValue(cat);
  }

  setJoinPolicy(policy: JoinPolicy) {
    this.policyCtrl.setValue(policy);
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const dto: CreateGroupDto = {
      name:                   this.form.value.name.trim(),
      description:            this.form.value.description.trim(),
      category:               this.form.value.category,
      joinPolicy:             this.form.value.joinPolicy,
      imagePlaceholderColors: this.imageSlots.filter(Boolean) as string[]
    };

    console.log('CreateGroupDto:', dto);
    // TODO: conectar con servicio
  }

  goBack() {
    this.navCtrl.back();
  }
}
