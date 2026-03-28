import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login.component',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  //Inyeccion de servicios
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  //Estados con signal
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  //Configuracion del formulario
  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      this.authService.login(this.loginForm.getRawValue()).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/todos']);
        },
        error: () => {
          this.isLoading.set(false);
          this.errorMessage.set('Credenciales invalidas. Verifica el API');
        },
      });
    }
  }
}
