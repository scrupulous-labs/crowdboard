import * as Data from "effect/Data"

export class InvalidAuthLayerError extends Data.TaggedError("InvalidAuthLayerError")<{
  readonly expected: string[]
  readonly provided: string
}> {}
