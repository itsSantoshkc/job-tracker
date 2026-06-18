# Job Application Tracker - Backend

REST API for managing job applications, built with NestJS and TypeORM.

## Tech Stack

- **Framework:** NestJS
- **ORM:** TypeORM
- **Database:** PostgreSQL
- **Validation:** class-validator + class-transformer
- **API Docs:** Swagger (available at `/api`)

## Project Setup

```bash
pnpm install
```

Create a `.env` file based on `.env.example`:

```
DATABASE_URL="postgresql://postgres:root@localhost:5432/job_tracker"
PORT=3000
FRONTEND_URL=http://localhost:5173
```

## Database

TypeORM is configured with `synchronize: false`. To manage the schema, generate and run migrations:

```bash
# Generate a migration from entity changes
pnpm typeorm migration:generate src/migrations/<MigrationName> -d src/data-source.ts

# Run pending migrations
pnpm typeorm migration:run -d src/data-source.ts

# Revert the last migration
pnpm typeorm migration:revert -d src/data-source.ts
```

Seed the database:

```bash
pnpm db:seed
```

## Run

```bash
# development
pnpm start:dev

# production
pnpm build && pnpm start:prod
```

## Tests

```bash
pnpm test
```

## API Endpoints

| Method   | Endpoint              | Description               |
| -------- | --------------------- | ------------------------- |
| `POST`   | `/applications`       | Create a new application  |
| `GET`    | `/applications`       | List applications (paginated, filterable) |
| `GET`    | `/applications/:id`   | Get a single application  |
| `PATCH`  | `/applications/:id`   | Update an application     |
| `DELETE` | `/applications/:id`   | Delete an application     |

### Query Parameters (GET /applications)

| Param    | Type   | Description                          |
| -------- | ------ | ------------------------------------ |
| `status` | string | Filter by status (applied, interviewing, offer, rejected) |
| `search` | string | Search by company name or job title   |
| `page`   | number | Page number (default: 1)              |
| `limit`  | number | Items per page (default: 10, max: 100) |

## License

UNLICENSED
