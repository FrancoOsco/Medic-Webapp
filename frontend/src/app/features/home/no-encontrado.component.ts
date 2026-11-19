import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `<section class="card narrow">
    <h1>Página no encontrada</h1>
    <p>La dirección solicitada no existe.</p>
    <a class="btn" routerLink="/dashboard">Volver al inicio</a>
  </section>`,
})
export class NoEncontradoComponent {}
