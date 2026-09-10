import { WorkspaceAuth } from "@crowdboard-backend/auth"
import { DbEffect } from "@crowdboard-backend/db"
import { MigrationScriptConfigProvider } from "@crowdboard-backend/env"
import { Effect } from "effect"

const program = Effect.gen(function* () {
  const db = yield* DbEffect
  const result = yield* db.execute(`SELECT * from migrations`)
  const auth = yield* WorkspaceAuth
  const value = yield* Effect.promise(async () => {
    return auth.client.api.signInSocial({
      body: { provider: "google" },
    })
  })
  yield* Effect.log(result, value)
}).pipe(
  Effect.provide(DbEffect.layer),
  Effect.provide(WorkspaceAuth.layer),
  Effect.provide(MigrationScriptConfigProvider.layer),
  Effect.catch(Effect.logError),
)

void Effect.runPromise(program)
