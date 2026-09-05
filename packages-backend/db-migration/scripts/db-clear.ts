import { DbEffect } from "@crowdboard-backend/db";
import { MigrationScriptConfigProvider } from "@crowdboard-backend/env";
import { sql } from "drizzle-orm";
import { Cause, Effect, Exit, identity } from "effect";

await Effect.gen(function* () {
  const db = yield* DbEffect;
  yield* db.execute(sql`DROP SCHEMA public CASCADE`);
  yield* db.execute(sql`CREATE SCHEMA public`);
})
  .pipe(
    Effect.provide(DbEffect.layer),
    Effect.provide(MigrationScriptConfigProvider.layer),
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
