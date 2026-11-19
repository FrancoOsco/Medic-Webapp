import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EvaluacionesService } from '../../core/evaluaciones.service';
import { Pregunta } from '../../core/models';
import { mensajeError } from '../../core/error.utils';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<section class="card narrow">
    <h1>Cuestionario de hábitos</h1>
    <p class="muted">
      Responde todas las preguntas. Las respuestas se guardarán asociadas a tu cuenta.
    </p>
    <div class="notice">
      Este cuestionario ofrece consejos informativos de bienestar. No detecta enfermedades, no
      ofrece diagnósticos ni clasifica riesgos médicos.
    </div>
    <p *ngIf="cargando">Cargando preguntas...</p>
    <div *ngIf="error" class="alert">{{ error }}</div>
    <form *ngIf="!cargando && preguntas.length" (ngSubmit)="enviar()">
      <fieldset class="question" *ngFor="let pregunta of preguntas; let i = index">
        <legend>{{ i + 1 }}. {{ pregunta.enunciado }}</legend>
        <label class="choice" *ngFor="let opcion of pregunta.opciones">
          <input
            type="radio"
            [name]="'pregunta_' + pregunta.id"
            [value]="opcion"
            [(ngModel)]="respuestas[pregunta.id]"
            required
          />
          {{ opcion }}
        </label>
      </fieldset>
      <button class="primary" type="submit" [disabled]="guardando || !completo()">
        {{ guardando ? 'Guardando...' : 'Guardar y ver orientación' }}
      </button>
    </form>
  </section>`,
})
export class EvaluacionComponent implements OnInit {
  private readonly evaluaciones = inject(EvaluacionesService);
  private readonly router = inject(Router);
  preguntas: Pregunta[] = [];
  respuestas: Record<number, string> = {};
  error = '';
  cargando = true;
  guardando = false;
  ngOnInit(): void {
    this.evaluaciones.preguntas().subscribe({
      next: (p) => {
        this.preguntas = p;
        this.cargando = false;
        if (!p.length) this.error = 'No hay preguntas activas.';
      },
      error: (err) => {
        this.error = mensajeError(err);
        this.cargando = false;
      },
    });
  }
  completo(): boolean {
    return (
      this.preguntas.length > 0 &&
      this.preguntas.every((p) => p.opciones.includes(this.respuestas[p.id]))
    );
  }
  enviar(): void {
    if (!this.completo() || this.guardando) return;
    this.guardando = true;
    this.error = '';
    const respuestas = this.preguntas.map((p) => ({
      preguntaId: p.id,
      valor: this.respuestas[p.id],
    }));
    this.evaluaciones.crear(respuestas).subscribe({
      next: (resultado) => {
        this.guardando = false;
        void this.router.navigate(['/resultado', resultado.id]);
      },
      error: (err) => {
        this.error = mensajeError(err);
        this.guardando = false;
      },
    });
  }
}
