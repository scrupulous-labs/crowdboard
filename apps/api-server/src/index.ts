import { DbMigration } from "@crowdboard-backend/db"
import { ConfigProviderForMigrationScript } from "@crowdboard-backend/env"
import { Jobs } from "@crowdboard-backend/jobs"
import { Console, Effect } from "effect"

const program = Effect.gen(function* () {
  const dbMigration = yield* DbMigration
  yield* dbMigration.run
  const { start } = yield* Jobs
  yield* start
}).pipe(
  Effect.provide(DbMigration.layer),
  Effect.provide(Jobs.layer),
  Effect.provide(ConfigProviderForMigrationScript.layer),
  Effect.catch(Effect.logError),
  Effect.catchDefect((x) => Console.log(JSON.stringify(x))),
)

await Effect.runPromise(program)
