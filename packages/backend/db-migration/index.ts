import { join } from "node:path";

import { Env } from "@crowdboard-backend/env";
import { Effect, Data, Redacted } from "effect";
import { runner } from "node-pg-migrate";

export class DbMigration extends Effect.Service<DbMigration>()("@app/db-migration", {
  effect: Effect.gen(function* () {
    const { pgUrl } = yield* Env;

    return {
      runMigrations: () => {
        return Effect.tryPromise({
          try: async () => {
            await runner({
              direction: "up",
              dir: join(import.meta.dirname, "./migrations"),
              databaseUrl: Redacted.value(pgUrl),
              migrationsTable: "crowdboard_migrations",
              advisoryLockMode: "wait",
              migrationLoaderStrategies: [{ extensions: [".sql"], loader: "sql" }],
            });
          },
          catch: (cause) => new DbMigrationError({ cause }),
        });
      },
    };
  }),
  dependencies: [Env.Default],
}) {}

export class DbMigrationError extends Data.TaggedError("DbMigrationError")<{
  readonly cause: unknown;
}> {}
