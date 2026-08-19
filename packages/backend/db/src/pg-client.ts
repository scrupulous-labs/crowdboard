import { Env } from "@crowdboard-backend/env";
import { PgClient } from "@effect/sql-pg";
import { Effect, Layer } from "effect";
import { types } from "pg";

export const PgClientLive = Effect.gen(function* () {
  const { pgUrl } = yield* Env;
  return PgClient.layer({
    url: pgUrl,
    types: {
      getTypeParser: (typeId, format) => {
        // Return raw values for date/time types to let Drizzle handle parsing
        if ([1184, 1114, 1082, 1186, 1231, 1115, 1185, 1187, 1182].includes(typeId)) {
          return (val: any) => val;
        }
        return types.getTypeParser(typeId, format);
      },
    },
  });
}).pipe(Layer.unwrap, Layer.provide(Env.layer));
