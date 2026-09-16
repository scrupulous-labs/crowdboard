import { DbMigration } from "@crowdboard-backend/db"
import { ConfigProviderForMigrationScript } from "@crowdboard-backend/env"
import { Cause, Effect, Exit, identity } from "effect"

await Effect.gen(function* () {
  const dbMigration = yield* DbMigration
  yield* dbMigration.run
})
  .pipe(
    Effect.provide(DbMigration.layer),
    Effect.provide(ConfigProviderForMigrationScript.layer),
    Effect.runPromiseExit,
  )
  .then(
    Exit.match({
      onSuccess: identity,
      onFailure: (cause) => {
        console.log(Cause.pretty(cause))
        process.exit(1)
      },
    }),
  )
