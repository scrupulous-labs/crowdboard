import { relations } from "@crowdboard-backend/db-schema";
import * as PgDrizzle from "drizzle-orm/effect-postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import { Context, Effect, Layer } from "effect";

import { PgClientLive } from "./pg-client";
import { PgPool } from "./pg-pool";

export class Db extends Context.Service<Db>()("@app/db", {
  make: PgDrizzle.make({ relations }),
}) {
  static readonly layer = Layer.effect(this, this.make).pipe(
    Layer.provide(PgClientLive),
    Layer.provide(PgDrizzle.DefaultServices),
  );
}

export class DbAuth extends Context.Service<DbAuth>()("@app/db-auth", {
  make: Effect.gen(function* () {
    const pool = yield* PgPool;
    return drizzle({ client: pool, relations });
  }),
}) {
  static readonly layer = Layer.effect(this, this.make).pipe(Layer.provide(PgPool.layer));
}
