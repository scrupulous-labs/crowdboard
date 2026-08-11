import { ServerConfig } from "@crowdboard/server-config";
import { Effect, Redacted } from "effect";
import { runner } from 'node-pg-migrate';
import { join } from 'node:path';

export class DbMigration extends Effect.Service<DbMigration>()("@app/db-migration", {
  effect: Effect.gen(function* () {
    const { pgUrl } = yield* ServerConfig
    const migrationDir = join(import.meta.url, './migrations')
    const migtationTable = "crowdboard_migrations"

    return {
      migrateUp: () => {
        return Effect.tryPromise({
          try: async () => {
            await runner({
              databaseUrl: Redacted.value(pgUrl),
              dir: migrationDir,
              migrationsTable: migtationTable,
              direction: "up",
            })
          },
          catch: (error) => {}
        })
      },

      migrateDown: () => {
        return Effect.tryPromise({
          try: async () => {
            await runner({
              databaseUrl: Redacted.value(pgUrl),
              dir: migrationDir,
              migrationsTable: migtationTable,
              direction: "down",
            })
          },
          catch: (error) => {}
        })
      },
    }
  }),
  dependencies: [ServerConfig.Default]
}) {}
