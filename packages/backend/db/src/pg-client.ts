import { PgClient } from "@effect/sql-pg";
import { Effect, identity, Layer } from "effect";
import { types } from "pg";

import { PgPool } from "./pg-pool";

export const PgClientLive = PgClient.layerFrom(
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
).pipe(Layer.provide(PgPool.layer));
