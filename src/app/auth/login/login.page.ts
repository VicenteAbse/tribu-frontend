import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginDto } from '../../dtos/login.dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  loginForm: FormGroup;
  showPassword = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (this.loginForm.invalid) return;

    const dto: LoginDto = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    console.log('Login DTO:', dto);
    this.router.navigate(['/tabs/discovery']);
    // TODO: conectar con servicio de autenticación
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
