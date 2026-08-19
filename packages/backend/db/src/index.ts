import * as PgDrizzle from "drizzle-orm/effect-postgres";
import { Context, Layer } from "effect";

import { PgClientLive } from "./pg-client";

export class Db extends Context.Service<Db>()("@app/db", {
  make: PgDrizzle.make({}),
}) {
  static readonly layer = Layer.effect(this, this.make).pipe(
    Layer.provide(PgClientLive),
    Layer.provide(PgDrizzle.DefaultServices),
  );
}
