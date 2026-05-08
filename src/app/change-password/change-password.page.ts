import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';

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
    private toastCtrl: ToastController
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

    console.log('Cambiando contraseña...');

    const toast = await this.toastCtrl.create({
      message: 'Contraseña actualizada correctamente',
      duration: 2500,
      color: 'success',
      position: 'bottom',
      icon: 'checkmark-circle-outline'
    });
    await toast.present();
    this.navCtrl.back();
  }

  goBack() {
    this.navCtrl.back();
  }
}
