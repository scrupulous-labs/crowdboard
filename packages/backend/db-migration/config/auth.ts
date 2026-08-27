import { Auth } from "@crowdboard-backend/auth";
import { Env } from "@crowdboard-backend/env";
import { Cause, Effect, Exit, identity, Layer, Redacted } from "effect";
import { Pool } from "pg";

export const auth = await Effect.gen(function* () {
  const env = yield* Env;
  const auth = yield* Auth;
  auth.options.database = new Pool({
    connectionString: Redacted.value(env.pgUrl),
  }) as any;

  return auth;
})
  .pipe(Effect.provide(Layer.merge(Auth.layer, Env.layer)), Effect.runPromiseExit)
  .then(
    Exit.match({
      onSuccess: identity,
      onFailure: (cause) => {
        console.log(Cause.pretty(cause));
        process.exit(1);
      },
    }),
  );
