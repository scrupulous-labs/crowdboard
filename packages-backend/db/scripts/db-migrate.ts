import { MigrationScriptConfigProvider } from "@crowdboard-backend/env"
import { Cause, Effect, Exit, identity } from "effect"

import { DbMigration } from "../src"

Effect.gen(function* () {
  const { runMigrations } = yield* DbMigration
  yield* runMigrations
})
  .pipe(
    Effect.provide(DbMigration.layer),
    Effect.provide(MigrationScriptConfigProvider.layer),
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
