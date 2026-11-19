import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { mensajeError } from '../../core/error.utils';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `<section class="card form-card">
    <h1>Restablecer contraseña</h1>
    <form class="stack" [formGroup]="form" (ngSubmit)="guardar()">
      <div class="field">
        <label for="password">Nueva contraseña</label
        ><input
          id="password"
          type="password"
          formControlName="nuevaPassword"
          autocomplete="new-password"
        />
        <small>Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.</small>
      </div>
      <div *ngIf="error" class="alert">{{ error }}</div>
      <div *ngIf="exito" class="success">Tu contraseña fue actualizada.</div>
      <button class="primary" type="submit" [disabled]="form.invalid || cargando || exito">
        Guardar contraseña
      </button>
    </form>
    <p><a routerLink="/login">Volver</a></p>
  </section>`,
})
export class ResetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  readonly form = this.fb.nonNullable.group({
    nuevaPassword: [
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
  guardar(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.error = 'Enlace sin token de recuperación.';
      return;
    }
    if (this.form.invalid || this.cargando) return;
    this.cargando = true;
    this.error = '';
    this.http
      .post(environment.apiUrl + '/api/auth/reset-password', {
        token,
        nuevaPassword: this.form.getRawValue().nuevaPassword,
      })
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
