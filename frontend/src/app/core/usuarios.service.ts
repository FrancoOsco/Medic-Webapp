import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Usuario } from './models';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl + '/api/usuarios';

  listar() { return this.http.get<Usuario[]>(this.base); }
  actualizarMiPerfil(data: { nombre: string; apellido: string }) {
    return this.http.put<Usuario>(this.base + '/me', data);
  }
  actualizar(id: number, data: { nombre: string; apellido: string }) {
    return this.http.put<Usuario>(`${this.base}/${id}`, data);
  }
  eliminar(id: number) { return this.http.delete<void>(`${this.base}/${id}`); }
}
