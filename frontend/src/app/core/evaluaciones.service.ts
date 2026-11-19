import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Evaluacion, EvaluacionResumen, Pregunta, Respuesta } from './models';

@Injectable({ providedIn: 'root' })
export class EvaluacionesService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  preguntas() { return this.http.get<Pregunta[]>(this.api + '/api/preguntas'); }
  crear(respuestas: Respuesta[]) {
    return this.http.post<Evaluacion>(this.api + '/api/evaluaciones', { respuestas });
  }
  historial() {
    return this.http.get<EvaluacionResumen[]>(this.api + '/api/evaluaciones/mis-evaluaciones');
  }
  detalle(id: number) {
    return this.http.get<Evaluacion>(this.api + '/api/evaluaciones/' + id);
  }
}
