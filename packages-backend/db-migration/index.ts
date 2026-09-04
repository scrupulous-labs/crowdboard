import { join } from "node:path";

import { PgEnv } from "@crowdboard-backend/env";
import { Effect, Data, Redacted, Context, Layer } from "effect";
import { runner } from "node-pg-migrate";

export class DbMigration extends Context.Service<DbMigration>()("@app/db-migration", {
  make: Effect.gen(function* () {
    const pg = yield* PgEnv;
    const enabled = Effect.succeed(pg.migrationsEnabled);

    return {
      runMigrations: Effect.tryPromise({
        try: async () => {
          return runner({
            direction: "up",
            dir: join(import.meta.dirname, "./migrations"),
            databaseUrl: Redacted.value(pg.url),
            migrationsTable: "migrations",
            advisoryLockMode: "wait",
            migrationLoaderStrategies: [{ extensions: [".sql"], loader: "sql" }],
          });
        },
        catch: (cause) => new DbMigrationError({ cause }),
      }).pipe(Effect.when(enabled)),
    };
  }),
}) {
  static readonly layerWithoutDeps = Layer.effect(this, this.make);
  static readonly layer = this.layerWithoutDeps.pipe(Layer.provide(PgEnv.layer));
}

export class DbMigrationError extends Data.TaggedError("DbMigrationError")<{
  readonly cause: unknown;
}> {}
