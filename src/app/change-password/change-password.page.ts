import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const newPass = group.get('newPassword')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return newPass && confirm && newPass !== confirm ? { mismatch: true } : null;
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: false
})
export class ChangePasswordPage {
  form: FormGroup;
  showCurrent = false;
  showNew = false;
  showConfirm = false;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private api: ApiService
  ) {
    this.form = this.fb.group({
      currentPassword:  ['', [Validators.required]],
      newPassword:      ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword:  ['', [Validators.required]]
    }, { validators: passwordsMatch });
  }

  get currentCtrl()  { return this.form.get('currentPassword')!; }
  get newCtrl()      { return this.form.get('newPassword')!; }
  get confirmCtrl()  { return this.form.get('confirmPassword')!; }
  get mismatch(): boolean {
    return this.form.hasError('mismatch') && this.confirmCtrl.touched;
  }

  async onSave() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    try {
      await this.api.changePassword({
        currentPassword: this.currentCtrl.value,
        newPassword: this.newCtrl.value
      }).toPromise();

      const toast = await this.toastCtrl.create({
        message: 'Contraseña actualizada correctamente',
        duration: 2500,
        color: 'success',
        position: 'bottom',
        icon: 'checkmark-circle-outline'
      });
      await toast.present();
      this.navCtrl.back();
    } catch (err: any) {
      const msg = err?.error?.message ?? 'Error al cambiar la contraseña';
      const toast = await this.toastCtrl.create({
        message: msg,
        duration: 3000,
        color: 'danger',
        position: 'bottom',
        icon: 'alert-circle-outline'
      });
      await toast.present();
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}
