import { relations } from "@crowdboard-backend/db-schema";
import { PgEnv } from "@crowdboard-backend/env";
import * as PgDrizzle from "drizzle-orm/effect-postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import { Context, Effect, Layer } from "effect";

import { PgClientLive } from "./pg-client";
import { PgPool } from "./pg-pool";

// Effectful Drizzle DB
export class Db extends Context.Service<Db>()("@app/db", {
  make: PgDrizzle.make({ relations }),
}) {
  static readonly layerWithoutDeps = Layer.effect(this, this.make).pipe(
    Layer.provide(PgClientLive),
    Layer.provide(PgPool.layerWithoutDeps),
    Layer.provide(PgDrizzle.DefaultServices),
  );
  static readonly layer = this.layerWithoutDeps.pipe(Layer.provide(PgEnv.layer));
}

// Non-effectful Drizzle Db
export class DbNative extends Context.Service<DbNative>()("@app/db-native", {
  make: Effect.gen(function* () {
    const pool = yield* PgPool;
    return drizzle({ client: pool, relations });
  }),
}) {
  static readonly layerWithoutDeps = Layer.effect(this, this.make).pipe(
    Layer.provide(PgPool.layerWithoutDeps),
  );
  static readonly layer = this.layerWithoutDeps.pipe(Layer.provide(PgEnv.layer));
}
