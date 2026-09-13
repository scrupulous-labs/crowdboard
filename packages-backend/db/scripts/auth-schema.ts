import { MigrationScriptAuth } from "@crowdboard-backend/auth"
import { MigrationScriptConfigProvider } from "@crowdboard-backend/env"
import { Cause, Effect, Exit, identity } from "effect"

export const auth = await MigrationScriptAuth.pipe(
  Effect.provide(MigrationScriptAuth.layer),
  Effect.provide(MigrationScriptConfigProvider.layer),
  Effect.runPromiseExit,
).then(
  Exit.match({
    onSuccess: identity,
    onFailure: (cause) => {
      console.log(Cause.pretty(cause))
      process.exit(1)
    },
  }),
)
