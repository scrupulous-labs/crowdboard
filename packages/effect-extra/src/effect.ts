import { Effect } from "effect"

export * from "effect/Effect"

export function catchChain<E, A1, E1, R1>(
  a: (e: E) => Effect.Effect<A1, E1, R1>,
): <A, R>(eff: Effect.Effect<A, E, R>) => Effect.Effect<A | A1, E1, R | R1>

export function catchChain<E, A1, E1, R1, A2, E2, R2>(
  a: (e: E) => Effect.Effect<A1, E1, R1>,
  b: (e: E1) => Effect.Effect<A2, E2, R2>,
): <A, R>(eff: Effect.Effect<A, E, R>) => Effect.Effect<A | A1 | A2, E2, R | R1 | R2>

export function catchChain<E, A1, E1, R1, A2, E2, R2, A3, E3, R3>(
  a: (e: E) => Effect.Effect<A1, E1, R1>,
  b: (e: E1) => Effect.Effect<A2, E2, R2>,
  c: (e: E2) => Effect.Effect<A3, E3, R3>,
): <A, R>(eff: Effect.Effect<A, E, R>) => Effect.Effect<A | A1 | A2 | A3, E3, R | R1 | R2 | R3>

export function catchChain(...handlers: Array<(e: any) => Effect.Effect<any, any, any>>) {
  return (eff: Effect.Effect<any, any, any>) => {
    return handlers.reduce((acc, h) => Effect.catch(acc, h), eff)
  }
}
