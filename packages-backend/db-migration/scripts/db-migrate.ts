import { DbMigration } from "@crowdboard-backend/db-migration";
import { PgEnv } from "@crowdboard-backend/env";
import { Cause, Effect, Exit, identity } from "effect";

await Effect.gen(function* () {
  const { runMigrations } = yield* DbMigration;
  yield* runMigrations;
})
  .pipe(
    Effect.provide(DbMigration.layerWithoutDeps),
    Effect.provide(PgEnv.layerForMigrationScripts),
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
