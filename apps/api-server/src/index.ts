import { Auth } from "@crowdboard-backend/auth";
import { DbMigration } from "@crowdboard-backend/db-migration";
import { Effect } from "effect";

const program = Effect.gen(function* () {
  const { runMigrations } = yield* DbMigration;
  yield* runMigrations;

  const auth = yield* Auth;
  const value = yield* Effect.promise(async () => {
    return auth.api.signInSocial({
      body: { provider: "google" },
    });
  });
  yield* Effect.log(value);
}).pipe(Effect.provide(DbMigration.layer), Effect.provide(Auth.layer), Effect.catch(Effect.logError));

void Effect.runPromise(program);
