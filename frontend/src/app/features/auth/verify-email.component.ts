import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { mensajeError } from '../../core/error.utils';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `<section class="card form-card">
    <h1>Verificación de correo</h1>
    <p *ngIf="cargando">Verificando tu cuenta...</p>
    <div *ngIf="error" class="alert">{{ error }}</div>
    <div *ngIf="exito" class="success">Tu correo fue verificado. Ya puedes iniciar sesión.</div>
    <p><a routerLink="/login">Ir al inicio de sesión</a></p>
  </section>`,
})
export class VerifyEmailComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  cargando = false;
  exito = false;
  error = '';
  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.error = 'Falta el token de verificación en el enlace.';
      return;
    }
    this.cargando = true;
    this.http.post(environment.apiUrl + '/api/auth/verify-email', { token }).subscribe({
      next: () => {
        this.exito = true;
        this.cargando = false;
      },
      error: (err) => {
        this.error = mensajeError(err);
        this.cargando = false;
      },
    });
  }
}
