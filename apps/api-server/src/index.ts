import { DbMigration } from "@crowdboard-backend/db-migration";
import { Effect } from "effect";

const program = Effect.gen(function* () {
  const { runMigrations } = yield* DbMigration;
  yield* runMigrations;
}).pipe(Effect.provide(DbMigration.layer), Effect.catch(Effect.logError));

void Effect.runPromise(program);
