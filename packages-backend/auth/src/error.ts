import { Data } from "effect"

export class AuthError extends Data.TaggedError("AuthError")<{
  readonly cause: unknown
}> {}

export class AuthInvalidLayerError extends Data.TaggedError("AuthInvalidLayerError")<{
  readonly expected: string[]
  readonly provided: string
}> {}
