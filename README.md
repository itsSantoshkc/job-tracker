# Job Application Tracker

A full-stack application for tracking job applications with a NestJS backend, React frontend, and PostgreSQL database.

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** NestJS, Prisma ORM, TypeScript
- **Database:** PostgreSQL

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- [Node.js](https://nodejs.org/) >= 22 (for local development)
- [pnpm](https://pnpm.io/) (for local development)

## Quick Start with Docker

```bash
docker-compose up --build
```

This starts all three services:

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:5173        |
| Backend  | http://localhost:3000        |
| Swagger  | http://localhost:3000/api    |
| Database | postgresql://localhost:5432  |

The backend automatically runs Prisma migrations and seeds the database on first startup.

To stop:

```bash
docker-compose down
```

To stop and remove database data:

```bash
docker-compose down -v
```

## Manual Setup (Without Docker)

### 1. Database

Start a PostgreSQL instance and create a database:

```sql
CREATE DATABASE job_tracker;
```

### 2. Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your database credentials:

```
DATABASE_URL="postgresql://postgres:root@localhost:5432/job_tracker"
PORT=3000
FRONTEND_URL=http://localhost:5173
```

Install dependencies and start:

```bash
pnpm install
pnpm exec prisma generate
pnpm exec prisma migrate dev
pnpm run db:seed
pnpm run start:dev
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
```

Edit `.env`:

```
VITE_SERVER_URL="http://localhost:3000"
```

Install and start:

```bash
pnpm install
pnpm run dev
```

## API Endpoints

| Method | Endpoint                | Description              |
|--------|-------------------------|--------------------------|
| GET    | /applications           | List all applications    |
| GET    | /applications/:id       | Get a single application |
| POST   | /applications           | Create an application    |
| PATCH  | /applications/:id       | Update an application    |
| DELETE | /applications/:id       | Delete an application    |

### Query Parameters (GET /applications)

| Parameter | Type   | Values                                      |
|-----------|--------|---------------------------------------------|
| status    | string | `APPLIED`, `INTERVIEWING`, `OFFER`, `REJECTED` |
| search    | string | Search by company name or job title          |
| page      | number | Page number (default: 1)                     |
| limit     | number | Items per page (default: 10)                 |

## Project Structure

```
job-application-tracker/
├── backend/
│   ├── src/
│   │   ├── application/      # Application module (controller, service, DTOs)
│   │   ├── prisma/           # Prisma module
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   ├── migrations/       # Migration files
│   │   └── seed.ts           # Seed data
│   ├── Dockerfile
│   └── entrypoint.sh
├── frontend/
│   ├── src/
│   │   ├── api/              # API client functions
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── types/            # TypeScript types
│   │   └── validation/       # Form validation schemas
│   ├── Dockerfile
│   └── vite.config.ts
└── docker-compose.yml
```
