import { Env } from "@crowdboard-backend/env"
import { PgClient } from "@effect/sql-pg"
import * as PgDrizzle from "drizzle-orm/effect-postgres"
import { Context, Effect, Layer } from "effect"

import { relations } from "../drizzle"

export class Db extends Context.Service<Db>()("@services/db/db", {
  make: Effect.gen(function* () {
    const db = yield* PgDrizzle.make({ relations })
    return db
  }),
}) {
  static readonly layer = Layer.effect(this, this.make).pipe(
    Layer.provide(PgDrizzle.DefaultServices),
    Layer.provide(
      Env.pipe(
        Effect.map(({ pg: { url, maxConnections } }) =>
          PgClient.layer({ url, multiplex: true, maxConnections: maxConnections.db }),
        ),
        Layer.unwrap,
        Layer.provide(Env.layer),
      ),
    ),
  )
}
