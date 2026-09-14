import { join } from "node:path"

import { Env } from "@crowdboard-backend/env"
import { PgClient } from "@effect/sql-pg"
import * as PgDrizzle from "drizzle-orm/effect-postgres"
import { Context, Effect, Layer, Redacted } from "effect"
import { runner as pgMigrateRunner, RunnerOption } from "node-pg-migrate"
import { Client } from "pg"

import { relations } from "./drizzle"
import { DbMigrationError } from "./error"

export * from "./drizzle"
export * from "./error"

export class Db extends Context.Service<Db>()("@services/db", {
  make: Effect.gen(function* () {
    const db = yield* PgDrizzle.make({ relations })
    return db
  }),
}) {
  static readonly layer = Layer.effect(this, this.make).pipe(
    Layer.provide(PgDrizzle.DefaultServices),
    Layer.provide(
      Env.pipe(
        Effect.map(({ pg: { url, maxConnections } }) =>
          PgClient.layer({ url, multiplex: true, maxConnections: maxConnections.db }),
        ),
        Layer.unwrap,
        Layer.provide(Env.layer),
      ),
    ),
  )
}

export class DbMigration extends Context.Service<DbMigration>()("@services/db/db-migration", {
  make: Effect.gen(function* () {
    const { pg } = yield* Env
    const migrationsEnabled = Effect.succeed(pg.migrationsEnabled)
    const acquireClient = Effect.acquireRelease(
      Effect.tryPromise({
        try: () => new Client({ connectionString: Redacted.value(pg.url) }).connect(),
        catch: (cause) => new DbMigrationError({ cause, operation: "CONNECT-DB" }),
      }),
      (client) => Effect.promise(() => client.end()),
    )

    return {
      run: Effect.gen(function* () {
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
          catch: (cause) => new DbMigrationError({ cause, operation: "RUN-MIGRATIONS" }),
        })
      }).pipe(Effect.scoped, Effect.when(migrationsEnabled)),
    }
  }),
}) {
  static readonly layer = Layer.effect(this, this.make).pipe(Layer.provide(Env.layer))
}
