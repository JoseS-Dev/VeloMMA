# VeloMMA

> **Versión:** 1.1.0
> **Propósito:** Plataforma analítica con estadísticas avanzadas de eventos, peleadores y métricas de la UFC.

VeloMMA es un backend monolítico que modela y expone información del mundo de las Artes Marciales Mixtas (MMA) a través de una API RESTful. Gestiona luchadores, equipos, divisiones de peso, eventos, peleas, métricas por asalto, jueces, pesajes, bonificaciones, odds de apuestas, rankings, títulos, campamentos de entrenamiento, lesiones y estadísticas de carrera.

## Stack Tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| Node.js | ^22.15 | Runtime del servidor |
| Express | ^5.2.1 | Framework HTTP |
| TypeScript | ^6.0.3 | Tipado estático |
| Prisma | ^7.8.0 | ORM y modelado de datos |
| PostgreSQL | ^17 | Base de datos principal |
| Redis | ^7 | Caché distribuida (opcional) |
| Zod | ^4.4.3 | Validación de esquemas |
| Prometheus | — | Monitoreo y métricas |
| Docker | ^24 | Infraestructura containerizada |

## Arquitectura

Backend monolítico con capas: **Routes → Controllers → Services → Prisma ORM → PostgreSQL**.

Principios clave:
- **Modular monolítico** — cada dominio de negocio es un módulo autocontenido
- **Seguridad por API Key** — escritura requiere header `x-api-key`; GET es público
- **Cache opcional con Redis** — respuestas GET cacheadas 120s
- **Rate limiting dual** — límites separados para lectura y escritura
- **Monitoreo Prometheus** — métricas HTTP, sistema, BD, caché y negocio
- **Soft-delete generalizado** — sin destrucción de datos
- **Documentación OpenAPI** integrada con Swagger UI

## Estructura del Proyecto

```
velomma/                  ← Raíz del proyecto (monorepo)
├── backend/              ← API RESTful (único componente)
│   ├── src/              → Código fuente (módulos, middlewares, tipos)
│   ├── prisma/           → Schema y migraciones de BD
│   ├── config/           → Configuración (entorno, Redis, métricas, Swagger)
│   ├── __test__/         → Tests automatizados (Jest + Supertest)
│   ├── test/             → Archivos .http para pruebas manuales
│   └── README.md         → Documentación detallada del backend
├── docker-compose.yml    → Infraestructura: PostgreSQL, Redis, PgAdmin, Backend
└── .github/workflows/    → CI/CD
```

## Componentes

Actualmente el proyecto consta de un **único componente**:

### Backend (`backend/`)

API RESTful con 17 módulos de dominio:
- **Catálogos:** Luchadores, Equipos, Divisiones, Eventos
- **Peleas:** Peleas, Métricas por asalto, Jueces, Pesajes, Bonos, Odds
- **Relacionales:** Lesiones, Stables (luchador-equipo), Weights (luchador-división), Rankings, Títulos, Campamentos, Estadísticas

Base URL: `http://localhost:3000/api/v1`

Mayor detalle en [`backend/README.md`](./backend/README.md).

## Requisitos Previos

- Node.js ^22.15
- pnpm ^9.0
- PostgreSQL ^17
- Redis ^7 (opcional)
- Docker ^24 (opcional, para infraestructura completa)

## Inicio Rápido

```bash
# Instalar dependencias
cd backend
pnpm install

# Configurar variables de entorno
cp .env.example .env

# Preparar base de datos
pnpm prisma:generate
pnpm prisma:migrate

# Desarrollo (hot-reload)
pnpm dev
```

O usando Docker Compose desde la raíz:

```bash
cd backend
pnpm docker:start
```

## Scripts Principales

| Comando | Descripción |
|---|---|
| `pnpm dev` | Servidor con hot-reload |
| `pnpm build` | Compilación TypeScript |
| `pnpm test` | Tests con Jest |
| `pnpm typecheck` | Verificación de tipos |
| `pnpm docker:start` | Levantar servicios Docker |

## Licencia

MIT — Copyright (c) 2026 Jose Santana
