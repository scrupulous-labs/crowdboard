import { Env } from "@crowdboard-backend/env"
import { createId } from "@paralleldrive/cuid2"
import { betterAuth } from "better-auth"
import { anonymous, bearer, lastLoginMethod } from "better-auth/plugins"
import { Context, Effect, Layer, Match } from "effect"
import { NonEmptyArray } from "effect/Array"

import { SharedOptions } from "./shared/options"
import { organization } from "./shared/plugins"
import { AuthForWidget } from "./widget"
import { AuthForWorkspace } from "./workspace"

export class Auth extends Context.Service<Auth, AuthForWidget | AuthForWorkspace>()(
  "@services/auth/auth",
) {
  static readonly widget = "widget" satisfies AuthForWidget["_tag"]
  static readonly workspace = "workspace" satisfies AuthForWorkspace["_tag"]

  static readonly layerForWidget = Layer.effect(this, AuthForWidget)
  static readonly layerForWorkspace = Layer.effect(this, AuthForWorkspace)

  static readonly expect = <
    Tags extends NonEmptyArray<Context.Service.Shape<typeof Auth>["_tag"]>,
    Expected extends Extract<Context.Service.Shape<typeof Auth>, { _tag: Tags[number] }>,
  >(
    ...tags: Tags
  ) =>
    this.pipe(
      Effect.andThen(
        Match.type<Context.Service.Shape<typeof Auth>>().pipe(
          Match.when(
            (client): client is Expected => tags.includes(client._tag),
            (client) => Effect.succeed(client),
          ),
          Match.orElse((_) => Effect.die("FAILEd")),
        ),
      ),
    )
}

// Use this to generate sql migrations and drizzle schema
export const AuthForMigrationScript = Effect.gen(function* () {
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
