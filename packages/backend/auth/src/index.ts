import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { Db } from "@crowdboard-backend/db";
import { betterAuth } from "better-auth";
import { Context, Effect, Layer } from "effect";

export class Auth extends Context.Service<Auth>()("@app/auth", {
  make: Effect.gen(function* () {
    const db = yield* Db;

    return betterAuth({
      database: drizzleAdapter(db, {
        provider: "pg",
      }),
    });
  }),
}) {
  static readonly layer = Layer.effect(this, this.make).pipe(Layer.provide(Db.layer));
}
