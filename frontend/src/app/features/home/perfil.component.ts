import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { UsuariosService } from '../../core/usuarios.service';
import { mensajeError } from '../../core/error.utils';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `<section class="card narrow">
    <h1>Mi perfil</h1>
    <p class="muted">
      Correo: <strong>{{ auth.perfil()?.email }}</strong> · Rol: {{ auth.perfil()?.rol }}
    </p>
    <form class="stack" [formGroup]="form" (ngSubmit)="guardar()">
      <div class="field">
        <label for="nombre">Nombre</label><input id="nombre" formControlName="nombre" />
      </div>
      <div class="field">
        <label for="apellido">Apellido</label><input id="apellido" formControlName="apellido" />
      </div>
      <div class="alert" *ngIf="error">{{ error }}</div>
      <div class="success" *ngIf="exito">Perfil actualizado.</div>
      <button type="submit" class="primary" [disabled]="form.invalid || cargando">
        Guardar cambios
      </button>
    </form>
  </section>`,
})
export class PerfilComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly usuarios = inject(UsuariosService);
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    apellido: ['', [Validators.required, Validators.maxLength(100)]],
  });
  error = '';
  exito = false;
  cargando = false;
  ngOnInit(): void {
    const u = this.auth.perfil();
    if (u) this.form.patchValue({ nombre: u.nombre, apellido: u.apellido });
  }
  guardar(): void {
    if (this.form.invalid || this.cargando) return;
    this.cargando = true;
    this.error = '';
    this.exito = false;
    this.usuarios.actualizarMiPerfil(this.form.getRawValue()).subscribe({
      next: (u) => {
        this.auth.setPerfil(u);
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
