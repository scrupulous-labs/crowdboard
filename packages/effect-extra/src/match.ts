import { APIError as _APIError } from "better-auth"
import { pipe } from "effect"
import * as F from "effect/Function"
import * as M from "effect/Match"
import * as O from "effect/Option"
import * as P from "effect/Predicate"
import * as S from "effect/Schema"

export * from "effect/Match"

export const APIError = {
  code: <T extends { code: string }>(key: T) => {
    return { body: (body: _APIError["body"]) => key.code === body?.code }
  },
  status: (key: _APIError["status"]) => {
    return { status: (status: _APIError["status"]) => key === status }
  },
}

export const Option = {
  none: ((maybe: unknown): maybe is O.None<never> => {
    return O.isOption(maybe) && O.isNone(maybe)
  }) satisfies P.Refinement<unknown, O.None<never>>,

  some: <T extends {}>(
    match?: T | P.Refinement<unknown, T> | M.SafeRefinement<unknown, T>,
  ): P.Refinement<unknown, O.Some<T>> => {
    return (maybe: unknown): maybe is O.Some<T> => {
      return (
        O.isOption(maybe) &&
        O.isSome(maybe) &&
        pipe(maybe.value, (val: unknown): val is T =>
          M.value(val).pipe(
            M.when(match ?? M.defined, () => true),
            M.orElse(() => false),
          ),
        )
      )
    }
  },
}

export const Schema = <Schema extends S.Top & (new (params: any) => any)>(schema: Schema) => {
  return <
    Match extends Partial<{
      [K in keyof InstanceType<Schema>]:
        | InstanceType<Schema>[K]
        | P.Refinement<unknown, InstanceType<Schema>[K]>
        | M.SafeRefinement<unknown, InstanceType<Schema>[K]>
    }>,
    Result extends {
      [K in keyof Match]: Match[K] extends M.SafeRefinement<unknown, infer Refined>
        ? Refined
        : Match[K] extends P.Refinement<unknown, infer Refined>
          ? Refined
          : Match[K]
    },
  >(
    match: Match,
  ): P.Refinement<unknown, Result> => {
    return (val: unknown): val is Result => {
      return M.value(val).pipe(
        M.whenAnd(M.instanceOf(schema), match, F.constant(true)),
        M.orElse(F.constant(false)),
      )
    }
  }
}
