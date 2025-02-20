# Restaurants API

[![Build and Test](https://github.com/teresaromero/restaurants-api/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/teresaromero/restaurants-api/actions/workflows/build-and-test.yml)

Restaurants API serves restaurants information.

- Admins can add, edit and delete restaurants.
- Users can add reviews to the restaurants and save them as favourite.

## How to run the project

Clone the project and install dependencies

```bash
    git clone https://github.com/teresaromero/restaurants-api.git && cd restaurants-api && yarn install
```

The project uses a SQLite Database, a Prisma ORM is use for integration with the server. To run locally make sure you follow this steps:

1. Set up the DATABASE_URL environment variable to point to the SQLite file:

```bash
    export DATABASE_URL=file:./db/dev.db
```

2. Set the required environment variables at a `.env` file, for example:

```bash
export JWT_SECRET=yousecret
export JWT_EXPIRES_IN=secondstoexpire
export HASH_SALT=hashnumber
```

(you can use the same `.env` file for database and app environments)

3. Generate Prisma Client & Migrations

Prisma ORM generates the client within node_modules with the provided schema. For the app to work the Client should be generated.

```bash
    yarn prisma:generate
```

Once the dependency for PrismaClient has been created, the database has to be initialized.
Run migrations so the database schema is aligned with the prisma schema and the client.

```bash
    yarn prisma:migrate:deploy
```

Once you have the database setup, you can inspect it by using Prisma Studio

```bash
    yarn prisma:studio
```

**_prisma will use the DATABASE_URL on the .env file defined for all the commands_**

3. Run the server

```bash
    yarn dev
```

Data models can be consulted at Prisma schema [here](./prisma/schema.prisma)

## SwaggerUI and OpenAPI Spec

An OpenAPI spec is available [here](./openapi.yaml).

However, in development mode, there is a SwaggerUI available to test the API. Once the server is running you can access `http://localhost:${PORT}/docs`.

## Roadmap, missing features

- Implement routes for admin statistics of: number of users, reviews, restaurants.
- Deployment flow
- E2E automation with Bruno CLI in Github
- Implement session management and refresh token for auth
- Migrate to Postgres

## Architecture diagram

Diagrams available at [here](https://excalidraw.com/#json=hFj3XTSj_eVfnsZ5_74ue,krk3BNxrwEArPayhA8Iu8w)

Improvements over current design:

- Replace SQLite with Postgres: replication of data and more eficient queries
- Use Redis Cache: distributed cache to support listing of restaurants and reviews initially
- Add monitoring and logging to be able to know what is happening in the system, potential breaking points or issues or decide which request needs better performance
- Implement a queue system to ingest the reviews creation (potentially the more loaded create flow)
- Use Kubernetes for orchestration of the containers and scale horizontally using a load balancer
