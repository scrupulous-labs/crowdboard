import { Env } from "@crowdboard-backend/env";
import { Context, Effect, Layer, Redacted } from "effect";
import { Pool } from "pg";

export class PgPool extends Context.Service<PgPool>()("@app/pg-pool", {
  make: Effect.gen(function* () {
    const env = yield* Env;
    return new Pool({ connectionString: Redacted.value(env.pg.url) });
  }),
}) {
  static readonly layer = Layer.effect(this, this.make).pipe(Layer.provide(Env.layer));

  static readonly layerForMigrationScripts = Layer.effect(this, this.make).pipe(
    Layer.provide(Env.layerForMigrationScripts),
  );
}
