import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { mensajeError } from '../../core/error.utils';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="card form-card">
      <h1>Crear cuenta</h1>
      <p class="muted">Regístrate para guardar tus orientaciones de bienestar.</p>
      <form class="stack" [formGroup]="form" (ngSubmit)="registrar()">
        <div class="field">
          <label for="nombre">Nombre</label
          ><input id="nombre" formControlName="nombre" autocomplete="given-name" />
        </div>
        <div class="field">
          <label for="apellido">Apellido</label
          ><input id="apellido" formControlName="apellido" autocomplete="family-name" />
        </div>
        <div class="field">
          <label for="email">Correo</label
          ><input id="email" formControlName="email" type="email" autocomplete="email" />
        </div>
        <div class="field">
          <label for="password">Contraseña</label
          ><input
            id="password"
            formControlName="password"
            type="password"
            autocomplete="new-password"
          />
          <small>Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.</small>
        </div>
        <div class="alert" *ngIf="error">{{ error }}</div>
        <div class="success" *ngIf="exito">
          Cuenta creada. Verifica el correo para iniciar sesión. En desarrollo, el enlace aparecerá
          en la consola del backend.
        </div>
        <button class="primary" type="submit" [disabled]="form.invalid || cargando || exito">
          {{ cargando ? 'Registrando...' : 'Registrarme' }}
        </button>
      </form>
      <p><a routerLink="/login">Volver a inicio de sesión</a></p>
    </section>
  `,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    apellido: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/),
      ],
    ],
  });
  error = '';
  exito = false;
  cargando = false;
  registrar(): void {
    if (this.form.invalid || this.cargando) return;
    this.cargando = true;
    this.error = '';
    this.http.post(environment.apiUrl + '/api/auth/register', this.form.getRawValue()).subscribe({
      next: () => {
        this.cargando = false;
        this.exito = true;
      },
      error: (err) => {
        this.cargando = false;
        this.error = mensajeError(err);
      },
    });
  }
}
