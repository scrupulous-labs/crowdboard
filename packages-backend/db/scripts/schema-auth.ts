import { AuthForMigrationScript } from "@crowdboard-backend/auth"
import { ConfigProviderForMigrationScript } from "@crowdboard-backend/env"
import { Cause, Effect, Exit, identity } from "effect"

export const auth = await AuthForMigrationScript.pipe(
  Effect.provide(ConfigProviderForMigrationScript.layer),
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
