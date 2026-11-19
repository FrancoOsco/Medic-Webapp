import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard">
      <!-- PRESENTACIÓN -->
      <section class="hero">
        <div class="hero-content">
          <span class="eyebrow">ARIANA / PANEL PERSONAL</span>

          <p class="greeting">Bienvenido, {{ auth.perfil()?.nombre || 'usuario' }}</p>

          <h1>
            Tu bienestar comienza
            <span>conocerte mejor.</span>
          </h1>

          <p class="hero-description">
            Un espacio para conocer tus hábitos, registrar tus evaluaciones y consultar información
            que te ayude a tomar decisiones más conscientes.
          </p>

          <a routerLink="/evaluacion" class="hero-button">
            Iniciar evaluación
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div class="hero-aside">
          <span class="aside-label">SALUD Y BIENESTAR</span>

          <div class="brand-symbol" aria-hidden="true">A</div>

          <div class="aside-bottom">
            <span class="aside-line"></span>
            <p>Información clara. Hábitos conscientes. Bienestar cotidiano.</p>
            <small>PLATAFORMA ARIANA</small>
          </div>
        </div>
      </section>

      <!-- HERRAMIENTAS -->
      <section class="workspace">
        <div class="section-heading">
          <div>
            <span class="section-label">TU ESPACIO</span>
            <h2>Herramientas personales</h2>
          </div>

          <p>Accede a tus registros y administra tu información desde un solo lugar.</p>
        </div>

        <div class="tools-grid">
          <article class="tool-card">
            <div class="tool-top">
              <span class="tool-category">SEGUIMIENTO</span>
              <span class="tool-number">01</span>
            </div>

            <div class="tool-content">
              <h3>Historial de evaluaciones</h3>
              <p>
                Revisa las evaluaciones realizadas y consulta los resultados guardados
                anteriormente.
              </p>
            </div>

            <a routerLink="/historial" class="tool-link">
              Consultar historial
              <span aria-hidden="true">→</span>
            </a>
          </article>

          <article class="tool-card">
            <div class="tool-top">
              <span class="tool-category">CUENTA PERSONAL</span>
              <span class="tool-number">02</span>
            </div>

            <div class="tool-content">
              <h3>Información de perfil</h3>
              <p>
                Consulta tus datos personales y mantén actualizada la información asociada a tu
                cuenta.
              </p>
            </div>

            <a routerLink="/perfil" class="tool-link">
              Administrar perfil
              <span aria-hidden="true">→</span>
            </a>
          </article>
        </div>
      </section>

      <!-- AVISO INFORMATIVO -->
      <aside class="disclaimer">
        <span class="disclaimer-title">NOTA INFORMATIVA</span>
        <p>
          ARIANA es una plataforma académica de orientación general sobre hábitos y bienestar. Sus
          resultados no constituyen diagnósticos ni reemplazan la atención de profesionales de
          salud.
        </p>
      </aside>
    </div>
  `,

  styles: [
    `
      :host {
        display: block;
        color: #f2edf0;
      }

      .dashboard {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 44px;
      }

      /* PRESENTACIÓN PRINCIPAL */

      .hero {
        display: grid;
        grid-template-columns: 1.65fr 0.85fr;
        min-height: 395px;
        overflow: hidden;
        border-radius: 12px;
        background: #19191c;
        color: #ffffff;
      }

      .hero-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 52px 50px;
      }

      .eyebrow {
        margin-bottom: 32px;
        color: #d7a4b7;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 2.3px;
      }

      .greeting {
        margin: 0 0 12px;
        color: #e2d5d8;
        font-size: 14px;
        font-weight: 500;
      }

      .hero h1 {
        max-width: 560px;
        margin: 0;
        color: #ffffff;
        font-size: clamp(30px, 3.6vw, 46px);
        font-weight: 650;
        letter-spacing: -1.6px;
        line-height: 1.15;
      }

      .hero h1 span {
        display: block;
        color: #d0a5b2;
      }

      .hero-description {
        max-width: 480px;
        margin: 22px 0 28px;
        color: #c3bec1;
        font-size: 14px;
        line-height: 1.8;
      }

      .hero-button {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        gap: 30px;
        padding: 14px 21px;
        border-radius: 6px;
        background: #792b46;
        color: #ffffff;
        font-size: 13px;
        font-weight: 650;
        text-decoration: none;
        transition: background 0.2s ease;
      }

      .hero-button:hover {
        background: #963b5a;
        color: #ffffff;
        text-decoration: none;
      }

      .hero-button span {
        font-size: 19px;
        font-weight: 400;
      }

      /* PANEL ROJO VINO */

      .hero-aside {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-width: 0;
        padding: 36px 32px;
        background: #651f35;
        overflow: hidden;
      }

      .aside-label {
        position: relative;
        z-index: 1;
        color: #f2dce4;
        font-size: 10px;
        font-weight: 650;
        letter-spacing: 2px;
      }

      .brand-symbol {
        position: absolute;
        top: 72px;
        right: 50px;
        color: rgba(255, 255, 255, 0.12);
        font-size: clamp(70px, 9vw, 125px);
        font-weight: 800;
        letter-spacing: -4px;
        line-height: 1;
        white-space: nowrap;
        pointer-events: none;
      }

      .aside-bottom {
        position: relative;
        z-index: 1;
      }

      .aside-line {
        display: block;
        width: 35px;
        height: 2px;
        margin-bottom: 18px;
        background: #e5b3c0;
      }

      .aside-bottom p {
        max-width: 220px;
        margin: 0 0 25px;
        color: #ffffff;
        font-size: 19px;
        font-weight: 500;
        line-height: 1.55;
      }

      .aside-bottom small {
        color: #e1bfc9;
        font-size: 10px;
        letter-spacing: 1.5px;
      }

      /* HERRAMIENTAS */

      .workspace {
        display: flex;
        flex-direction: column;
        gap: 23px;
      }

      .section-heading {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 24px;
      }

      .section-label {
        display: block;
        margin-bottom: 9px;
        color: #d8a1b3;
        font-size: 10px;
        font-weight: 750;
        letter-spacing: 2px;
      }

      .section-heading h2 {
        margin: 0;
        color: #f2edf0;
        font-size: 25px;
        font-weight: 650;
        letter-spacing: -0.7px;
      }

      .section-heading > p {
        max-width: 285px;
        margin: 0;
        color: #b9afb5;
        font-size: 12px;
        line-height: 1.7;
      }

      .tools-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
      }

      .tool-card {
        display: flex;
        flex-direction: column;
        min-height: 225px;
        padding: 27px 29px;
        background: #1d1b20;
        border: 1px solid #383239;
        border-radius: 9px;
        color: #f2edf0;
        transition:
          border-color 0.2s ease,
          background 0.2s ease;
      }

      .tool-card:hover {
        background: #262128;
        border-color: #86445e;
      }

      .tool-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 23px;
      }

      .tool-category {
        color: #d8a1b3;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 1.5px;
      }

      .tool-number {
        color: #a68f99;
        font-size: 13px;
        font-weight: 600;
      }

      .tool-content {
        flex: 1;
      }

      .tool-content h3 {
        margin: 0 0 10px;
        color: #f2edf0;
        font-size: 19px;
        font-weight: 650;
        letter-spacing: -0.4px;
      }

      .tool-content p {
        max-width: 365px;
        margin: 0 0 24px;
        color: #b9afb5;
        font-size: 13px;
        line-height: 1.75;
      }

      .tool-link {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 16px;
        border-top: 1px solid #3c343b;
        color: #dba3b6;
        font-size: 13px;
        font-weight: 650;
        text-decoration: none;
      }

      .tool-link:hover {
        color: #ffffff;
        text-decoration: none;
      }

      .tool-link span {
        font-size: 19px;
        font-weight: 400;
      }

      /* AVISO INFORMATIVO */

      .disclaimer {
        display: flex;
        align-items: flex-start;
        gap: 25px;
        padding: 21px 24px;
        background: #231d23;
        border-left: 3px solid #93405e;
        border-radius: 4px;
      }

      .disclaimer-title {
        flex-shrink: 0;
        padding-top: 3px;
        color: #d9a2b6;
        font-size: 10px;
        font-weight: 750;
        letter-spacing: 1.1px;
      }

      .brand-symbol {
        position: absolute;
        top: 72px;
        right: 130px;
        font-size: 150px;
        font-weight: 800;
        color: rgba(255, 255, 255, 0.12);
      }

      .disclaimer p {
        margin: 0;
        color: #bdb1b7;
        font-size: 12px;
        line-height: 1.8;
      }

      /* RESPONSIVE */

      @media (max-width: 800px) {
        .hero {
          grid-template-columns: 1fr;
        }

        .hero-content {
          padding: 38px 28px;
        }

        .hero-aside {
          min-height: 145px;
          padding: 25px 28px;
        }

        .brand-symbol {
          top: 12px;
          right: 30px;
          font-size: 95px;
        }

        .aside-bottom p {
          max-width: none;
          margin-bottom: 10px;
          font-size: 15px;
        }

        .section-heading {
          align-items: flex-start;
          flex-direction: column;
          gap: 10px;
        }
      }

      @media (max-width: 600px) {
        .dashboard {
          gap: 30px;
        }

        .hero-content {
          padding: 32px 24px;
        }

        .hero h1 {
          font-size: 32px;
          letter-spacing: -0.8px;
        }

        .tools-grid {
          grid-template-columns: 1fr;
        }

        .tool-card {
          padding: 24px;
        }

        .disclaimer {
          flex-direction: column;
          gap: 10px;
        }
      }
    `,
  ],
})
export class DashboardComponent {
  readonly auth = inject(AuthService);
}
