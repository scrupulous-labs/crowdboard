import { join } from "node:path"

import { Env } from "@crowdboard-backend/env"
import { Context, Effect, Layer, Redacted, Schema } from "effect"
import { runner as pgMigrateRunner, RunnerOption } from "node-pg-migrate"
import { Client } from "pg"

export class DbMigration extends Context.Service<DbMigration>()("@app/services/db/migration", {
  make: Effect.gen(function* () {
    const { pg } = yield* Env
    const acquireClient = Effect.acquireRelease(
      Effect.tryPromise({
        try: () => new Client({ connectionString: Redacted.value(pg.url) }).connect(),
        catch: (cause) => new DbMigrationError({ cause, operation: "CONNECT_DB" }),
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
          catch: (cause) => new DbMigrationError({ cause, operation: "RUN_MIGRATIONS" }),
        })
      }).pipe(Effect.scoped, Effect.when(Effect.succeed(pg.migrationsEnabled))),
    }
  }),
}) {
  static readonly layer = Layer.provide(Layer.effect(this, this.make), Env.layer)
}

export class DbMigrationError extends Schema.TaggedError<DbMigrationError>("@app/errors/db/migration")(
  "DbMigrationError",
  {
    cause: Schema.Defect(),
    operation: Schema.Literals(["RUN_MIGRATIONS", "CONNECT_DB"]),
  },
) {}
