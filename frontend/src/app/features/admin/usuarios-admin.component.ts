import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { UsuariosService } from '../../core/usuarios.service';
import { Usuario } from '../../core/models';
import { mensajeError } from '../../core/error.utils';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<section class="card">
    <h1>Administración de usuarios</h1>
    <p class="muted">
      Consultar, editar nombre y apellido, o eliminar cuentas existentes. La autorización se aplica
      en Spring Boot.
    </p>
    <p *ngIf="cargando">Cargando usuarios...</p>
    <div *ngIf="error" class="alert">{{ error }}</div>
    <div *ngIf="exito" class="success">{{ exito }}</div>
    <div class="table-wrap" *ngIf="!cargando">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let u of usuarios">
            <td>{{ u.id }}</td>
            <td>
              <input
                *ngIf="editando === u.id"
                aria-label="Editar nombre"
                [(ngModel)]="nombre"
                maxlength="100"
              /><span *ngIf="editando !== u.id">{{ u.nombre }}</span>
            </td>
            <td>
              <input
                *ngIf="editando === u.id"
                aria-label="Editar apellido"
                [(ngModel)]="apellido"
                maxlength="100"
              /><span *ngIf="editando !== u.id">{{ u.apellido }}</span>
            </td>
            <td>{{ u.email }}</td>
            <td>{{ u.rol }}</td>
            <td>
              <div class="actions">
                <button
                  *ngIf="editando !== u.id"
                  class="btn secondary"
                  type="button"
                  (click)="editar(u)"
                >
                  Editar
                </button>
                <button
                  *ngIf="editando === u.id"
                  class="btn"
                  type="button"
                  [disabled]="trabajando || !nombre.trim() || !apellido.trim()"
                  (click)="guardar(u.id)"
                >
                  Guardar
                </button>
                <button
                  *ngIf="editando === u.id"
                  class="btn secondary"
                  type="button"
                  (click)="editando = null"
                >
                  Cancelar
                </button>
                <button
                  class="btn danger"
                  type="button"
                  (click)="eliminar(u)"
                  [disabled]="trabajando || auth.perfil()?.id === u.id"
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>`,
})
export class UsuariosAdminComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly service = inject(UsuariosService);
  usuarios: Usuario[] = [];
  cargando = true;
  trabajando = false;
  error = '';
  exito = '';
  editando: number | null = null;
  nombre = '';
  apellido = '';
  ngOnInit(): void {
    this.recargar();
  }
  recargar(): void {
    this.service.listar().subscribe({
      next: (us) => {
        this.usuarios = us;
        this.cargando = false;
      },
      error: (err) => {
        this.error = mensajeError(err);
        this.cargando = false;
      },
    });
  }
  editar(u: Usuario): void {
    this.editando = u.id;
    this.nombre = u.nombre;
    this.apellido = u.apellido;
    this.error = '';
    this.exito = '';
  }
  guardar(id: number): void {
    if (!this.nombre.trim() || !this.apellido.trim() || this.trabajando) return;
    this.trabajando = true;
    this.error = '';
    this.exito = '';
    this.service.actualizar(id, { nombre: this.nombre, apellido: this.apellido }).subscribe({
      next: (u) => {
        this.usuarios = this.usuarios.map((item) => (item.id === id ? u : item));
        if (this.auth.perfil()?.id === id) this.auth.setPerfil(u);
        this.trabajando = false;
        this.editando = null;
        this.exito = 'Usuario actualizado.';
      },
      error: (err) => {
        this.error = mensajeError(err);
        this.trabajando = false;
      },
    });
  }
  eliminar(u: Usuario): void {
    if (this.auth.perfil()?.id === u.id || this.trabajando) return;
    if (
      !window.confirm(
        `¿Eliminar a ${u.nombre} ${u.apellido}? Se eliminarán también sus evaluaciones.`,
      )
    )
      return;
    this.trabajando = true;
    this.error = '';
    this.exito = '';
    this.service.eliminar(u.id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter((x) => x.id !== u.id);
        this.exito = 'Cuenta eliminada.';
        this.trabajando = false;
      },
      error: (err) => {
        this.error = mensajeError(err);
        this.trabajando = false;
      },
    });
  }
}
