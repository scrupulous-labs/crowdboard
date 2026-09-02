import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { DbNative } from "@crowdboard-backend/db";
import { schema } from "@crowdboard-backend/db-schema";
import { Env } from "@crowdboard-backend/env";
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
    const opts = (() => {
      switch (env.nodeEnv) {
        case "production":
          return {
            serverUrl: "https://api.crowdboard.io",
            cookieDomain: "crowdboard.io",
            trustedOrigins: ["https://app.crowdboard.io"],
          };
        case "development":
          return {
            serverUrl: "https://api.crowdboard.localhost",
            cookieDomain: "crowdboard.localhost",
            trustedOrigins: ["https://app.crowdboard.localhost"],
          };
      }
    })();

    return betterAuth({
      baseURL: opts.serverUrl,
      socialProviders: {
        google: {
          clientId: env.google.clientId,
          clientSecret: env.google.clientSecret,
        },
      },
      trustedOrigins: opts.trustedOrigins,
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
      emailAndPassword: { enabled: true },
      plugins: [lastLoginMethod, organization],
      ...(yield* SharedOpts),
    });
  }),
}) {
  static readonly layer = Layer.effect(this, this.make).pipe(
    Layer.provide(DbNative.layer),
    Layer.provide(Env.layer),
  );

  static readonly layerForMigrationScripts = Layer.effect(this, this.make).pipe(
    Layer.provide(DbNative.layerForMigrationScripts),
    Layer.provide(Env.layerForMigrationScripts),
  );
}
