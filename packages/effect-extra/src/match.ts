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
  None: ((maybe: unknown): maybe is O.None<never> => {
    return O.isOption(maybe) && O.isNone(maybe)
  }) satisfies P.Refinement<unknown, O.None<never>>,

  Some: <T extends {}>(
    match?: T | P.Refinement<unknown, T> | M.SafeRefinement<unknown, T>,
  ): P.Refinement<unknown, O.Some<T>> => {
    return (maybe: unknown): maybe is O.Some<T> => {
      return (
        O.isOption(maybe) &&
        O.isSome(maybe) &&
        pipe(maybe.value, (val: unknown): val is T =>
          M.value(val).pipe(
            M.when(match ?? M.defined, F.constant(true)),
            M.orElse(F.constant(false)),
          ),
        )
      )
    }
  },
}

export const InstanceOf = <
  Class extends (new (params: any) => any),
  Match extends Partial<{
    [K in keyof InstanceType<Class>]:
      | InstanceType<Class>[K]
      | P.Refinement<unknown, InstanceType<Class>[K]>
      | M.SafeRefinement<unknown, InstanceType<Class>[K]>
  }>,
  Result extends {
    [K in keyof Match]: Match[K] extends M.SafeRefinement<unknown, infer Refined>
      ? Refined
      : Match[K] extends P.Refinement<unknown, infer Refined>
        ? Refined
        : Match[K]
  },
>(
  c: Class,
  match?: Match,
): P.Refinement<unknown, Result> => {
  return (val: unknown): val is Result => {
    return M.value(val).pipe(
      M.whenAnd(M.instanceOf(c), match ?? M.defined, F.constant(true)),
      M.orElse(F.constant(false)),
    )
  }
}
