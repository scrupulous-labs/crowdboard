import { isAPIError } from "better-auth/api"
import { Effect } from "effect"
import * as Cause from "effect/Cause"
import * as Match from "effect/Match"
import { HttpServerRequest } from "effect/unstable/http"

export const DefaultAuthOpts = Effect.gen(function* () {
  const req = yield* HttpServerRequest.HttpServerRequest
  return { headers: req.headers, returnStatus: true, returnHeaders: true } as const
})

export const toAPIErrorOrDie = (err: Cause.UnknownError) => {
  return Match.value(err.cause).pipe(
    Match.when(isAPIError, (err) => Effect.fail(err)),
    Match.orElse(() => Effect.die(err)),
  )
}

export const toAPIErrorAndDie = (err: Cause.UnknownError) => {
  return Match.value(err.cause).pipe(
    Match.when(isAPIError, (err) => Effect.die(err)),
    Match.orElse(() => Effect.die(err)),
  )
}
