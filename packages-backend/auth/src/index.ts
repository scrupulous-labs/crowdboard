import { Env } from "@crowdboard-backend/env"
import { Effect, Context, Layer } from "effect"

import { MigrationScriptAuthClient } from "./auth-clients/migration-script"
import { WidgetAuthClient } from "./auth-clients/widget"
import { WorkspaceAuthClient } from "./auth-clients/workspace"
import { makeGetSession } from "./auth/user"

export class WorkspaceAuth extends Context.Service<WorkspaceAuth>()("@services/auth/workspace", {
  make: WorkspaceAuthClient.pipe(
    Effect.map((client) => ({
      client,
      req: {
        getSession: makeGetSession(client),
      },
    })),
  ),
}) {
  static readonly layer = Layer.provide(Layer.effect(this, this.make), Env.layer)
}

export class WidgetAuth extends Context.Service<WidgetAuth>()("@services/auth/widget", {
  make: WidgetAuthClient.pipe(
    Effect.map((client) => ({
      client,
      user: {
        getSession: makeGetSession(client),
      },
    })),
  ),
}) {
  static readonly layer = Layer.provide(Layer.effect(this, this.make), Env.layer)
}

export class MigrationScriptAuth extends Context.Service<MigrationScriptAuth>()(
  "@services/auth/migration-script",
  { make: MigrationScriptAuthClient },
) {
  static readonly layer = Layer.provide(Layer.effect(this, this.make), Env.layer)
}
