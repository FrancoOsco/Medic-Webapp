import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/auth.guard';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { VerifyEmailComponent } from './features/auth/verify-email.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password.component';
import { DashboardComponent } from './features/home/dashboard.component';
import { PerfilComponent } from './features/home/perfil.component';
import { EvaluacionComponent } from './features/health/evaluacion.component';
import { ResultadoComponent } from './features/health/resultado.component';
import { HistorialComponent } from './features/health/historial.component';
import { UsuariosAdminComponent } from './features/admin/usuarios-admin.component';
import { NoEncontradoComponent } from './features/home/no-encontrado.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'evaluacion', component: EvaluacionComponent, canActivate: [authGuard] },
  { path: 'historial', component: HistorialComponent, canActivate: [authGuard] },
  { path: 'resultado/:id', component: ResultadoComponent, canActivate: [authGuard] },
  { path: 'admin/usuarios', component: UsuariosAdminComponent, canActivate: [adminGuard] },
  { path: '**', component: NoEncontradoComponent }
];
