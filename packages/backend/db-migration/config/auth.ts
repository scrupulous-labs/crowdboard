import { Auth } from "@crowdboard-backend/auth";
import { Env } from "@crowdboard-backend/env";
import { type BetterAuthOptions } from "better-auth";
import { Cause, Effect, Exit, identity, Layer, Redacted } from "effect";
import { Pool } from "pg";

export const auth = await Effect.gen(function* () {
  const env = yield* Env;
  const auth = yield* Auth;
  const pgPool = new Pool({
    connectionString: Redacted.value(env.pgUrl),
  }) satisfies BetterAuthOptions["database"]

  auth.options.database = pgPool;
  return auth;
}).pipe(
  Effect.provide(Layer.merge(Auth.layer, Env.layer)),
  Effect.runPromiseExit
).then(
   Exit.match({
    onSuccess: identity,
    onFailure: (cause) => {
      console.log(Cause.pretty(cause));
      process.exit(1);
    }
  }),
);
