import { Effect, Match } from "@crowdboard/effect-extra"
import { Api, Email, Password } from "@crowdboard/models"
import * as Model from "@crowdboard/models"
import { APIError } from "better-auth/api"

import { Auth } from "../service"
import { DefaultAuthOpts, toAPIErrorOrDie, toAPIErrorAndDie, toEffectHeaders } from "../utils"

export const signUpWithEmail = Effect.fn(function* (params: {
  name: string
  email: Email
  password: Password
}) {
  const defaultAuthOpts = yield* DefaultAuthOpts
  const auth = yield* Auth.expect(Auth.workspace)
  const e = auth.$ERROR_CODES

  return yield* Effect.tryPromise(() =>
    auth.api.signUpEmail({
      ...defaultAuthOpts,
      body: { ...params, rememberMe: true },
    }),
  ).pipe(
    Effect.map(({ response, headers }) => ({
      headers: toEffectHeaders(headers),
      token: response.token!,
      user: Model.Db.User.decodeFromAuth(response.user),
    })),
    Effect.catchChain(
      toAPIErrorOrDie,
      Match.type<APIError>().pipe(
        Match.whenOr(
          Match.APIError.code(e.INVALID_PASSWORD),
          Match.APIError.code(e.PASSWORD_TOO_LONG),
          Match.APIError.code(e.PASSWORD_TOO_SHORT),
          () => {
            const message = "Password must be 8 to 32 characters long."
            return Effect.fail(new Model.Error.UnprocessableEntity({ message }))
          },
        ),
        Match.whenOr(
          Match.APIError.code(e.INVALID_EMAIL),
          Match.APIError.code(e.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL),
          () => {
            const message = "Email cannot be used for sign up."
            return Effect.fail(new Model.Error.UnprocessableEntity({ message }))
          },
        ),
        Match.whenOr(
          Match.APIError.code(e.FAILED_TO_CREATE_USER),
          Match.APIError.code(e.FAILED_TO_CREATE_SESSION),
          () => {
            const message = "Unable to sign up with this email or password."
            return Effect.fail(new Model.Error.UnprocessableEntity({ message }))
          },
        ),
        Match.orElse((err) => Effect.die(err)),
      ),
    ),
  )
})

export const logInWithEmail = Effect.fn(function* (params: { email: Email; password: Password }) {
  const defaultAuthOpts = yield* DefaultAuthOpts
  const auth = yield* Auth.expect(Auth.workspace)
  const e = auth.$ERROR_CODES

  return yield* Effect.tryPromise(() =>
    auth.api.signInEmail({
      ...defaultAuthOpts,
      body: { ...params, rememberMe: true },
    }),
  ).pipe(
    Effect.map(({ response, headers }) => ({
      headers: toEffectHeaders(headers),
      token: response.token,
      user: Model.Db.User.decodeFromAuth(response.user),
    })),
    Effect.catchChain(
      toAPIErrorOrDie,
      Match.type<APIError>().pipe(
        Match.whenOr(
          Match.APIError.code(e.INVALID_EMAIL),
          Match.APIError.code(e.INVALID_PASSWORD),
          Match.APIError.code(e.PASSWORD_TOO_LONG),
          Match.APIError.code(e.PASSWORD_TOO_SHORT),
          Match.APIError.code(e.FAILED_TO_CREATE_SESSION),
          Match.APIError.code(e.INVALID_EMAIL_OR_PASSWORD),
          () => {
            const message = "Cannot login with this email or password."
            return Effect.fail(new Model.Error.Unauthorized({ message }))
          },
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
      ...defaultAuthOpts,
      body: { provider: "google", disableRedirect: true },
    }),
  ).pipe(
    Effect.catch(toAPIErrorAndDie)
  )
})

export const logOut = Effect.fn(function* () {
  const auth = yield* Auth.expect(Auth.workspace)
  const defaultAuthOpts = yield* DefaultAuthOpts
  return yield* Effect.tryPromise(() =>
    auth.api.signOut({ ...defaultAuthOpts, body: { disableRedirect: false } }),
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
