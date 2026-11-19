import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EvaluacionesService } from '../../core/evaluaciones.service';
import { Evaluacion } from '../../core/models';
import { mensajeError } from '../../core/error.utils';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `<section class="card narrow">
    <h1>Resultado de orientación</h1>
    <p class="muted" *ngIf="resultado">
      Evaluación #{{ resultado.id }} · {{ resultado.fecha | date: 'medium' : '' : 'es' }}
    </p>
    <p *ngIf="cargando">Cargando resultado...</p>
    <p class="alert" *ngIf="error">{{ error }}</p>
    <ng-container *ngIf="resultado as r">
      <div class="notice">
        {{ r.resumen }}. Esta evaluación no es un diagnóstico ni sustituye la atención médica
        profesional.
      </div>
      <h2 style="margin-top:24px">Recomendaciones generales</h2>
      <ul class="bullet-list">
        <li *ngFor="let recomendacion of r.recomendaciones">{{ recomendacion }}</li>
      </ul>
      <h2>Respuestas registradas</h2>
      <div class="question" *ngFor="let respuesta of r.respuestas">
        <strong>{{ respuesta.pregunta }}</strong>
        <p>{{ respuesta.valor }}</p>
      </div>
      <div class="actions">
        <a class="btn" routerLink="/evaluacion">Nueva evaluación</a>
        <a class="btn secondary" routerLink="/historial">Ver historial</a>
      </div>
    </ng-container>
  </section>`,
})
export class ResultadoComponent implements OnInit {
  private readonly evaluaciones = inject(EvaluacionesService);
  private readonly route = inject(ActivatedRoute);
  resultado: Evaluacion | null = null;
  error = '';
  cargando = true;
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isSafeInteger(id) || id < 1) {
      this.error = 'Identificador no válido.';
      this.cargando = false;
      return;
    }
    this.evaluaciones.detalle(id).subscribe({
      next: (r) => {
        this.resultado = r;
        this.cargando = false;
      },
      error: (err) => {
        this.error = mensajeError(err);
        this.cargando = false;
      },
    });
  }
}
