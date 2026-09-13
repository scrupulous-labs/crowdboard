import { createId } from "@paralleldrive/cuid2"
import { betterAuth } from "better-auth"
import { lastLoginMethod, anonymous, bearer } from "better-auth/plugins"
import { Effect } from "effect"

import { SharedOptions } from "./shared/options"
import { organization } from "./shared/plugins"

const Client = Effect.gen(function* () {
  const sharedOptions = yield* SharedOptions

  return betterAuth({
    emailAndPassword: { enabled: true },
    advanced: { database: { joins: true, generateId: createId } },
    plugins: [bearer(), anonymous(), lastLoginMethod(), organization],
    ...sharedOptions,
  })
})

export interface MigrationScriptAuthClient extends Effect.Success<typeof Client> {}
export const MigrationScriptAuthClient: Effect.Effect<
  MigrationScriptAuthClient,
  Effect.Error<typeof Client>,
  Effect.Services<typeof Client>
> = Client
