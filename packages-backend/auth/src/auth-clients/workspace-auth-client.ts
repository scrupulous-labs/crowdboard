import { Env } from "@crowdboard-backend/env";
import { createId } from "@paralleldrive/cuid2";
import { betterAuth } from "better-auth";
import { lastLoginMethod } from "better-auth/plugins";
import { Effect } from "effect";

import { organization, SharedOptions } from "./shared";

const _WorkspaceAuthClient = Effect.gen(function* () {
  const env = yield* Env;
  const sharedOptions = yield* SharedOptions;

  return betterAuth({
    baseURL: env.server.origin,
    trustedOrigins: [env.app.workspaceOrigin, env.server.origin, env.server.originLocalhost],
    emailAndPassword: { enabled: true },
    socialProviders: {
      google: {
        clientId: env.auth.google.clientId,
        clientSecret: env.auth.google.clientSecret,
        redirectURI: env.auth.google.redirectUri,
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
    ...sharedOptions,
  });
});

export interface WorkspaceAuthClient extends Effect.Success<typeof _WorkspaceAuthClient> {}
export const WorkspaceAuthClient: Effect.Effect<
  WorkspaceAuthClient,
  Effect.Error<typeof _WorkspaceAuthClient>,
  Effect.Services<typeof _WorkspaceAuthClient>
> = _WorkspaceAuthClient;
