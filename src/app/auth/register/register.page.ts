import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {
  registerForm: FormGroup;
  showPassword = false;
  showConfirm = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        terms: [false, Validators.requiredTrue]
      },
      { validators: passwordsMatch }
    );
  }

  get nameControl() { return this.registerForm.get('name'); }
  get emailControl() { return this.registerForm.get('email'); }
  get passwordControl() { return this.registerForm.get('password'); }
  get confirmControl() { return this.registerForm.get('confirmPassword'); }
  get termsControl() { return this.registerForm.get('terms'); }

  get confirmMismatch() {
    return this.registerForm.errors?.['passwordsMismatch'] && this.confirmControl?.touched;
  }

  togglePassword() { this.showPassword = !this.showPassword; }
  toggleConfirm() { this.showConfirm = !this.showConfirm; }

  async onRegister() {
    if (this.registerForm.invalid) return;

    const loading = await this.loadingCtrl.create({ message: 'Creando cuenta...' });
    await loading.present();

    this.apiService.register({
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    }).subscribe({
      next: async (res) => {
        await this.authService.saveToken(res.token);
        await loading.dismiss();
        this.router.navigate(['/tabs/discovery'], { replaceUrl: true });
      },
      error: async (err) => {
        await loading.dismiss();
        const message = err.status === 409
          ? 'Ya existe una cuenta con ese correo'
          : 'Error al crear la cuenta. Intenta de nuevo.';
        const toast = await this.toastCtrl.create({ message, duration: 3000, color: 'danger' });
        await toast.present();
      },
    });
  }

  registerWithGoogle() {
    console.log('Registro con Google — próximamente');
  }

  registerWithFacebook() {
    console.log('Registro con Facebook — próximamente');
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
