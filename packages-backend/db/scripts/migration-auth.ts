import { AuthForMigrationScript } from "@crowdboard-backend/auth"
import { ConfigProviderForMigrationScript, Env } from "@crowdboard-backend/env"
import { Cause, Effect, Exit, identity, Redacted } from "effect"
import { Pool } from "pg"

export const auth = await Effect.gen(function* () {
  const { pg } = yield* Env
  const auth = yield* AuthForMigrationScript
  auth.options.database = new Pool({ connectionString: Redacted.value(pg.url) })
  return auth
})
  .pipe(
    Effect.provide(Env.layer),
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
