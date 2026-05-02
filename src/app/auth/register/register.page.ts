import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterDto } from '../dtos/register.dto';

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

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
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

  onRegister() {
    if (this.registerForm.invalid) return;

    const dto: RegisterDto = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    console.log('Register DTO:', dto);
    // TODO: conectar con servicio de autenticación
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
