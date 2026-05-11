import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: false
})
export class EditProfilePage implements OnInit {
  form: FormGroup;
  isLoading = true;

  readonly maxDescLength = 300;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private apiService: ApiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      description: ['', Validators.maxLength(300)],
      searchRadiusKm: [10, [Validators.required, Validators.min(1), Validators.max(500)]],
    });
  }

  ngOnInit() {
    this.apiService.getMyProfile().subscribe({
      next: (p) => {
        this.form.patchValue({
          name: p.name ?? '',
          description: p.description ?? '',
          searchRadiusKm: p.searchRadiusKm,
        });
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  get nameCtrl() { return this.form.get('name')!; }
  get descriptionCtrl() { return this.form.get('description')!; }
  get searchRadiusCtrl() { return this.form.get('searchRadiusKm')!; }
  get descLength(): number { return (this.descriptionCtrl.value ?? '').length; }

  get initials(): string {
    const name: string = this.nameCtrl.value ?? '';
    return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w: string) => w[0].toUpperCase()).join('');
  }

  onRadiusChange(ev: Event) {
    this.searchRadiusCtrl.setValue((ev as CustomEvent).detail.value);
  }

  async onSave() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const loading = await this.loadingCtrl.create({ message: 'Guardando...' });
    await loading.present();

    this.apiService.updateMyProfile({
      name: this.form.value.name,
      description: this.form.value.description || undefined,
      searchRadiusKm: this.form.value.searchRadiusKm,
    }).subscribe({
      next: async () => {
        await loading.dismiss();
        this.router.navigate(['/tabs/profile']);
        return;
      },
      error: async () => {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Error al guardar el perfil. Intenta de nuevo.',
          duration: 3000,
          color: 'danger',
        });
        await toast.present();
      },
    });
  }

  goBack() {
    this.navCtrl.back();
  }
}
