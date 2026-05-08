import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-report-problem',
  templateUrl: './report-problem.page.html',
  styleUrls: ['./report-problem.page.scss'],
  standalone: false
})
export class ReportProblemPage {
  readonly maxLength = 500;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {
    this.form = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(this.maxLength)]]
    });
  }

  get messageCtrl() { return this.form.get('message')!; }
  get charCount(): number { return (this.messageCtrl.value ?? '').length; }

  async onSend() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    console.log('Reporte enviado:', this.messageCtrl.value);

    const toast = await this.toastCtrl.create({
      message: 'Reporte enviado. ¡Gracias por tu ayuda!',
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
