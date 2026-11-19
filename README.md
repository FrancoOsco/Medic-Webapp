# ARIANA - Prototipo académico de orientación de bienestar

**Stack:** Angular 20 SPA (frontend), Java 21 + Spring Boot 4.1.1 (API), PostgreSQL 15.3 + Docker Compose (datos).  
**Alcance:** Registro, verificación de correo, JWT/refresh, perfil, CRUD administrativo, cuestionario de hábitos, resultados orientativos e historial propio.

> **Aviso:** ARIANA es un proyecto académico. Los resultados son información general de bienestar, no diagnósticos ni consejos médicos personalizados. No cargar datos clínicos reales en el entorno de demostración.

## Requisitos en Windows

- Java **21** (`java -version`)
- Node.js **22.12+** o **20.19+** (`node -v`)
- Docker Desktop, con Docker Compose disponible
- Acceso a Internet **para instalar las dependencias la primera vez** (`npm install` y Maven wrapper)

## Inicio rápido (PowerShell)

### 1. Base de datos

En `database/` copia `.env.example` a `.env`, coloca tus propias contraseñas locales (en `POSTGRES_PASSWORD` y `PGADMIN_DEFAULT_PASSWORD`) y ejecuta:

```powershell
cd database
Copy-Item .env.example .env
# Edita .env antes de iniciar los contenedores
 docker compose up -d
```

Puerto de PostgreSQL: **5432**. pgAdmin: **http://localhost:5050**.

No compartas `.env`. El contenedor crea la base indicada por `POSTGRES_DB` solo en el **primer arranque** de un volumen de datos nuevo. Si reutilizas un volumen anterior, conserva sus credenciales y nombre de base, y ajusta `DB_URL`, `DB_USERNAME` y `DB_PASSWORD` en el backend. **No borres los volúmenes de PostgreSQL si tienes datos que conservar**.

### 2. API Spring Boot

Abre una **segunda** terminal PowerShell en `backend/` e indica la misma contraseña que pusiste en `database/.env`:

```powershell
cd backend
$env:DB_URL = 'jdbc:postgresql://localhost:5432/ariana_db'
$env:DB_USERNAME = 'ariana'
$env:DB_PASSWORD = 'TU_PASSWORD_DE_POSTGRES'
$env:JWT_SECRET = 'CAMBIA_ESTO_POR_UN_SECRETO_ALEATORIO_DE_64_CARACTERES_COMO_MINIMO'
$env:MAIL_ENABLED = 'false'
.\mvnw.cmd spring-boot:run
```

API: **http://localhost:8080**. En el primer arranque, Hibernate crea las tablas faltantes y `PreguntaSeeder` inserta cinco preguntas **sin duplicar las existentes**. `ddl-auto=update` está previsto únicamente para desarrollo; no reemplaza las migraciones versionadas de producción.

Con `MAIL_ENABLED=false` **no se envían correos reales**. Después de registrar una cuenta, revisa la consola de Spring Boot: allí se mostrará el enlace de verificación `http://localhost:4200/verify-email?token=...`. Abre ese enlace. La recuperación de contraseña funciona del mismo modo. Esta opción solo es adecuada para la demostración local; no debe usarse en producción.

Para enviar correos reales hay que configurar `MAIL_ENABLED=true`, `MAIL_USERNAME` y `MAIL_PASSWORD` con datos SMTP autorizados.

### 3. Frontend Angular

Abre una **tercera** terminal en `frontend/`:

```powershell
cd frontend
npm install
npm start
```

Abre **http://localhost:4200**. La API se configura en `frontend/src/environments/environment.ts` (URL predeterminada: `http://localhost:8080`). El backend autoriza exactamente el origen configurado por `FRONTEND_URL` (predeterminado: `http://localhost:4200`). Usa `localhost` en ambas URLs, no mezcles `127.0.0.1` con `localhost`.

## Cómo probar la demostración

1. Registra una cuenta y copia el enlace de verificación de la consola Java.
2. Abre ese enlace, inicia sesión y comprueba tu perfil.
3. En **Evaluación**, responde las cinco preguntas y guarda el resultado.
4. Visita **Historial** y abre el resultado almacenado.
5. Para probar el panel de administración, usa TablePlus o pgAdmin con tu propia cuenta de prueba y cambia su rol en la BD de desarrollo:

```sql
UPDATE usuario SET rol = 'ADMIN' WHERE email = 'tu-correo-de-prueba@ejemplo.com';
```

Cierra sesión y vuelve a iniciar para mostrar el enlace **Administrar**. No existe una credencial de administrador predefinida en el proyecto.

## Endpoints

| Método | Ruta | Acceso |
| --- | --- | --- |
| POST | `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`, `/api/auth/verify-email`, `/api/auth/forgot-password`, `/api/auth/reset-password` | Público; algunas rutas requieren cookie y origen permitido |
| GET / PUT | `/api/usuarios/me` | Autenticado |
| GET | `/api/usuarios` / `/api/usuarios/{id}` | ADMIN |
| PUT / DELETE | `/api/usuarios/{id}` | ADMIN |
| GET | `/api/preguntas` | Autenticado |
| POST | `/api/evaluaciones` | Autenticado |
| GET | `/api/evaluaciones/mis-evaluaciones` | Autenticado |
| GET | `/api/evaluaciones/{id}` | Solo propietario |

## Pruebas y compilación

```powershell
cd backend
.\mvnw.cmd test
# En otra terminal
cd frontend
npm run build
```

Se mantienen las pruebas del backend original, complementadas con nuevas pruebas del módulo de evaluaciones. Los Guards Angular solo gestionan navegación: todas las operaciones sensibles se autorizan también en Spring Security.

## Notas sobre privacidad y despliegue

- El access token permanece **en memoria** del navegador; el refresh token se guarda en una cookie `HttpOnly`, con `SameSite=Strict`.
- No existen endpoints públicos para consultar evaluaciones de otros usuarios.
- Nunca despliegues con la clave JWT de ejemplo, contraseñas de demo ni `COOKIE_SECURE=false`.
- Para producción: HTTPS, `COOKIE_SECURE=true`, credenciales externalizadas, SMTP confiable, migraciones de base de datos, auditoría de accesos, política de retención y revisión de seguridad.
- El frontend anterior no está incluido: **solo Angular** forma parte de este proyecto.
