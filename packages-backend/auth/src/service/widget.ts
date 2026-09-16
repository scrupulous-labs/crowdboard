import { Env } from "@crowdboard-backend/env"
import { createId } from "@paralleldrive/cuid2"
import { betterAuth } from "better-auth"
import { anonymous, bearer } from "better-auth/plugins"
import { Effect } from "effect"

import { SharedOptions } from "./shared/options"
import { organization } from "./shared/plugins"

const Auth = Effect.gen(function* () {
  const env = yield* Env
  const auth = betterAuth({
    baseURL: env.server.origin,
    trustedOrigins: ["*"],
    advanced: { database: { joins: true, generateId: createId } },
    plugins: [bearer(), anonymous(), organization],
    ...(yield* SharedOptions),
  })

  return { _tag: "widget", ...auth } as const
}).pipe(Effect.provide(Env.layer))

export interface AuthForWidget extends Effect.Success<typeof Auth> {}
export const AuthForWidget: Effect.Effect<
  AuthForWidget,
  Effect.Error<typeof Auth>,
  Effect.Services<typeof Auth>
> = Auth
