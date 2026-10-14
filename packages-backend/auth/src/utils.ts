import { isAPIError } from "better-auth/api"
import { Effect } from "effect"
import * as Cause from "effect/Cause"
import * as Headers from "effect/http/Headers"
import * as HttpServerRequest from "effect/http/HttpServerRequest"
import * as Match from "effect/Match"

export const toFetchHeaders = (headers: Headers.Headers) => {
  return new globalThis.Headers(headers)
}

export const toEffectHeaders = (headers: globalThis.Headers) => {
  return Headers.fromInput(headers.entries())
}

export const toAPIErrorOrDie = (err: Cause.UnknownError) => {
  return Match.value(err.cause).pipe(
    Match.when(isAPIError, (apiError) => Effect.fail(apiError)),
    Match.orElse(() => Effect.die(err)),
  )
}

export const toAPIErrorAndDie = (err: Cause.UnknownError) => {
  return Match.value(err.cause).pipe(
    Match.when(isAPIError, (apiError) => Effect.die(apiError)),
    Match.orElse(() => Effect.die(err)),
  )
}

export const DefaultAuthOpts = Effect.gen(function* () {
  const req = yield* HttpServerRequest.HttpServerRequest
  return {
    headers: toFetchHeaders(req.headers),
    returnStatus: true,
    returnHeaders: true,
  } as const
})
