import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';

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
    private toastCtrl: ToastController,
    private api: ApiService
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

    try {
      await this.api.sendReport({ message: this.messageCtrl.value }).toPromise();

      const toast = await this.toastCtrl.create({
        message: 'Reporte enviado. ¡Gracias por tu ayuda!',
        duration: 2500,
        color: 'success',
        position: 'bottom',
        icon: 'checkmark-circle-outline'
      });
      await toast.present();
      this.navCtrl.back();
    } catch {
      const toast = await this.toastCtrl.create({
        message: 'Error al enviar el reporte. Inténtalo de nuevo.',
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
