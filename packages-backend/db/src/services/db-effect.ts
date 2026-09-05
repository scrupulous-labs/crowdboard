import { relations } from "@crowdboard-backend/db-schema";
import { PgClient } from "@effect/sql-pg";
import * as PgDrizzle from "drizzle-orm/effect-postgres";
import { Context, Effect, Layer, identity } from "effect";
import { types } from "pg";

import { PgPool } from "./pg-pool";

const PgClientLive = PgClient.layerFrom(
  Effect.gen(function* () {
    const pool = yield* PgPool;
    return yield* PgClient.fromPool({
      acquire: Effect.succeed(pool),
      types: {
        getTypeParser: (typeId, format) => {
          // Return raw values for date/time types to let Drizzle handle parsing
          const ids = [1184, 1114, 1082, 1186, 1231, 1115, 1185, 1187, 1182];
          return ids.includes(typeId) ? identity : types.getTypeParser(typeId, format);
        },
      },
    });
  }),
);

export class DbEffect extends Context.Service<DbEffect>()("@app/db", {
  make: PgDrizzle.make({ relations }),
}) {
  static readonly layer = Layer.effect(this, this.make).pipe(
    Layer.provide(PgClientLive),
    Layer.provide(PgPool.layer),
    Layer.provide(PgDrizzle.DefaultServices),
  );
}
