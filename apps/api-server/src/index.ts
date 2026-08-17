import { DbMigration } from "@crowdboard-backend/db-migration";
import { Effect } from "effect";

const program = Effect.gen(function* () {
  const { runMigrations } = yield* DbMigration;
  yield* runMigrations();
}).pipe(
  Effect.provide(DbMigration.layer),
  Effect.catch((error) =>
    Effect.sync(() => {
      console.log(error);
    }),
  ),
);

void Effect.runPromise(program);
