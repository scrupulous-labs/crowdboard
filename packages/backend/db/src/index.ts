import { relations } from "@crowdboard-backend/db-schema";
import * as PgDrizzle from "drizzle-orm/effect-postgres";
import { Context, Layer } from "effect";

import { PgClientLive } from "./pg-client";

export class Db extends Context.Service<Db>()("@app/db", {
  make: PgDrizzle.make({
    relations: relations,
  }),
}) {
  static readonly layer = Layer.effect(this, this.make).pipe(
    Layer.provide(PgClientLive),
    Layer.provide(PgDrizzle.DefaultServices),
  );
}
