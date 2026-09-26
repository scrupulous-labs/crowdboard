import { Effect, Match } from "@crowdboard/effect-extra"
import { Api, Email, Password } from "@crowdboard/models"
import { APIError } from "better-auth/api"
import { Option } from "effect"

import { Auth } from "../service"
import { DefaultAuthOpts, toAPIErrorOrDie, toAPIErrorAndDie } from "./utils"

export const signUpWithEmail = Effect.fn(function* (params: { email: Email; password: Password }) {
  const auth = yield* Auth.expect(Auth.workspace)
  const defaultAuthOpts = yield* DefaultAuthOpts
  return yield* Effect.tryPromise(() =>
    auth.api.signUpEmail({
      body: { name: "", email: params.email, password: params.password, rememberMe: true },
      ...defaultAuthOpts,
    }),
  ).pipe(
    Effect.map(({ response }) => ({ token: Option.fromNullishOr(response.token) })),
    Effect.catchChain(
      toAPIErrorOrDie,
      Match.type<APIError>().pipe(
        Match.when(Match.APIError.code(auth.$ERROR_CODES.INVALID_PASSWORD), (err) =>
          Effect.fail("Password must be at least 8 characters long."),
        ),
        Match.whenOr(
          Match.APIError.code(auth.$ERROR_CODES.INVALID_EMAIL),
          Match.APIError.code(auth.$ERROR_CODES.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL),
          (err) => Effect.fail("Email cannot be used for sign up"),
        ),
        Match.whenOr(
          Match.APIError.code(auth.$ERROR_CODES.FAILED_TO_CREATE_USER),
          Match.APIError.code(auth.$ERROR_CODES.FAILED_TO_CREATE_SESSION),
          (err) => Effect.fail("Unable to sign up"),
        ),
        Match.orElse((err) => Effect.die(err)),
      ),
    ),
  )
})

export const logInWithEmail = Effect.fn(function* (params: { email: Email; password: Password }) {
  const auth = yield* Auth.expect(Auth.workspace)
  const defaultAuthOpts = yield* DefaultAuthOpts
  return yield* Effect.tryPromise(() =>
    auth.api.signInEmail({
      body: { email: params.email, password: params.password, rememberMe: true },
      ...defaultAuthOpts,
    }),
  ).pipe(
    Effect.catchChain(
      toAPIErrorOrDie,
      Match.type<APIError>().pipe(
        Match.whenOr(
          Match.APIError.code(auth.$ERROR_CODES.INVALID_EMAIL),
          Match.APIError.code(auth.$ERROR_CODES.INVALID_EMAIL_OR_PASSWORD),
          () => Effect.fail("Cannot login with this email or password"),
        ),
        Match.when(Match.APIError.code(auth.$ERROR_CODES.FAILED_TO_CREATE_SESSION), () =>
          Effect.fail("Failed to log in"),
        ),
        Match.orElse((err) => Effect.die(err)),
      ),
    ),
  )
})

export const logInWithGoogle = Effect.fn(function* () {
  const auth = yield* Auth.expect(Auth.workspace)
  const defaultAuthOpts = yield* DefaultAuthOpts
  return yield* Effect.tryPromise(() =>
    auth.api.signInSocial({
      body: { provider: "google", disableRedirect: true },
      ...defaultAuthOpts
    })
  ).pipe(
    Effect.catch(toAPIErrorAndDie)
  )
})

export const logOut = Effect.fn(function* () {
  const auth = yield* Auth.expect(Auth.workspace)
  const defaultAuthOpts = yield* DefaultAuthOpts
  return yield* Effect.tryPromise(() =>
    auth.api.signOut({ body: { disableRedirect: false }, ...defaultAuthOpts }),
  ).pipe(Effect.catch(toAPIErrorAndDie))
})

export const getSession = Effect.fn(function* () {
  const auth = yield* Auth
  const defaultAuthOpts = yield* DefaultAuthOpts
  return yield* Effect.tryPromise(() => auth.api.getSession(defaultAuthOpts)).pipe(
    Effect.map(({ response }) => {
      const body = response && { ...response.session, ...response.user }
      return Api.UserSession.decodeFromAuth(body)
    }),
    Effect.catch(toAPIErrorAndDie),
  )
})
