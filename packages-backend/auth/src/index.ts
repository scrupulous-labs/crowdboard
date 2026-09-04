import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { DbAsync } from "@crowdboard-backend/db";
import { schema } from "@crowdboard-backend/db-schema";
import { AppEnv, AuthEnv, PgEnv, ServerEnv } from "@crowdboard-backend/env";
import { createId } from "@paralleldrive/cuid2";
import { betterAuth } from "better-auth";
import { Context, Effect, Layer } from "effect";

import { lastLoginMethod, organization } from "./plugins";

export class Auth extends Context.Service<Auth>()("@app/auth", {
  make: Effect.gen(function* () {
    const db = yield* DbAsync;
    const app = yield* AppEnv;
    const auth = yield* AuthEnv;
    const server = yield* ServerEnv;

    return betterAuth({
      baseURL: server.origin,
      trustedOrigins: [app.workspaceOrigin, server.origin, server.originLocalhost],
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
          domain: app.rootDomain,
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
  static readonly layerWithoutDeps = Layer.provide(
    Layer.effect(this, this.make),
    Layer.mergeAll(DbAsync.layerWithoutDeps, AppEnv.layer, AuthEnv.layer, ServerEnv.layer),
  );
  static readonly layer = Layer.provide(this.layerWithoutDeps, PgEnv.layer);
}
