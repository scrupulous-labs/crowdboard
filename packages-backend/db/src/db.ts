import { Env } from "@crowdboard-backend/env"
import { PgClient } from "@effect/sql-pg"
import * as PgDrizzle from "drizzle-orm/effect-postgres"
import { Context, Effect, Layer } from "effect"

import { relations } from "./drizzle"

export class Db extends Context.Service<Db>()("@app/services/db/db", {
  make: Effect.gen(function* () {
    const db = yield* PgDrizzle.make({ relations })
    return db
  }),
}) {
  static readonly layer = Layer.provide(
    Layer.effect(this, this.make),
    Layer.merge(
      PgDrizzle.DefaultServices,
      Effect.gen(function* () {
        const { pg } = yield* Env
        return PgClient.layer({
          url: pg.url,
          multiplex: true,
          maxConnections: 8,
        })
      }).pipe(Layer.unwrap, Layer.provide(Env.layer)),
    ),
  )
}
