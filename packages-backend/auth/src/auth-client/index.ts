import { Env } from "@crowdboard-backend/env"
import { createId } from "@paralleldrive/cuid2"
import { betterAuth } from "better-auth"
import { anonymous, bearer, lastLoginMethod } from "better-auth/plugins"
import { Context, Effect, Layer } from "effect"

import { SharedOptions } from "./shared/options"
import { organization } from "./shared/plugins"
import { AuthClientForWidget } from "./widget"
import { AuthClientForWorkspace } from "./workspace"

export class AuthClient extends Context.Service<
  AuthClient,
  ({ _tag: "widget" } & AuthClientForWidget) | ({ _tag: "workspace" } & AuthClientForWorkspace)
>()("@services/auth") {
  static readonly layerForWidget = Layer.effect(this)(
    Effect.map(AuthClientForWidget, (client) => ({ _tag: "widget", ...client })),
  )

  static readonly layerForWorkspace = Layer.effect(this)(
    Effect.map(AuthClientForWorkspace, (client) => ({ _tag: "workspace", ...client })),
  )
}

// Use this to generate sql migrations and drizzle schema
export const AuthClientForMigrationScript = Effect.gen(function* () {
  const env = yield* Env
  const sharedOptions = yield* SharedOptions

  return betterAuth({
    baseURL: env.server.origin,
    emailAndPassword: { enabled: true },
    advanced: { database: { joins: true, generateId: createId } },
    plugins: [bearer(), anonymous(), lastLoginMethod(), organization],
    ...sharedOptions,
  })
}).pipe(Effect.provide(Env.layer))
