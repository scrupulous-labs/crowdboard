import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { DbAsync } from "@crowdboard-backend/db";
import { schema } from "@crowdboard-backend/db-schema";
import { Env } from "@crowdboard-backend/env";
import { createId } from "@paralleldrive/cuid2";
import { betterAuth } from "better-auth";
import { Context, Effect, Layer } from "effect";

import { lastLoginMethod, organization } from "./plugins";

export class Auth extends Context.Service<Auth>()("@app/auth", {
  make: Effect.gen(function* () {
    const db = yield* DbAsync;
    const env = yield* Env;

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
      database: drizzleAdapter(db, { schema, provider: "pg", camelCase: true }),
      user: { modelName: "users", fields: { image: "avatarUrl" } },
      account: { modelName: "accounts" },
      session: { modelName: "userSessions" },
      verification: { modelName: "verifications" },
      plugins: [lastLoginMethod, organization],
    });
  }),
}) {
  static readonly layer = Layer.provide(
    Layer.effect(this, this.make),
    Layer.mergeAll(DbAsync.layer, Env.layer),
  );
}
