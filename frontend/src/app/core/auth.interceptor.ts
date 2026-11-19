import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const isApi = req.url.startsWith(environment.apiUrl + '/api/');
  const isAuthEndpoint = req.url.includes('/api/auth/');
  if (!isApi) return next(req);

  // Sólo el refresh token se guarda en cookie HttpOnly. JWT en memoria.
  const token = auth.accessToken;
  const authorized = req.clone({
    withCredentials: true,
    setHeaders: token && !isAuthEndpoint ? { Authorization: `Bearer ${token}` } : {}
  });
  return next(authorized).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401 || isAuthEndpoint) {
        return throwError(() => error);
      }
      return auth.refresh().pipe(
        switchMap(newToken => next(req.clone({
          withCredentials: true,
          setHeaders: { Authorization: `Bearer ${newToken}` }
        }))),
        catchError(err => {
          auth.limpiar();
          return throwError(() => err);
        })
      );
    })
  );
};
