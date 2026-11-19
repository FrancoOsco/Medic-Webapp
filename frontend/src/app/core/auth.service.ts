import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly api = environment.apiUrl;
  private readonly tokenSignal = signal<string | null>(null);
  readonly perfil = signal<Usuario | null>(null);

  get accessToken(): string | null { return this.tokenSignal(); }

  setToken(token: string | null): void {
    this.tokenSignal.set(token);
  }

  setPerfil(usuario: Usuario): void {
    this.perfil.set(usuario);
  }

  login(data: { email: string; password: string }): Observable<Usuario> {
    return this.http.post<{ token: string }>(`${this.api}/api/auth/login`, data, { withCredentials: true }).pipe(
      tap(res => this.setToken(res.token)),
      switchMap(() => this.cargarPerfil()),
      catchError(err => { this.limpiar(); throw err; })
    );
  }

  refresh(): Observable<string> {
    return this.http.post<{ token: string }>(`${this.api}/api/auth/refresh`, {}, { withCredentials: true }).pipe(
      tap(response => this.setToken(response.token)),
      map(response => response.token)
    );
  }

  cargarPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.api}/api/usuarios/me`, { withCredentials: true }).pipe(
      tap(usuario => this.setPerfil(usuario))
    );
  }

  ensureSession(): Observable<Usuario | null> {
    if (this.perfil()) return of(this.perfil());
    if (this.accessToken) return this.cargarPerfil().pipe(catchError(() => of(null)));
    return this.refresh().pipe(
      switchMap(() => this.cargarPerfil()),
      catchError(() => { this.limpiar(); return of(null); })
    );
  }

  logout(): void {
    this.http.post(`${this.api}/api/auth/logout`, {}, { withCredentials: true }).pipe(
      finalize(() => {
        this.limpiar();
        void this.router.navigateByUrl('/login');
      })
    ).subscribe({ error: () => { /* se limpió la sesión local */ } });
  }

  limpiar(): void {
    this.tokenSignal.set(null);
    this.perfil.set(null);
  }
}
