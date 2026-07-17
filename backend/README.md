# VeloMMA API

> **Version:** 1.1.0
> **Purpose:** API analítica con estadísticas avanzadas de eventos, peleadores y métricas de la UFC.
> **Architecture:** Backend monolítico con capas (Routes → Controllers → Services → Prisma ORM → PostgreSQL).

---

## Visión General

VeloMMA es una plataforma de datos diseñada para modelar y consultar información del mundo de las Artes Marciales Mixtas (MMA). Proporciona una API RESTful que permite gestionar luchadores, equipos, divisiones de peso, eventos, peleas, métricas por asalto, jueces, pesajes, bonificaciones, odds de apuestas, rankings, títulos, campamentos de entrenamiento, lesiones y estadísticas de carrera.

**Principios arquitectónicos:**

- **Modular monolítico** — cada dominio de negocio es un módulo autocontenido con ruta, controlador, servicio y esquema de validación.
- **ORM-first** — toda la persistencia se maneja mediante Prisma ORM sobre PostgreSQL.
- **Seguridad por API Key** — las operaciones de escritura (`POST`, `PUT`, `PATCH`, `DELETE`) requieren el header `x-api-key`; las lecturas (`GET`) son públicas.
- **Cache opcional con Redis** — respuestas `GET` exitosas se cachean 120 segundos si Redis está habilitado.
- **Rate Limiting dual** — límites separados para peticiones de lectura y escritura, configurables por variables de entorno.
- **Monitoreo con Prometheus** — métricas HTTP, del sistema, de caché, de base de datos y de negocio expuestas vía `prom-client`.
- **Documentación OpenAPI** integrada con Swagger UI en `/api/v1/docs`.
- **Soft-delete generalizado** — ninguna operación destruye datos; se marcan con `deleted_at`.

---

## Pila Tecnológica y Librerías

| Librería | Versión | Rol en el proyecto |
|---|---|---|
| **Node.js** | ^22.15 | Runtime del servidor |
| **Express** | ^5.2.1 | Framework HTTP con routing, middlewares y manejo de peticiones |
| **TypeScript** | ^6.0.3 | Tipado estático en tiempo de desarrollo y compilación |
| **Prisma** | ^7.8.0 | ORM: modelado, migraciones y generación del cliente de base de datos |
| **@prisma/adapter-pg** | ^7.8.0 | Adaptador nativo PostgreSQL para Prisma |
| **pg** | ^8.22.0 | Driver PostgreSQL nativo |
| **Zod** | ^4.4.3 | Validación y tipado de esquemas de entrada (_payload validation_) |
| **@t3-oss/env-core** | ^0.13.11 | Validación estricta de variables de entorno con Zod en el arranque |
| **Redis** | ^6.0.1 | Caché distribuida para respuestas GET |
| **Helmet** | ^8.2.0 | Seguridad HTTP (headers, CSP, XSS, etc.) |
| **CORS** | ^2.8.6 | Control de acceso cross-origin para el frontend |
| **express-rate-limit** | ^8.5.1 | Rate limiting dual: lectura y escritura |
| **prom-client** | ^15.1.3 | Cliente Prometheus para recolección y exposición de métricas |
| **cookie-parser** | ^1.4.7 | Parseo de cookies HTTP |
| **Morgan** | ^1.11.0 | Logging de peticiones HTTP en consola |
| **swagger-jsdoc** | ^6.3.0 | Generación de especificación OpenAPI desde comentarios JSDoc |
| **swagger-ui-express** | ^5.0.1 | Servir la interfaz Swagger UI |
| **tsx** | ^4.22.4 | Ejecución en caliente de TypeScript en desarrollo |
| **dotenv** | ^17.4.2 | Carga de variables de entorno desde `.env` |
| **Jest** | ^30.4.2 | Framework de testing unitario y de integración |
| **Supertest** | ^7.2.2 | Pruebas HTTP sobre Express |
| **SWC** | ^1.15.43 | Compilador rápido para Jest |
| **Prisma CLI** | ^7.8.0 | Migraciones, generación de cliente y validación del schema |
| **Rimraf** | ^6.1.3 | Limpieza de directorio `dist` en prebuild |
| **cross-env** | ^10.1.0 | Variables de entorno multiplataforma en scripts |

---

## Estructura de Directorios

