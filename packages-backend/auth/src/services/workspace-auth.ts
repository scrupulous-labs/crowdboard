import { DbAsync } from "@crowdboard-backend/db";
import { Env } from "@crowdboard-backend/env";
import { Effect, Context, Layer } from "effect";

import { WorkspaceAuthClient } from "../auth-clients/workspace-auth-client";
import { makeGetSession } from "../queries/session";

export class WorkspaceAuth extends Context.Service<WorkspaceAuth>()("@app/workspace-auth", {
  make: WorkspaceAuthClient.pipe(
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
