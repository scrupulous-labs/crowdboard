import { PgEnv } from "@crowdboard-backend/env";
import { Context, Effect, Layer, Redacted } from "effect";
import { Pool } from "pg";

export class PgPool extends Context.Service<PgPool>()("@app/pg-pool", {
  make: Effect.gen(function* () {
    const pg = yield* PgEnv;
    return new Pool({ connectionString: Redacted.value(pg.url) });
  }),
}) {
  static readonly layerWithoutDeps = Layer.effect(this, this.make);
  static readonly layer = Layer.provide(this.layerWithoutDeps, PgEnv.layer);
}
