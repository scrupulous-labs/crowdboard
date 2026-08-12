import { DbMigration } from "@crowdboard-backend/db-migration";
import { Effect } from "effect";

const program = Effect.gen(function* () {
  const { runMigrations } = yield* DbMigration;
  yield* runMigrations();
});

Effect.runFork(program.pipe(Effect.provide(DbMigration.Default)));
