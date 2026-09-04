import { Auth } from "@crowdboard-backend/auth";
import { PgEnv } from "@crowdboard-backend/env";
import { Cause, Effect, Exit, identity, Layer, Redacted } from "effect";
import { Pool } from "pg";

export const auth = await Effect.gen(function* () {
  const pg = yield* PgEnv;
  const auth = yield* Auth;
  auth.options.database = new Pool({
    connectionString: Redacted.value(pg.url),
  }) as any;
  return auth;
})
  .pipe(
    Effect.provide(Layer.provideMerge(Auth.layerWithoutDeps, PgEnv.layerForMigrationScripts)),
    Effect.runPromiseExit,
  )
  .then(
    Exit.match({
      onSuccess: identity,
      onFailure: (cause) => {
        console.log(Cause.pretty(cause));
        process.exit(1);
      },
    }),
  );
