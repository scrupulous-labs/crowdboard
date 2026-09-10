import { join } from "node:path"

import { Env } from "@crowdboard-backend/env"
import { PgClient } from "@effect/sql-pg"
import * as PgDrizzle from "drizzle-orm/effect-postgres"
import { drizzle } from "drizzle-orm/node-postgres"
import { Context, Effect, Layer, Redacted, identity } from "effect"
import { runner as pgMigrateRunner, RunnerOption } from "node-pg-migrate"
import { Pool, types } from "pg"

import { relations } from "./drizzle"
import { DbMigrationError } from "./errors"

export { schema } from "./drizzle"

export class PgPool extends Context.Service<PgPool>()("@app/pg-pool", {
  make: Effect.gen(function* () {
    const env = yield* Env
    const pool = new Pool({ connectionString: Redacted.value(env.pg.url) })
    return {
      pool: pool,
      acquireClient: Effect.acquireRelease(
        Effect.tryPromise({
          try: () => pool.connect(),
          catch: (cause) => new DbMigrationError({ cause }),
        }),
        (client) => Effect.sync(() => client.release()),
      ),
    }
  }),
}) {
  static readonly layer = Layer.provide(Layer.effect(this, this.make), Env.layer)
}

export class DbMigration extends Context.Service<DbMigration>()("@app/db-migration", {
  make: Effect.gen(function* () {
    const { pg } = yield* Env
    const { acquireClient } = yield* PgPool
    const migrationsEnabled = Effect.succeed(pg.migrationsEnabled)
    return {
      runMigrations: Effect.gen(function* () {
        const client = yield* acquireClient
        const runnerOpts: RunnerOption = {
          dir: join(import.meta.dirname, "../migrations"),
          dbClient: client,
          direction: "up",
          migrationsTable: "migrations",
          advisoryLockMode: "wait",
          migrationLoaderStrategies: [{ extensions: [".sql"], loader: "sql" }],
        }
        return yield* Effect.tryPromise({
          try: () => pgMigrateRunner(runnerOpts),
          catch: (cause) => new DbMigrationError({ cause }),
        })
      }).pipe(Effect.when(migrationsEnabled), Effect.scoped),
    }
  }),
}) {
  static readonly layer = Layer.provide(
    Layer.effect(this, this.make),
    Layer.merge(Env.layer, PgPool.layer),
  )
}

export class DbEffect extends Context.Service<DbEffect>()("@app/db-effect", {
  make: Effect.gen(function* () {
    const db = yield* PgDrizzle.make({ relations })
    return db
  }),
}) {
  static readonly layer = Layer.provide(
    Layer.effect(this, this.make),
    Layer.merge(
      PgDrizzle.DefaultServices,
      PgClient.layerFrom(
        Effect.gen(function* () {
          const { pool } = yield* PgPool
          const getTypeParser: typeof types.getTypeParser = (id, format) => {
            const dontParse = [1184, 1114, 1082, 1186, 1231, 1115, 1185, 1187, 1182]
            return !dontParse.includes(id) ? types.getTypeParser(id, format) : identity
          }
          return yield* PgClient.fromPool({
            acquire: Effect.succeed(pool),
            types: { getTypeParser },
          })
        }),
      ).pipe(Layer.provide(PgPool.layer)),
    ),
  )
}

export class DbAsync extends Context.Service<DbAsync>()("@app/db-async", {
  make: Effect.gen(function* () {
    const { pool } = yield* PgPool
    return drizzle({ client: pool, relations })
  }),
}) {
  static readonly layer = Layer.provide(Layer.effect(this, this.make), PgPool.layer)
}
