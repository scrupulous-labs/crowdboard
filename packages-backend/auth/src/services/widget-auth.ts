import { DbAsync } from "@crowdboard-backend/db";
import { Env } from "@crowdboard-backend/env";
import { Effect, Context, Layer } from "effect";

import { WidgetAuthClient } from "../auth-clients/widget-auth-client";
import { makeGetSession } from "../queries/session";

export class WidgetAuth extends Context.Service<WidgetAuth>()("@app/widget-auth", {
  make: WidgetAuthClient.pipe(
    Effect.map((client) => ({
      client,
      getSession: makeGetSession(client),
    })),
  ),
}) {
  static readonly layer = Layer.provide(
    Layer.effect(this, this.make),
    Layer.mergeAll(DbAsync.layer, Env.layer),
  );
}