```
backend/
├── app.ts                              # Punto de entrada: configura Express, middlewares, rutas
├── package.json                        # Dependencias y scripts
├── tsconfig.json                       # Configuración de TypeScript (NodeNext, strict)
├── prisma.config.ts                    # Configuración adicional de Prisma
├── Dockerfile                          # Build de la imagen Docker (Node 22 Alpine + PNPM)
├── jest.config.ts                      # Configuración de Jest (SWC transform)
├── jest.setup.ts                       # Setup global de tests (mock de Redis)
│
├── .env                                # Variables de entorno locales
├── .env.example                        # Plantilla de variables de entorno
├── .env.test                           # Variables para el entorno de test
│
├── config/
│   ├── settings.ts                     # Carga y normalización de variables de entorno
│   ├── validation/
│   │   └── env.ts                      # Validación estricta con @t3-oss/env-core + Zod
│   ├── cache/
│   │   └── redis.ts                    # Cliente Redis (singleton lazy)
│   ├── metrics/
│   │   ├── index.ts                    # Barrel export de todas las métricas
│   │   ├── register.ts                 # Registro Prometheus y métricas por defecto
│   │   ├── http.metric.ts              # Métricas HTTP (requests, latencia, tamaño)
│   │   ├── system.metric.ts            # Métricas del sistema (memoria, CPU, event loop)
│   │   ├── database.metric.ts          # Métricas de base de datos (queries, pool, transacciones)
│   │   ├── cache.metric.ts             # Métricas de caché Redis (hits, misses, ratio)
│   │   ├── business.metric.ts          # Métricas de negocio (luchadores, eventos, rankings)
│   │   └── custom.metric.ts            # Métricas custom (auth, validación, rate limit)
│   └── swagger/
│       └── docs.ts                     # Especificación OpenAPI 3.0.0
│
├── prisma/
│   ├── schema.prisma                   # Modelo de datos (17 tablas, 13 enums)
│   └── migrations/                     # Migraciones SQL versionadas
│
├── generated/prisma/                   # Cliente Prisma generado automáticamente
│
├── src/
│   ├── api/
│   │   └── routes.ts                   # Montaje global de todos los módulos con middlewares
│   │
│   ├── common/
│   │   ├── decorator/
│   │   │   └── decorator.ts            # @SendResponse: normaliza respuestas JSON/error
│   │   └── errors/
│   │       └── error.ts                # Jerarquía de excepciones HTTP (7 clases)
│   │
│   ├── middlewares/
│   │   ├── cache/
│   │   │   ├── global-cache.middleware.ts   # Cache GET responses en Redis (TTL 120s)
│   │   │   └── clear-cache.middleware.ts    # Invalida cache por patrón tras escritura
│   │   ├── Exception/
│   │   │   └── errors.middleware.ts         # Captura HttpException y retorna JSON
│   │   ├── metrics/
│   │   │   └── http/
│   │   │       └── http.middlewares.ts      # Middleware de métricas HTTP para Prometheus
│   │   ├── ratedLimit/
│   │   │   └── rate.middleware.ts           # Rate limiting dual (lectura/escritura)
│   │   └── routes/
│   │       └── route.middlewares.ts         # secureMiddleware: API Key en escritura
│   │
│   ├── modules/                        # Núcleo del dominio: 17 sub-módulos
│   │   ├── fighters/                   # CRUD de luchadores
│   │   ├── teams/                      # CRUD de equipos/gimnasios
│   │   ├── divisions/                  # CRUD de divisiones de peso
│   │   ├── events/                     # CRUD de eventos
│   │   ├── monitoring/                 # Endpoints de monitoreo Prometheus
│   │   │   ├── monitor.route.ts        # Rutas: /prometheus, /prometheus/json
│   │   │   └── monitor.controller.ts   # Controller que expone el registry Prometheus
│   │   ├── relational/                 # Módulos relacionales (N:M y agregaciones)
│   │   │   ├── injuries/               # Lesiones de luchadores
│   │   │   ├── stables/                # Asignación luchador → equipo
│   │   │   ├── weights/                # Asignación luchador → división
│   │   │   ├── ranking/                # Rankings por división
│   │   │   ├── titles/                 # Historial de títulos/cinturones
│   │   │   ├── camps/                  # Campamentos de entrenamiento
│   │   │   └── stats/                  # Estadísticas de carrera (cálculo agregado)
│   │   └── bouts/                      # Módulos de peleas (sub-módulos)
│   │       ├── index.ts                # Barredora de exportaciones
│   │       ├── bout/                   # CRUD de peleas
│   │       ├── judges/                 # Puntajes de jueces
│   │       ├── metrics/                # Métricas round-by-round
│   │       ├── weighIns/               # Pesajes oficiales
│   │       ├── bonus/                  # Bonos post-pelea
│   │       └── odds/                   # Odds de apuestas por proveedor
│   │
│   ├── types/                          # Interfaces TypeScript por dominio
│   │   ├── api/api.ts                  # APIResponse<T> genérico
│   │   ├── fighters/                   # FighterDTO, FighterUpdateDTO
│   │   ├── teams/                      # TeamDTO, TeamUpdateDTO
│   │   ├── divisions/                  # DivisionDTO, DivisionUpdateDTO
│   │   ├── events/                     # EventDTO, EventUpdateDTO
│   │   ├── bouts/                      # BoutDTO, JudgeDTO, MetricDTO, etc.
│   │   └── relational/                 # WeightDTO, TitleDTO, CampDTO, etc.
│   │
│   └── utils/
│       ├── utils.ts                    # routesConfig (array de {path, router}) + tablesToClear
│       ├── functions/function.ts       # Utilidad registerRoutes + BoutStatusRecord
│       └── prisma/prisma.ts            # Instancia singleton de PrismaClient con adapter pg
│
├── __test__/                           # Tests automatizados (Jest + Supertest)
│   ├── api/api.test.ts                 # Smoke tests de rutas base
│   ├── fighters/fighter.test.ts        # CRUD de luchadores
│   └── helpers/testBase.ts             # Clase base con limpieza de BD
│
└── test/                               # Archivos .http para pruebas manuales (REST Client)
    ├── api.http
    ├── fighters.http
    ├── event.http
    ├── division.http
    ├── team.http
    ├── bouts/
    │   ├── bout/bout.http
    │   ├── odds/odds.http
    │   ├── metrics/metric.http
    │   ├── judges/judge.http
    │   ├── weighIns/weighIns.http
    │   └── bonus/bonus.http
    └── relational/
        ├── weights/weight.http
        ├── titles/titles.http
        ├── stats/stats.http
        ├── stables/stable.http
        ├── ranking/rank.http
        ├── injuries/injuries.http
        └── camps/camp.http
```

---

## Requisitos Previos

| Requisito | Versión mínima | Notas |
|---|---|---|
| **Node.js** | ^22.15 | Incluye soporte ESM nativo |
| **pnpm** | ^9.0 | Gestor de paquetes recomendado |
| **PostgreSQL** | ^17 | Base de datos principal |
| **Redis** | ^7 | Opcional: caché distribuida |
| **Docker** | ^24 | Opcional: infraestrutura completa con Compose |

---

