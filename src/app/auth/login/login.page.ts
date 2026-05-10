import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  loginForm: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get emailControl() { return this.loginForm.get('email'); }
  get passwordControl() { return this.loginForm.get('password'); }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onLogin() {
    if (this.loginForm.invalid) return;

    const loading = await this.loadingCtrl.create({ message: 'Iniciando sesión...' });
    await loading.present();

    this.apiService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    }).subscribe({
      next: async (res) => {
        await this.authService.saveToken(res.token);
        await loading.dismiss();
        this.router.navigate(['/tabs/discovery'], { replaceUrl: true });
      },
      error: async (err) => {
        await loading.dismiss();
        const message = err.status === 401
          ? 'Correo o contraseña incorrectos'
          : 'Error al iniciar sesión. Intenta de nuevo.';
        const toast = await this.toastCtrl.create({ message, duration: 3000, color: 'danger' });
        await toast.present();
      },
    });
  }

  loginWithGoogle() {
    console.log('Login con Google — próximamente');
  }

  loginWithFacebook() {
    console.log('Login con Facebook — próximamente');
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }
}
