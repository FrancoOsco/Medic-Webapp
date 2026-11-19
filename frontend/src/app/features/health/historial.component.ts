import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EvaluacionesService } from '../../core/evaluaciones.service';
import { EvaluacionResumen } from '../../core/models';
import { mensajeError } from '../../core/error.utils';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `<section class="card">
    <div class="row">
      <h1>Historial de evaluaciones</h1>
      <a class="btn" routerLink="/evaluacion">Nueva evaluación</a>
    </div>
    <p class="muted">Tus resultados anteriores, ordenados por fecha.</p>
    <p *ngIf="cargando">Cargando historial...</p>
    <p *ngIf="error" class="alert">{{ error }}</p>
    <p *ngIf="!cargando && !error && !items.length">Todavía no has realizado ninguna evaluación.</p>
    <div class="table-wrap" *ngIf="items.length">
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Resumen</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of items">
            <td>{{ item.fecha | date: 'medium' : '' : 'es' }}</td>
            <td>{{ item.resumen }}</td>
            <td><a [routerLink]="['/resultado', item.id]">Ver resultado</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>`,
})
export class HistorialComponent implements OnInit {
  private readonly evaluaciones = inject(EvaluacionesService);
  items: EvaluacionResumen[] = [];
  cargando = true;
  error = '';
  ngOnInit(): void {
    this.evaluaciones.historial().subscribe({
      next: (items) => {
        this.items = items;
        this.cargando = false;
      },
      error: (err) => {
        this.error = mensajeError(err);
        this.cargando = false;
      },
    });
  }
}
