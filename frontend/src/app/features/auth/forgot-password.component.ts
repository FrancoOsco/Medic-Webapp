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
  template: `<section class="card form-card">
    <h1>Recuperar contraseña</h1>
    <p class="muted">Introduce el correo de tu cuenta para obtener el enlace de recuperación.</p>
    <form class="stack" [formGroup]="form" (ngSubmit)="enviar()">
      <div class="field">
        <label for="email">Correo</label><input id="email" type="email" formControlName="email" />
      </div>
      <div *ngIf="error" class="alert">{{ error }}</div>
      <div *ngIf="exito" class="success">
        Si existe la cuenta, se generó el enlace. Revisa tu correo o, en desarrollo, la consola del
        backend.
      </div>
      <button class="primary" type="submit" [disabled]="form.invalid || cargando">
        Enviar instrucciones
      </button>
    </form>
    <p><a routerLink="/login">Volver</a></p>
  </section>`,
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });
  error = '';
  exito = false;
  cargando = false;
  enviar(): void {
    if (this.form.invalid || this.cargando) return;
    this.cargando = true;
    this.error = '';
    this.http
      .post(environment.apiUrl + '/api/auth/forgot-password', this.form.getRawValue())
      .subscribe({
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
