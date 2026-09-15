import { join } from "node:path"

import { Env } from "@crowdboard-backend/env"
import { Context, Effect, Layer, Redacted } from "effect"
import { runner as pgMigrateRunner, RunnerOption } from "node-pg-migrate"
import { Client } from "pg"

import { DbMigrationError } from "./error"

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