## Instalación y Ejecución

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/tu-usuario/velomma.git
cd velomma/backend
pnpm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus valores. Ver la sección [Variables de Entorno](#variables-de-entorno) para el detalle completo.

### 3. Preparar la base de datos

```bash
# Generar cliente Prisma
pnpm prisma:generate

# Ejecutar migraciones
pnpm prisma:migrate
```

### 4. Iniciar el servidor

```bash
# Desarrollo (hot-reload con tsx watch)
pnpm dev
```

El servidor arranca en `http://localhost:{PORT}{BASE_PATH}` (por defecto `http://localhost:3000/api/v1`).

### 5. Docker Compose (alternativa)

```bash
# Levantar todos los servicios (PostgreSQL, Redis, PgAdmin, Backend)
pnpm docker:start

# Detener servicios
pnpm docker:stop
```

| Servicio | Imagen | Puerto | Propósito |
|---|---|---|---|
| `db` | `postgres:17-alpine` | `5432` | Base de datos PostgreSQL |
| `pgadmin` | `dpage/pgadmin4` | `5050` | Interfaz de administración de BD |
| `redis_velomma` | `redis:7-alpine` | `6379` | Caché (256MB, política LRU) |
| `backend` | Construido desde `backend/Dockerfile` | `5300` | API Node.js con hot-reload |

---

## Variables de Entorno

El proyecto utiliza **@t3-oss/env-core** con **Zod** para validar estrictamente todas las variables de entorno en el arranque. Si falta alguna variable requerida o tiene un tipo/longitud incorrecta, el servidor **no arranca** y lanza un error descriptivo.

La validación se encuentra en `config/validation/env.ts` y se carga a través de `config/settings.ts`.

> **Nota sobre entornos:** En modo `test` (`NODE_ENV=test`), se carga el archivo `.env.test`. En otros modos, se carga `.env.local`.

### Variables Requeridas

| Variable | Tipo | Validación | Descripción |
|---|---|---|---|
| `DATABASE_URL` | `string` | Debe ser una URL válida (`z.string().url()`) | Cadena de conexión PostgreSQL (ej. `postgresql://user:pass@localhost:5432/db?schema=public`) |
| `JWT_SECRET` | `string` | Mínimo **32 caracteres** (`z.string().min(32)`) | Secreto para futura autenticación JWT |
| `API_SECRET_KEY` | `string` | Mínimo **16 caracteres** (`z.string().min(16)`) | API Key para autenticar operaciones de escritura (header `x-api-key`) |
| `COOKIE_SECRET` | `string` | Mínimo **32 caracteres** (`z.string().min(32)`) | Secreto para firmar cookies HTTP |

### Variables Configurables (con valores por defecto)

| Variable | Tipo | Default | Descripción |
|---|---|---|---|
| `PORT` | `number` | `3000` | Puerto del servidor Express |
| `NODE_ENV` | `enum` | `"development"` | Entorno: `development`, `test`, `production` |
| `BASE_PATH` | `string` | `"/api/v1"` | Prefijo base de todas las rutas de la API |
| `CORS_ORIGIN` | `string` | `"*"` | Origen permitido para CORS (debe ser URL válida) |

### Variables de Redis (opcionales)

| Variable | Tipo | Default | Descripción |
|---|---|---|---|
| `REDIS_URL` | `string` | `undefined` | URL de conexión Redis. Si no se define, el caché queda deshabilitado |
| `REDIS_PORT` | `number` | `6379` | Puerto Redis |
| `REDIS_ENV` | `boolean` | `false` | Habilita (`true`) o deshabilita (`false`) el caché Redis |

### Variables de Rate Limiting (opcionales)

| Variable | Tipo | Default | Descripción |
|---|---|---|---|
| `LIMIT_READ_WINDOW_MS` | `number` | `300000` (5 min) | Ventana de tiempo para límite de lecturas (en milisegundos) |
| `LIMIT_READ_MAX` | `number` | `100` | Máximo de peticiones de lectura por ventana |
| `LIMIT_WRITE_WINDOW_MS` | `number` | `60000` (1 min) | Ventana de tiempo para límite de escrituras (en milisegundos) |
| `LIMIT_WRITE_MAX` | `number` | `10` | Máximo de peticiones de escritura por ventana |

### Ejemplo de archivo `.env`

```env
### PostgreSQL ###
DATABASE_URL="postgresql://postgres:password@localhost:5432/velomma?schema=public"

### Seguridad ###
JWT_SECRET="tu-secreto-jwt-must-be-at-least-32-characters"
API_SECRET_KEY="tu-api-key-16ch"
COOKIE_SECRET="tu-cookie-secret-must-be-at-least-32-characters"

### Servidor ###
PORT=3000
NODE_ENV="development"
BASE_PATH="/api/v1"

### CORS ###
CORS_ORIGIN="http://localhost:5173"

### Redis ###
REDIS_URL="redis://localhost:6379"
REDIS_PORT=6379
REDIS_ENV="false"

### Rate Limiting ###
LIMIT_READ_WINDOW_MS=300000
LIMIT_READ_MAX=100
LIMIT_WRITE_WINDOW_MS=60000
LIMIT_WRITE_MAX=10
```

### Comportamiento ante errores de validación

Si falta una variable requerida o no cumple la validación:

```
Error: Invalid environment variables:
  - DATABASE_URL: Required
  - JWT_SECRET: JWT_SECRET debe tener al menos 32 caracteres
```

El servidor **no iniciará** hasta que todas las variables cumplan con las restricciones definidas.

---

## Arquitectura y Características

### Flujo de una Petición HTTP

```
Cliente (HTTP)
    │
    ▼
Express app.ts
    ├── express.json()          → Parsea body a JSON
    ├── cors()                  → Valida CORS
    ├── helmet()                → Headers de seguridad
    ├── cookieParser()          → Parsea cookies
    ├── errorsMiddleware        ← Manejador global de errores
    ├── morgan('dev')           → Logging HTTP (solo desarrollo/producción)
    ├── globalCacheMiddleware   → Cache GET en Redis (solo si REDIS_ENV=true)
    │
    ├── GET / → Bienvenida
    ├── GET /health → Health check
    ├── GET /ping → Ping
    ├── /docs → Swagger UI
    │
    └── apiRouter (routes.ts)
            │
            ▼
        ┌───────────────────────────────┐
        │  middlewareRateLimit           │
        │  ├── GET → readLimiter        │
        │  └── POST/PUT/PATCH/DELETE    │
        │       → writeLimiter          │
        └───────────────────────────────┘
            │
            ▼
        secureMiddleware (route.middlewares.ts)
            ├── GET → next()  (público)
            └── POST/PUT/PATCH/DELETE → valida x-api-key
                    │
                    ▼
                Module Router (ej. /fighters)
                    │
                    ▼
                clearCacheMiddleware (opcional, en escrituras)
                    │
                    ▼
                Controller (@SendResponse)
                    │
                    ▼
                Service (lógica de negocio + validación Zod)
                    │
                    ▼
                Prisma ORM → PostgreSQL
```

### Rate Limiting Dual

El sistema de rate limiting utiliza **express-rate-limit** con dos limitadores separados, configurables mediante variables de entorno:

#### Límite de Lectura (GET)

| Parámetro | Valor por defecto | Configurable |
|---|---|---|
| Ventana de tiempo | 5 minutos (300,000 ms) | `LIMIT_READ_WINDOW_MS` |
| Máximo de peticiones | 100 por ventana | `LIMIT_READ_MAX` |
| Exclusiones | Ruta `/health` siempre exenta | — |
| En test | Totalmente deshabilitado | — |

#### Límite de Escritura (POST, PUT, PATCH, DELETE)

| Parámetro | Valor por defecto | Configurable |
|---|---|---|
| Ventana de tiempo | 1 minuto (60,000 ms) | `LIMIT_WRITE_WINDOW_MS` |
| Máximo de peticiones | 10 por ventana | `LIMIT_WRITE_MAX` |
| En test | Totalmente deshabilitado | — |

#### Respuesta de Error (429 Too Many Requests)

Cuando un cliente excede el límite, recibe:

```json
{
  "status": 429,
  "message": "Demasiadas peticiones de lectura, por favor espere cinco minutos y vuelva a intentarlo."
}
```

El header `Retry-After` indica cuántos segundos debe esperar el cliente. Se utilizan `standardHeaders: true` (headers `RateLimit-*` RFC 6585) y se deshabilitan los headers legacy (`X-RateLimit-*`).

#### Ejemplo de configuración para producción

```env
# Lectura: 200 peticiones cada 10 minutos
LIMIT_READ_WINDOW_MS=600000
LIMIT_READ_MAX=200

# Escritura: 20 peticiones cada 2 minutos
LIMIT_WRITE_WINDOW_MS=120000
LIMIT_WRITE_MAX=20
```

### Pipeline de Autenticación y Autorización

1. La petición llega al `secureMiddleware`.
2. Si es **GET** → se pasa directamente (`next()`) — **lectura pública**.
3. Si es **POST, PUT, PATCH, DELETE** → se busca el header `x-api-key`.
4. Si falta o no coincide con `API_SECRET_KEY` → `401 Unauthorized`.
5. Si coincide → `next()`, la petición continúa al controlador.

### Estrategia de Cache con Redis

```
GET /fighters
    │
    ├── globalCacheMiddleware
    │       ├── ¿Cache key "cache:/api/v1/fighters" existe en Redis?
    │       │   ├── Sí → devuelve respuesta cacheada (sin llegar al controller)
    │       │   └── No → intercepta res.json, almacena respuesta con TTL 120s
    │       └── next()
    │
    └── Response → Cliente

POST /fighters (escritura)
    │
    ├── clearCacheMiddleware("/api/v1/fighters*")
    │       └── Tras respuesta exitosa (200/201) → Redis DEL cache:fighters*
    │
    └── Continúa flujo normal
```

### Soft Delete

Ninguna operación de eliminación destruye registros. Todas establecen `deleted_at = new Date()`. Las consultas (`findMany`, `findUnique`) filtran por `deleted_at: null` para excluir registros eliminados lógicamente.

### Manejo de Errores

Todas las excepciones lanzadas en servicios (`NotFoundException`, `BadRequestException`, etc.) son capturadas por `errorsMiddleware` y transformadas en:

```json
{
  "status": 404,
  "message": "El luchador no existe",
  "data": null
}
```

Si la excepción no es una `HttpException`, se devuelve un `500 Internal Server Error` genérico.

---

## Monitoreo con Prometheus

VeloMMA integra **prom-client** (v15.1.3) para la recolección y exposición de métricas compatibles con Prometheus.

### Endpoints de Métricas

| Método | Ruta | Formato | Descripción |
|---|---|---|---|
| `GET` | `/api/v1/monitoring/prometheus` | Texto plano (Prometheus) | Endpoint principal para scraping por Prometheus |
| `GET` | `/api/v1/monitoring/prometheus/json` | JSON | Endpoint auxiliar para inspección manual |

> **Importante:** Estos endpoints están protegidos por rate limiting y API key como el resto de la API.

### Configuración del Registro

El registro Prometheus se encuentra en `config/metrics/register.ts`. Las métricas se prefijan según el entorno:

| Entorno | Prefijo | Ejemplo |
|---|---|---|
| `development` / `test` | `velomma_dev_` | `velomma_dev_http_requests_total` |
| `production` | `velomma_` | `velomma_http_requests_total` |

### Métricas Disponibles

#### Métricas HTTP (`http.metric.ts`)

| Métrica | Tipo | Labels | Descripción |
|---|---|---|---|
| `velomma_*_http_requests_total` | Counter | `method`, `route`, `status_code`, `status_category` | Total de peticiones HTTP recibidas |
| `velomma_*_http_request_duration_seconds` | Histogram | `method`, `route`, `status_code` | Duración de peticiones HTTP en segundos |
| `velomma_*_http_request_size_bytes` | Summary | `method`, `route` | Tamaño del body de entrada (percentiles p50, p90, p99) |
| `velomma_*_http_response_size_bytes` | Summary | `method`, `route`, `status_code` | Tamaño de la respuesta (percentiles p50, p90, p99) |
| `velomma_*_http_active_requests` | Gauge | `method` | Peticiones HTTP activas en tiempo real |

#### Métricas del Sistema (`system.metric.ts`)

| Métrica | Tipo | Labels | Descripción |
|---|---|---|---|
| `velomma_*_memory_usage_bytes` | Gauge | `type` | Uso de memoria (heap, rss, etc.) |
| `velomma_*_cpu_usage_percent` | Gauge | — | Porcentaje de uso de CPU |
| `velomma_*_event_loop_lag_seconds` | Histogram | — | Retardo del event loop en segundos |
| `velomma_*_gc_duration_seconds` | Histogram | `type` | Duración del garbage collection |

#### Métricas de Base de Datos (`database.metric.ts`)

| Métrica | Tipo | Labels | Descripción |
|---|---|---|---|
| `velomma_*_db_query_duration_seconds` | Histogram | `operation`, `table`, `success` | Duración de queries a PostgreSQL |
| `velomma_*_db_query_total` | Counter | `operation`, `table`, `success` | Total de queries ejecutadas |
| `velomma_*_db_query_errors_total` | Counter | `operation`, `table`, `error_type` | Total de queries con error |
| `velomma_*_db_connection_pool` | Gauge | `state` | Estado del pool de conexiones |
| `velomma_*_db_transaction_duration_seconds` | Histogram | `operation` | Duración de transacciones |

#### Métricas de Caché (`cache.metric.ts`)

| Métrica | Tipo | Labels | Descripción |
|---|---|---|---|
| `velomma_*_cache_hits_total` | Counter | `cache_type`, `key_prefix` | Total de aciertos de caché |
| `velomma_*_cache_misses_total` | Counter | `cache_type`, `key_prefix` | Total de fallos de caché |
| `velomma_*_cache_hit_ratio` | Gauge | `cache_type` | Ratio de aciertos (0-1) |
| `velomma_*_cache_size_bytes` | Gauge | `cache_type` | Tamaño de la caché en bytes |
| `velomma_*_cache_operations_total` | Counter | `operation`, `cache_type`, `success` | Total de operaciones de caché |

#### Métricas de Negocio (`business.metric.ts`)

| Métrica | Tipo | Labels | Descripción |
|---|---|---|---|
| `velomma_*_active_fighters_total` | Gauge | — | Total de luchadores activos |
| `velomma_*_active_users_total` | Gauge | — | Total de usuarios activos |
| `velomma_*_fight_events_total` | Counter | `event_type`, `result`, `division` | Total de eventos de pelea |
| `velomma_*_rankings_distribution` | Gauge | `division`, `position` | Distribución de rankings por división y posición |
| `velomma_*_injuries_by_severity` | Gauge | `severity`, `status` | Lesiones agrupadas por severidad |
| `velomma_*_teams_total` | Gauge | `type` | Total de equipos/establos |

#### Métricas Custom (`custom.metric.ts`)

| Métrica | Tipo | Labels | Descripción |
|---|---|---|---|
| `velomma_*_api_response_time_seconds` | Histogram | `endpoint`, `method` | Tiempo de respuesta de la API |
| `velomma_*_authentication_attempts_total` | Counter | `method`, `success` | Intentos de autenticación |
| `velomma_*_validation_errors_total` | Counter | `endpoint`, `field` | Errores de validación |
| `velomma_*_rate_limit_hits_total` | Counter | `endpoint`, `method` | Veces que se alcanzó el rate limit |

### Métricas por Defecto de Node.js

El registro incluye métricas automáticas de `prom-client` (`collectDefaultMetrics`), que recolectan:

- Uso de memoria del proceso (heap, rss, external)
- Uso de CPU
- Duración de garbage collection
- Lag del event loop
- Métricas de handles abiertos

### Configuración de Prometheus

Ejemplo de configuración para `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: "velomma-api"
    scrape_interval: 15s
    metrics_path: "/api/v1/monitoring/prometheus"
    static_configs:
      - targets: ["localhost:3000"]
        labels:
          environment: "production"
```

---

## Endpoints de la API

> **Base URL:** `http://localhost:{PORT}{BASE_PATH}` (ej. `http://localhost:3000/api/v1`)
> **Autenticación:** `GET` → pública | `POST/PUT/PATCH/DELETE` → requiere header `x-api-key`.
> **Cache:** las rutas POST/PATCH/DELETE incluyen `clearCacheMiddleware` para invalidar cache del patrón.
> **Rate Limiting:** aplicado a todos los endpoints de `/api/v1/*` (ver sección [Rate Limiting Dual](#rate-limiting-dual)).
> **Respuesta estándar:**

```json
{
  "status": 200,
  "message": "Operación exitosa",
  "data": { ... },
  "meta": { "total": 10, "page": 1, "limit": 10 }
}
```

### Rutas Base (montadas directamente en app.ts)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `{basePath}/` | Bienvenida: mensaje + timestamp |
| `GET` | `{basePath}/health` | Health check: uptime, memoria, versión Node, estado DB y Redis |
| `GET` | `{basePath}/ping` | Ping: `{ status: "pong" }` |
| `GET` | `{basePath}/docs` | Swagger UI |

### Monitoreo — `/monitoring`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/prometheus` | Métricas Prometheus en formato texto plano |
| `GET` | `/prometheus/json` | Métricas Prometheus en formato JSON |

### Luchadores — `/fighters`

| Método | Ruta | Parámetros | Respuesta |
|---|---|---|---|
| `POST` | `/` | Body: `CreateFighterInput` | `201` → Fighter creado |
| `GET` | `/` | Query: `?page=1&limit=10` | `200` → Fighter[] + paginación |
| `GET` | `/active` | Query: `?page=1&limit=10` | `200` → Fighter[] activos |
| `GET` | `/:fighterId` | Path: `fighterId` (int) | `200` → Fighter |
| `GET` | `/slug/:slug` | Path: `slug` (string) | `200` → Fighter |
| `PATCH` | `/:fighterId` | Path: `fighterId`, Body: `UpdateFighterInput` | `200` → Fighter actualizado |
| `PATCH` | `/:fighterId/status` | Path: `fighterId`, Body: `{ is_active: boolean }` | `200` → Fighter |
| `PATCH` | `/soft/:fighterId` | Path: `fighterId` | `200` → Fighter (soft delete) |

### Equipos — `/teams`

| Método | Ruta | Parámetros | Respuesta |
|---|---|---|---|
| `POST` | `/` | Body: `CreateTeamInput` | `201` → Team |
| `GET` | `/` | — | `200` → Team[] |
| `GET` | `/active` | — | `200` → Team[] activos |
| `GET` | `/:teamId` | Path: `teamId` (int) | `200` → Team |
| `PATCH` | `/:teamId` | Path: `teamId`, Body: `UpdateTeamInput` | `200` → Team |
| `PATCH` | `/:teamId/status` | Path: `teamId`, Body: `{ is_active }` | `200` → Team |
| `PATCH` | `/soft/:teamId` | Path: `teamId` | `200` → Team (soft delete) |

### Divisiones — `/divisions`

| Método | Ruta | Parámetros | Respuesta |
|---|---|---|---|
| `POST` | `/` | Body: `CreateDivisionInput` | `201` → Division |
| `GET` | `/` | — | `200` → Division[] |
| `GET` | `/active` | — | `200` → Division[] activas |
| `GET` | `/:divisionId` | Path: `divisionId` (int) | `200` → Division |
| `PATCH` | `/:divisionId` | Path: `divisionId`, Body: `UpdateDivisionInput` | `200` → Division |
| `PATCH` | `/:divisionId/status` | Path: `divisionId`, Body: `{ is_active }` | `200` → Division |
| `PATCH` | `/soft/:divisionId` | Path: `divisionId` | `200` → Division (soft delete) |

### Eventos — `/events`

| Método | Ruta | Parámetros | Respuesta |
|---|---|---|---|
| `POST` | `/` | Body: `CreateEventInput` | `201` → Event |
| `GET` | `/` | — | `200` → Event[] |
| `GET` | `/active` | — | `200` → Event[] activos |
| `GET` | `/location/:location` | Path: `location` (string) | `200` → Event[] filtrados |
| `GET` | `/:eventId` | Path: `eventId` (int) | `200` → Event |
| `PATCH` | `/:eventId` | Path: `eventId`, Body: `UpdateEventInput` | `200` → Event |
| `PATCH` | `/:eventId/status` | Path: `eventId`, Body: `{ is_active }` | `200` → Event |
| `PATCH` | `/soft/:eventId` | Path: `eventId` | `200` → Event (soft delete) |

### Lesiones — `/injuries`

| Método | Ruta | Parámetros | Respuesta |
|---|---|---|---|
| `POST` | `/` | Body: `CreateInjuryInput` | `201` → Injury |
| `GET` | `/fighter/:fighterId` | Path: `fighterId` | `200` → Injury[] |
| `GET` | `/:injuryId` | Path: `injuryId` | `200` → Injury |
| `GET` | `/:fighterId/severity` | Path: `fighterId` | `200` → Injury[] |
| `PATCH` | `/:injuryId` | Path: `injuryId`, Body: `UpdateInjuryInput` | `200` → Injury |
| `PATCH` | `/:injuryId/status` | Body: `{ is_active }` | `200` → Injury |
| `PATCH` | `/soft/:injuryId` | Path: `injuryId` | `200` → Injury (soft delete) |

### Stables (Fighter-Teams) — `/stables`

| Método | Ruta | Parámetros | Respuesta |
|---|---|---|---|
| `POST` | `/` | Body: `CreateStableInput` | `201` → FighterTeam |
| `GET` | `/fighter/:fighterId` | Path: `fighterId` | `200` → FighterTeam[] |
| `GET` | `/:stableId` | Path: `stableId` | `200` → FighterTeam |
| `PATCH` | `/:stableId` | Body: `UpdateStableInput` | `200` → FighterTeam |
| `PATCH` | `/soft/:stableId` | — | `200` → FighterTeam (soft delete) |

### Weights (Fighter-Division) — `/weights`

| Método | Ruta | Parámetros | Respuesta |
|---|---|---|---|
| `POST` | `/` | Body: `CreateWeightInput` | `201` → FighterDivision |
| `GET` | `/fighter/:fighterId` | Path: `fighterId` | `200` → FighterDivision[] |
| `GET` | `/:weightId` | Path: `weightId` | `200` → FighterDivision |
| `PATCH` | `/:weightId` | Body: `UpdateWeightInput` | `200` → FighterDivision |
| `PATCH` | `/soft/:weightId` | — | `200` → FighterDivision (soft delete) |

### Rankings — `/rankings`

| Método | Ruta | Parámetros | Respuesta |
|---|---|---|---|
| `POST` | `/` | Body: `CreateRankingInput` | `201` → Ranking |
| `GET` | `/` | — | `200` → Ranking[] |
| `GET` | `/division/:divisionId` | Path: `divisionId` | `200` → Ranking[] |
| `GET` | `/:rankingId` | Path: `rankingId` | `200` → Ranking |
| `PATCH` | `/:rankingId` | Body: `UpdateRankingInput` | `200` → Ranking |
| `PATCH` | `/soft/:rankingId` | — | `200` → Ranking (soft delete) |

### Títulos — `/titles`

| Método | Ruta | Parámetros | Respuesta |
|---|---|---|---|
| `POST` | `/` | Body: `CreateTitleInput` | `201` → Title |
| `GET` | `/fighter/:fighterId` | Path: `fighterId` | `200` → Title[] |
| `GET` | `/division/:divisionId` | Path: `divisionId` | `200` → Title[] |
| `GET` | `/division/:divisionId/title-type/:titleType` | Path: división + tipo | `200` → Title[] |
| `GET` | `/:titleId` | Path: `titleId` | `200` → Title |
| `PATCH` | `/:titleId` | Body: `UpdateTitleInput` | `200` → Title |
| `PATCH` | `/soft/:titleId` | — | `200` → Title (soft delete) |

### Campamentos — `/camps`

| Método | Ruta | Parámetros | Respuesta |
|---|---|---|---|
| `POST` | `/` | Body: `CreateCampInput` | `201` → TrainingCamp |
| `GET` | `/fighter/:fighterId` | Path: `fighterId` | `200` → Camp[] |
| `GET` | `/team/:teamId` | Path: `teamId` | `200` → Camp[] |
| `GET` | `/:campId` | Path: `campId` | `200` → Camp |
| `PATCH` | `/:campId` | Body: `UpdateCampInput` | `200` → Camp |
| `PATCH` | `/soft/:campId` | — | `200` → Camp (soft delete) |

### Estadísticas — `/stats`

| Método | Ruta | Parámetros | Respuesta |
|---|---|---|---|
| `PATCH` | `/:fighterId` | Path: `fighterId` | `200` → FighterStats (cálculo agregado) |
| `GET` | `/:fighterId` | Path: `fighterId` | `200` → FighterStats |

### Peleas — `/bouts`

| Método | Ruta | Parámetros | Respuesta |
|---|---|---|---|
| `POST` | `/` | Body: `CreateBoutInput` | `201` → Bout |
| `GET` | `/` | — | `200` → Bout[] |
| `GET` | `/event/:eventId` | Path: `eventId` | `200` → Bout[] |
| `GET` | `/division/:divisionId` | Path: `divisionId` | `200` → Bout[] |
| `GET` | `/:boutId` | Path: `boutId` | `200` → Bout |
| `PATCH` | `/:boutId` | Body: `UpdateBoutInput` | `200` → Bout |
| `PATCH` | `/:boutId/status` | Body: `{ status_bout }` | `200` → Bout |
| `PATCH` | `/soft/:boutId` | — | `200` → Bout (soft delete) |

### Jueces — `/judges`

| Método | Ruta | Parámetros | Respuesta |
|---|---|---|---|
| `POST` | `/` | Body: `CreateJudgeInput` | `201` → BoutJudge |
| `GET` | `/bout/:boutId` | Path: `boutId` | `200` → BoutJudge[] |
| `GET` | `/:id` | Path: `id` | `200` → BoutJudge |
| `PATCH` | `/:id` | Body: `UpdateJudgeInput` | `200` → BoutJudge |
| `DELETE` | `/soft/:id` | — | `200` → BoutJudge (soft delete) |

### Métricas de Pelea — `/metrics`

| Método | Ruta | Parámetros | Respuesta |
|---|---|---|---|
| `POST` | `/` | Body: `CreateMetricInput` | `201` → BoutMetric |
| `GET` | `/bout/:boutId` | Path: `boutId` | `200` → BoutMetric[] |
| `GET` | `/bout/:boutId/fighter/:fighterId/round/:round` | Path: 3 parámetros | `200` → BoutMetric |
| `GET` | `/:metricId` | Path: `metricId` | `200` → BoutMetric |
| `PATCH` | `/:metricId` | Body: `UpdateMetricInput` | `200` → BoutMetric |
| `PATCH` | `/soft/:metricId` | — | `200` → BoutMetric (soft delete) |

### Pesajes — `/weighIns`

| Método | Ruta | Parámetros | Respuesta |
|---|---|---|---|
| `POST` | `/` | Body: `CreateWeighInInput` | `201` → BoutWeighIn |
| `GET` | `/` | — | `200` → BoutWeighIn[] |
| `GET` | `/bout/:boutId` | Path: `boutId` | `200` → BoutWeighIn[] |
| `GET` | `/:id` | Path: `id` | `200` → BoutWeighIn |
| `PATCH` | `/:id` | Body: `UpdateWeighInInput` | `200` → BoutWeighIn |
| `PATCH` | `/soft/:id` | — | `200` → BoutWeighIn (soft delete) |

### Bonos — `/bonuses`

| Método | Ruta | Parámetros | Respuesta |
|---|---|---|---|
| `POST` | `/` | Body: `CreateBonusInput` | `201` → BoutBonus |
| `GET` | `/` | — | `200` → BoutBonus[] |
| `GET` | `/fighter/:fighterId` | Path: `fighterId` | `200` → BoutBonus[] |
| `GET` | `/:bonusId` | Path: `bonusId` | `200` → BoutBonus |
| `PATCH` | `/:bonusId` | Body: `UpdateBonusInput` | `200` → BoutBonus |
| `PATCH` | `/soft/:bonusId` | — | `200` → BoutBonus (soft delete) |

### Odds — `/odds`

| Método | Ruta | Parámetros | Respuesta |
|---|---|---|---|
| `POST` | `/` | Body: `CreateOddsInput` | `201` → BoutOdds |
| `GET` | `/bout/:boutId` | Path: `boutId` | `200` → BoutOdds[] |
| `GET` | `/provider/:provider` | Path: `provider` | `200` → BoutOdds[] |
| `GET` | `/:oddsId` | Path: `oddsId` | `200` → BoutOdds |
| `PATCH` | `/:oddsId` | Body: `UpdateOddsInput` | `200` → BoutOdds |
| `PATCH` | `/soft/:oddsId` | — | `200` → BoutOdds (soft delete) |

---

## Modelo de Datos (Prisma Schema)

### Enumeraciones

| Enum | Valores |
|---|---|
| `Gender` | `Masculino`, `Femenino`, `Otro` |
| `Stance` | `Orthodox`, `Southpaw`, `Switch`, `Open_Stance` |
| `BoutResult` | `Win_Red`, `Win_Blue`, `Draw`, `No_Contest` |
| `WinMethod` | `KO`, `TKO`, `Submission`, `Unanimous_Decision`, `Split_Decision`, `Majority_Decision`, `Doctor_Stoppage`, `Disqualification` |
| `BonusType` | `Fight_of_the_night`, `Performance_of_the_night`, `Submission_of_the_night`, `Knockout_of_the_night` |
| `InjurySeverity` | `Menor`, `Moderado`, `Severo` |
| `BoutStatus` | `Programada`, `Cancelada`, `En_Proceso`, `Finalizada` |
| `TitleType` | `Undisputed`, `Interino`, `Vacante` |
| `SubmissionType` | `Rear_Naked_Choke`, `Guillotine_Choke`, `Armbar`, `Triangle_Choke`, `Kimura`, `Americana`, `Ankle_Lock`, `Heel_Hook`, `Kneebar`, `Wrist_Lock`, `Other` |

### Tablas (17)

| Tabla (física) | Modelo Prisma | Descripción |
|---|---|---|
| `fighters` | `fighters` | Luchadores: datos personales, slug único, estancia, activo |
| `fighter_injuries` | `fighterInjuries` | Lesiones: descripción, severidad, fechas |
| `divisions` | `divisions` | Divisiones de peso: nombre, clase, género |
| `fighter_division` | `fighterDivision` | **N:M** — luchador ↔ división (unique compuesto) |
| `teams` | `teams` | Equipos/gimnasios: nombre, ubicación, fundación |
| `fighter_teams` | `fighterTeams` | **N:M** — luchador ↔ equipo con fechas join/leave |
| `events` | `events` | Eventos: nombre, fecha, ubicación, recinto, tamaño octágono |
| `bouts` | `bouts` | Peleas: esquina roja/azul, resultado, método, réferi, título |
| `bout_metrics` | `boutMetrics` | Métricas por asalto: golpes, derribos, control (unique bout+fighter+round) |
| `bout_judges` | `boutJudges` | Puntajes de jueces (unique bout+judge_name) |
| `bout_weigh_ins` | `boutWeighIns` | Pesajes oficiales (unique bout+fighter) |
| `fighter_rankings` | `fighterRankings` | Rankings por división con fecha |
| `bout_bonuses` | `boutBonuses` | Bonos post-pelea por luchador |
| `fighter_titles` | `fighterTitles` | Historial de títulos/cinturones |
| `bout_odds` | `boutOdds` | Odds de apuestas (apertura/cierre) por proveedor |
| `training_camps` | `trainingCamps` | Campamentos: luchador + equipo para una pelea (unique bout+fighter) |
| `fighter_stats` | `fighterStats` | Estadísticas de carrera (1 registro por luchador, upsert) |

### Diagrama de Relaciones Clave

```
events 1──N bouts 1──N boutMetrics
                 1──N boutJudges
                 1──N boutWeighIns
                 1──N boutBonuses
                 1──N boutOdds
                 1──N trainingCamps
                 N──1 fighters (red_corner)
                 N──1 fighters (blue_corner)
                 N──1 divisions

fighters 1──N fighterInjuries
         1──N fighterDivision N──1 divisions
         1──N fighterTeams    N──1 teams
         1──N trainingCamps
         1──1 fighterStats

divisions 1──N fighterRankings
          1──N fighterTitles
```

---

## Scripts Disponibles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Servidor en caliente con `tsx watch` |
| `pnpm build` | Compilación TypeScript a `dist/` |
| `pnpm start` | Inicia servidor desde `dist/` |
| `pnpm test` | Ejecuta tests con Jest |
| `pnpm typecheck` | Verificación de tipos sin emitir |
| `pnpm clean` | Elimina `dist/` |
| `pnpm prisma:migrate` | Ejecuta migraciones de desarrollo |
| `pnpm prisma:generate` | Regenera el cliente Prisma |
| `pnpm prisma:validate` | Valida el schema Prisma |
| `pnpm prisma:reset` | Reset completo de migraciones |
| `pnpm docker:start` | Levanta todos los servicios con Docker Compose |
| `pnpm docker:stop` | Detiene todos los servicios Docker |

---

## Testing

### Tests Automatizados (Jest + Supertest)

```
__test__/
├── api/api.test.txt                     # Smoke: welcome, health, ping, docs
├── fighters/fighter.test.ts            # CRUD fighter + validación
├── relational/
│   ├── camps/camp.test.ts              # Campamentos de entrenamiento (21 tests)
│   ├── stats/stats.test.ts             # Estadísticas de carrera (9 tests)
│   ├── injuries/injuries.test.ts
│   ├── ranking/ranking.test.ts
│   ├── stables/stable.test.ts
│   ├── titles/titles.test.ts
│   └── weights/weight.test.ts
└── helpers/testBase.ts                 # Clase base con truncado de tablas
```

**Configuración:** SWC para transformación rápida, entorno Node, mock completo del módulo Redis.

**Limpieza de BD en tests:** El helper `testBase.ts` implementa `clearDatabase()` que trunca las 13 tablas en orden inverso de dependencias (definido en `tablesToClear` en `utils.ts`).

### Tests Manuales (.http)

Archivos para REST Client (VS Code) en `test/` — cubren todos los endpoints del sistema.

---

## Diagrama de Secuencia: Creación de un Luchador

```mermaid
sequenceDiagram
    Cliente->>+Express: POST /api/v1/fighters { first_name, last_name, ... }
    Express->>+middlewareRateLimit: Verifica límite de escritura
    middlewareRateLimit-->>Express: Dentro del límite, next()
    Express->>+secureMiddleware: POST, requiere API Key
    secureMiddleware-->>Express: API Key válida, next()
    Express->>+clearCacheMiddleware: Invalida cache de /fighters*
    clearCacheMiddleware-->>Express: next()
    Express->>+FighterController.create: req.body
    FighterController->>+fighterSchema.safeParse: Validación Zod
    fighterSchema-->>FighterController: { success: true, data }
    FighterController->>+FighterService.create: data
    FighterService->>+prisma.fighters.findUnique: ¿slug existe?
    prisma-->>FighterService: null (no existe)
    FighterService->>+prisma.fighters.create: { ...data, slug }
    prisma-->>FighterService: Fighter creado
    FighterService-->>FighterController: Fighter
    FighterController-->>Cliente: 201 { status, message, data: Fighter }
```
