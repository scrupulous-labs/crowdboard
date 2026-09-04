import { relations } from "@crowdboard-backend/db-schema";
import { PgEnv } from "@crowdboard-backend/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { Context, Effect, Layer } from "effect";

import { PgPool } from "./pg-pool";

export class DbAsync extends Context.Service<DbAsync>()("@app/db-native", {
  make: Effect.gen(function* () {
    const pool = yield* PgPool;
    return drizzle({ client: pool, relations });
  }),
}) {
  static readonly layerWithoutDeps = Layer.provide(Layer.effect(this, this.make), PgPool.layerWithoutDeps);
  static readonly layer = Layer.provide(this.layerWithoutDeps, PgEnv.layer);
}
