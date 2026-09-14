import { Env } from "@crowdboard-backend/env"
import { createId } from "@paralleldrive/cuid2"
import { betterAuth } from "better-auth"
import { anonymous, bearer } from "better-auth/plugins"
import { Effect } from "effect"

import { SharedOptions } from "./shared/options"
import { organization } from "./shared/plugins"

const Client = Effect.gen(function* () {
  const env = yield* Env
  const sharedOptions = yield* SharedOptions

  return betterAuth({
    baseURL: env.server.origin,
    trustedOrigins: ["*"],
    advanced: { database: { joins: true, generateId: createId } },
    plugins: [bearer(), anonymous(), organization],
    ...sharedOptions,
  })
}).pipe(Effect.provide(Env.layer))

export interface AuthClientForWidget extends Effect.Success<typeof Client> {}
export const AuthClientForWidget: Effect.Effect<
  AuthClientForWidget,
  Effect.Error<typeof Client>,
  Effect.Services<typeof Client>
> = Client
