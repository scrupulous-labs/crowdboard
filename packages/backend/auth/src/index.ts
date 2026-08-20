import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { Db } from "@crowdboard-backend/db";
import { schema } from "@crowdboard-backend/db-schema";
import { betterAuth } from "better-auth";
import { Context, Effect, Layer } from "effect";

export class Auth extends Context.Service<Auth>()("@app/auth", {
  make: Effect.gen(function* () {
    const db = yield* Db;

    return betterAuth({
      database: drizzleAdapter(db, {
        schema: schema,
        provider: "pg",
        camelCase: true,
      }),
      advanced: {
        database: { joins: true },
        cookiePrefix: "cb",
      },
      user: { modelName: "users" },
      session: { modelName: "userSessions" },
      account: { modelName: "userAccounts" },
      verification: { modelName: "verifications" },
    });
  }),
}) {
  static readonly layer = Layer.effect(this, this.make).pipe(Layer.provide(Db.layer));
}
