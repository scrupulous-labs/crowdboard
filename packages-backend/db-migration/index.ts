import { join } from "node:path";

import { Env } from "@crowdboard-backend/env";
import { Effect, Data, Redacted, Context, Layer } from "effect";
import { runner } from "node-pg-migrate";

export class DbMigrationError extends Data.TaggedError("DbMigrationError")<{
  readonly cause: unknown;
}> {}

export class DbMigration extends Context.Service<DbMigration>()("@app/db-migration", {
  make: Effect.gen(function* () {
    const env = yield* Env;

    return {
      runMigrations: Effect.tryPromise({
        try: async () => {
          await runner({
            direction: "up",
            dir: join(import.meta.dirname, "./migrations"),
            databaseUrl: Redacted.value(env.pg.url),
            migrationsTable: "migrations",
            advisoryLockMode: "wait",
            migrationLoaderStrategies: [{ extensions: [".sql"], loader: "sql" }],
          });
        },
        catch: (cause) => new DbMigrationError({ cause }),
      }),
    };
  }),
}) {
  static readonly layer = Layer.effect(this, this.make).pipe(Layer.provide(Env.layer));

  static readonly layerForMigrationScripts = Layer.effect(this, this.make).pipe(
    Layer.provide(Env.layerForMigrationScripts),
  );
}
