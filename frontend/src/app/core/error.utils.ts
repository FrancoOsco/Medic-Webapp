import { HttpErrorResponse } from '@angular/common/http';

export function mensajeError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as { message?: string; detail?: string } | null;
    if (typeof body?.message === 'string' && body.message.length) return body.message;
    if (typeof body?.detail === 'string' && body.detail.length) return body.detail;
    if (error.status === 0) return 'No se pudo conectar con Spring Boot. Revisa que esté iniciado en el puerto 8080.';
    if (error.status === 401) return 'Sesión inválida o credenciales incorrectas.';
    if (error.status === 403) return 'No tienes permisos para realizar esta operación.';
    if (error.status === 404) return 'Recurso no encontrado.';
    return `Ocurrió un error HTTP ${error.status}.`;
  }
  return 'Ocurrió un error inesperado.';
}
