import { DbMigration } from "@crowdboard-backend/db-migration";
import { Cause, Effect, Exit, identity } from "effect";

await Effect.gen(function* () {
  const { runMigrations } = yield* DbMigration;
  yield* runMigrations;
})
  .pipe(Effect.provide(DbMigration.layerForMigrationScripts), Effect.runPromiseExit)
  .then(
    Exit.match({
      onSuccess: identity,
      onFailure: (cause) => {
        console.log(Cause.pretty(cause));
        process.exit(1);
      },
    }),
  );
