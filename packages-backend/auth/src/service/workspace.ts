import { Env } from "@crowdboard-backend/env"
import { createId } from "@paralleldrive/cuid2"
import { betterAuth } from "better-auth"
import { lastLoginMethod } from "better-auth/plugins"
import { Effect } from "effect"

import { organization } from "./shared/organization-plugin"
import { SharedOptions } from "./shared/shared-options"

const Auth = Effect.gen(function* () {
  const env = yield* Env
  const auth = betterAuth({
    baseURL: env.server.origin,
    trustedOrigins: [env.app.workspaceOrigin, env.server.origin, env.server.originLocalhost],
    emailAndPassword: { enabled: true, autoSignIn: true, minPasswordLength: 8, maxPasswordLength: 32 },
    socialProviders: {
      google: {
        clientId: env.auth.google.clientId,
        clientSecret: env.auth.google.clientSecret,
        redirectURI: env.auth.google.redirectUri,
        disableSignUp: false,
        disableImplicitSignUp: false,
      },
    },
    advanced: {
      database: { joins: true, generateId: createId },
      cookiePrefix: "cb",
      defaultCookieAttributes: {
        domain: env.app.rootDomain,
        path: "/",
        secure: true,
        httpOnly: true,
      },
    },
    plugins: [lastLoginMethod(), organization],
    ...(yield* SharedOptions),
  })

  return { _tag: "workspace", ...auth } as const
}).pipe(Effect.provide(Env.layer))

export interface AuthForWorkspace extends Effect.Success<typeof Auth> {}
export const AuthForWorkspace: Effect.Effect<
  AuthForWorkspace,
  Effect.Error<typeof Auth>,
  Effect.Services<typeof Auth>
> = Auth
