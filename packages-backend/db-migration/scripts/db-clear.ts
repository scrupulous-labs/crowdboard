import { Db } from "@crowdboard-backend/db";
import { sql } from "drizzle-orm";
import { Cause, Effect, Exit, identity } from "effect";

await Effect.gen(function* () {
  const db = yield* Db;
  yield* db.execute(sql`DROP SCHEMA public CASCADE`);
  yield* db.execute(sql`CREATE SCHEMA public`);
}).pipe(
  Effect.provide(Db.layerForMigrationScripts),
  Effect.runPromiseExit
).then(Exit.match({
  onSuccess: identity,
  onFailure: (cause) => {
    console.log(Cause.pretty(cause));
    process.exit(1);
  }
}))
