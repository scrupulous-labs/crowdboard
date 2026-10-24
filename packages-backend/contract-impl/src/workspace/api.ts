import * as Auth from "@crowdboard-backend/auth"
import { WorkspaceContract as WC } from "@crowdboard/contracts"
import * as Match from "@crowdboard/effect-extra/match"
import * as Model from "@crowdboard/models"
import { Effect, Schema } from "effect"
import { HttpApiBuilder, HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "effect/http-api"
import * as Option from "effect/Option"

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
    const redirect = Match.value(sessionMaybe).pipe(
      Match.when(
        Match.Option.Some(
          Match.InstanceOf(Model.Api.UserSession.UserSession, {
            activeWorkspaceId: Match.Option.Some(),
          }),
        ),
        (x) => new Model.Api.Workspace.RedirectToApp(),
      ),
      Match.when(
        Match.Option.Some(
          Match.InstanceOf(Model.Api.UserSession.UserSession, {
            activeWorkspaceId: Match.Option.None
          }),
        ),
        () => new Model.Api.Workspace.RedirectToOnboarding({ step: "createWorkspace" }),
      ),
      Match.orElse(() => undefined),
    )

    return yield* !!redirect
      ? Effect.succeed(HttpApiSchema.withHeaders({ body: redirect, headers: {} }))
      : eff
  })
}
