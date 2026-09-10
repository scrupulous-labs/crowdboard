import { WorkspaceAuth } from "@crowdboard-backend/auth"
import { MigrationScriptConfigProvider, Env } from "@crowdboard-backend/env"
import { Cause, Effect, Exit, identity, Layer, Redacted } from "effect"
import { Pool } from "pg"

export const auth = await Effect.gen(function* () {
  const { pg } = yield* Env
  const { client } = yield* WorkspaceAuth
  client.options.database = new Pool({
    connectionString: Redacted.value(pg.url),
  }) as any
  return client
})
  .pipe(
    Effect.provide(Layer.provideMerge(WorkspaceAuth.layer, Env.layer)),
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
