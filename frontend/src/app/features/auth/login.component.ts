import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { mensajeError } from '../../core/error.utils';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="card form-card">
      <h1>Bienvenido a ARIANA</h1>
      <p class="muted">Inicia sesión para acceder a tus evaluaciones de bienestar.</p>
      <form class="stack" [formGroup]="form" (ngSubmit)="entrar()">
        <div class="field">
          <label for="email">Correo electrónico</label>
          <input
            id="email"
            formControlName="email"
            type="email"
            autocomplete="username"
            placeholder="ejemplo@correo.com"
          />
        </div>
        <div class="field">
          <label for="password">Contraseña</label>
          <input
            id="password"
            formControlName="password"
            type="password"
            autocomplete="current-password"
          />
        </div>
        <div *ngIf="error" class="alert" role="alert">{{ error }}</div>
        <button class="primary" type="submit" [disabled]="form.invalid || cargando">
          {{ cargando ? 'Validando...' : 'Iniciar sesión' }}
        </button>
      </form>
      <p class="small">¿No tienes cuenta? <a routerLink="/register">Regístrate</a></p>
      <a class="small" routerLink="/forgot-password">Olvidé mi contraseña</a>
    </section>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  cargando = false;
  error = '';
  entrar(): void {
    if (this.form.invalid || this.cargando) return;
    this.cargando = true;
    this.error = '';
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.cargando = false;
        void this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.error = mensajeError(err);
        this.cargando = false;
      },
    });
  }
}
