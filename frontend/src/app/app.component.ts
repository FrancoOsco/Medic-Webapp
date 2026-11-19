import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
  template: `
    <header class="topbar">
      <a routerLink="/dashboard" class="logo">
        + ARIANA
        <span>salud y bienestar</span>
      </a>

      <nav *ngIf="auth.perfil() as usuario" aria-label="Navegación principal">
        <a routerLink="/dashboard" routerLinkActive="active"> Inicio </a>

        <a routerLink="/evaluacion" routerLinkActive="active"> Evaluación </a>

        <a routerLink="/historial" routerLinkActive="active"> Historial </a>

        <a routerLink="/perfil" routerLinkActive="active"> Perfil </a>

        <a *ngIf="usuario.rol === 'ADMIN'" routerLink="/admin/usuarios" routerLinkActive="active">
          Administrar
        </a>

        <button type="button" class="link-button" (click)="auth.logout()">Salir</button>
      </nav>
    </header>

    <main class="layout">
      <router-outlet></router-outlet>
    </main>

    <footer class="app-footer">
      <p>© 2026 ARIANA. Plataforma de orientación y bienestar.</p>
    </footer>
  `,
})
export class AppComponent {
  readonly auth = inject(AuthService);
}
