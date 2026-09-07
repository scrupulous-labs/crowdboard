import { DbAsync } from "@crowdboard-backend/db";
import { Env } from "@crowdboard-backend/env";
import { Effect, Context, Layer } from "effect";

import { WidgetAuthClient } from "./auth-clients/widget-auth-client";
import { WorkspaceAuthClient } from "./auth-clients/workspace-auth-client";
import { makeGetSession } from "./auth/user";

export class WorkspaceAuth extends Context.Service<WorkspaceAuth>()("@app/workspace-auth", {
  make: WorkspaceAuthClient.pipe(
    Effect.map((client) => ({
      client,
      req: {
        getSession: makeGetSession(client),
      },
    })),
  ),
}) {
  static readonly layer = Layer.provide(
    Layer.effect(this, this.make),
    Layer.mergeAll(DbAsync.layer, Env.layer),
  );
}

export class WidgetAuth extends Context.Service<WidgetAuth>()("@app/widget-auth", {
  make: WidgetAuthClient.pipe(
    Effect.map((client) => ({
      client,
      user: {
        getSession: makeGetSession(client),
      },
    })),
  ),
}) {
  static readonly layer = Layer.provide(
    Layer.effect(this, this.make),
    Layer.mergeAll(DbAsync.layer, Env.layer),
  );
}
