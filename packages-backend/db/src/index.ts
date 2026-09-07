import { join } from "node:path";

import { Env } from "@crowdboard-backend/env";
import { PgClient } from "@effect/sql-pg";
import * as PgDrizzle from "drizzle-orm/effect-postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import { Context, Effect, Layer, Redacted, identity } from "effect";
import { runner } from "node-pg-migrate";
import { Pool, types } from "pg";

import { relations } from "./drizzle";
import { DbMigrationError } from "./errors";

export { schema } from "./drizzle";

export class PgPool extends Context.Service<PgPool>()("@app/pg-pool", {
  make: Effect.gen(function* () {
    const env = yield* Env;
    const pool = new Pool({ connectionString: Redacted.value(env.pg.url) });
    return {
      pool,
      getClient: Effect.acquireRelease(
        Effect.tryPromise({
          try: () => pool.connect(),
          catch: (cause) => cause,
        }),
        (client) => Effect.sync(() => client.release()),
      ),
    };
  }),
}) {
  static readonly layer = Layer.provide(Layer.effect(this, this.make), Env.layer);
}

export class DbMigration extends Context.Service<DbMigration>()("@app/db-migration", {
  make: Effect.gen(function* () {
    const { pg } = yield* Env;
    const { getClient } = yield* PgPool;
    return {
      runMigrations: Effect.scoped(
        Effect.gen(function* () {
          const client = yield* getClient;
          const enabled = Effect.succeed(pg.migrationsEnabled);
          return yield* Effect.tryPromise({
            try: () =>
              runner({
                dbClient: client,
                direction: "up",
                dir: join(import.meta.dirname, "../migrations"),
                migrationsTable: "migrations",
                advisoryLockMode: "wait",
                migrationLoaderStrategies: [{ extensions: [".sql"], loader: "sql" }],
              }),
            catch: (cause) => new DbMigrationError({ cause }),
          }).pipe(Effect.when(enabled));
        }),
      ),
    };
  }),
}) {
  static readonly layer = Layer.provide(
    Layer.effect(this, this.make),
    Layer.merge(Env.layer, PgPool.layer),
  );
}

export class DbEffect extends Context.Service<DbEffect>()("@app/db-effect", {
  make: PgDrizzle.make({ relations }),
}) {
  static readonly layer = Layer.provide(
    Layer.effect(this, this.make),
    Layer.merge(
      PgDrizzle.DefaultServices,
      PgClient.layerFrom(
        Effect.gen(function* () {
          const { pool } = yield* PgPool;
          const dontParse = [1184, 1114, 1082, 1186, 1231, 1115, 1185, 1187, 1182];
          return yield* PgClient.fromPool({
            acquire: Effect.succeed(pool),
            types: {
              getTypeParser: (typeId, format) => {
                return dontParse.includes(typeId) ? identity : types.getTypeParser(typeId, format);
              },
            },
          });
        }),
      ).pipe(Layer.provide(PgPool.layer)),
    ),
  );
}

export class DbAsync extends Context.Service<DbAsync>()("@app/db-async", {
  make: Effect.gen(function* () {
    const { pool } = yield* PgPool;
    return drizzle({ client: pool, relations });
  }),
}) {
  static readonly layer = Layer.provide(Layer.effect(this, this.make), PgPool.layer);
}
