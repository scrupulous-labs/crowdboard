import * as Auth from "@crowdboard-backend/auth"
import { WorkspaceContract as WC } from "@crowdboard/contracts"
import { Match as M } from "@crowdboard/effect-extra"
import * as Model from "@crowdboard/models"
import { Effect, Schema } from "effect"
import { HttpApiBuilder, HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "effect/http-api"
import * as Option from "effect/Option"

const Api = Model.Api

export const AuthApiHandlers = HttpApiBuilder.group(
  WC.Api.Api,
  WC.Api.AuthApiGroup.identifier,
  (handlers) => {
    return handlers
      .handle(
        "signUpWithEmail",
        Effect.fn(function* ({ payload }) {
          const sessionMaybe = yield* WC.Api.UserSession
          const response = yield* sessionMaybe.pipe(
            Option.match({
              onNone: () => Auth.signUpWithEmail(payload),
              onSome: () => Effect.fail(""),
            }),
          )
        }),
      )

      .handle(
        "loginWithEmail",
        Effect.fn(function* ({ payload }) {
          // const Login = yield* Auth.logInWithEmail(payload).pipe(whenNotLoggedIn)
          return HttpApiSchema.withHeaders({
            body: new Model.Api.Workspace.RedirectToOnboarding({ step: "userDetails" }),
            headers: {},
          })
        }),
      )

      .handle(
        "loginWithGoogle",
        Effect.fn(function* () {}),
      )

      .handle(
        "logout",
        Effect.fn(function* () {}),
      )
  },
)

function whenNotLoggedIn<A, E, R>(eff: Effect.Effect<A, E, R>) {
  return Effect.gen(function* () {
    const sessionMaybe = yield* WC.Api.UserSession
    const redirectIfLoggedIn = M.value(sessionMaybe).pipe(
      M.when(
        M.Option.some(M.Schema(Api.UserSession.UserSession)({ activeWorkspaceId: M.Option.none })),
        () => new Api.Workspace.RedirectToOnboarding({ step: "createWorkspace" }),
      ),
      M.when(
        M.Option.some(M.Schema(Api.UserSession.UserSession)({ activeWorkspaceId: M.Option.some() })),
        () => new Api.Workspace.RedirectToApp(),
      ),
      M.option,
      Option.getOrUndefined,
    )

    return yield* eff.pipe(
      Effect.when(Effect.succeed(!redirectIfLoggedIn)),
      Effect.map(
        Option.getOrElse(() =>
          HttpApiSchema.withHeaders({
            body: redirectIfLoggedIn!,
            headers: {},
          }),
        ),
      ),
    )
  })
}
