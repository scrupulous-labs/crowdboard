import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { DbNative } from "@crowdboard-backend/db";
import { schema } from "@crowdboard-backend/db-schema";
import { AuthEnv, Env, PgEnv, ServerEnv } from "@crowdboard-backend/env";
import { createId } from "@paralleldrive/cuid2";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { Context, Effect, Layer } from "effect";

import { lastLoginMethod, organization } from "./plugins";

const SharedOpts = Effect.gen(function* () {
  const db = yield* DbNative;
  return {
    database: drizzleAdapter(db, { schema: schema, provider: "pg", camelCase: true }),
    user: { modelName: "users", fields: { image: "avatarUrl" } },
    account: { modelName: "accounts" },
    session: { modelName: "userSessions" },
    verification: { modelName: "verifications" },
  } satisfies Pick<BetterAuthOptions, "database" | "user" | "account" | "session" | "verification">;
});

export class Auth extends Context.Service<Auth>()("@app/auth", {
  make: Effect.gen(function* () {
    const env = yield* Env;
    const auth = yield* AuthEnv;
    const server = yield* ServerEnv;
    const opts = (() => {
      switch (env.nodeEnv) {
        case "production":
          return {
            cookieDomain: "crowdboard.io",
            workspaceOrigin: "https://app.crowdboard.io",
          };
        case "development":
          return {
            cookieDomain: "crowdboard.localhost",
            workspaceOrigin: "https://app.crowdboard.localhost",
          };
      }
    })();

    return betterAuth({
      baseURL: server.origin,
      emailAndPassword: { enabled: true },
      socialProviders: {
        google: {
          clientId: auth.google.clientId,
          clientSecret: auth.google.clientSecret,
          redirectURI: auth.google.redirectUri,
        },
      },
      advanced: {
        database: { joins: true, generateId: createId },
        cookiePrefix: "cb",
        defaultCookieAttributes: {
          domain: opts.cookieDomain,
          path: "/",
          secure: true,
          httpOnly: true,
        },
      },
      trustedOrigins: [opts.workspaceOrigin, server.origin, server.originLocalhost],
      plugins: [lastLoginMethod, organization],
      ...(yield* SharedOpts),
    });
  }),
}) {
  static readonly layerWithoutDeps = Layer.effect(this, this.make).pipe(
    Layer.provide(Layer.mergeAll(DbNative.layerWithoutDeps, Env.layer, AuthEnv.layer, ServerEnv.layer)),
  );
  static readonly layer = this.layerWithoutDeps.pipe(Layer.provide(PgEnv.layer));
}
