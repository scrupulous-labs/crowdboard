import * as Auth from "@crowdboard-backend/auth"
import { WorkspaceContract as WC } from "@crowdboard/contracts"
import { Match as M } from "@crowdboard/effect-extra"
import * as Model from "@crowdboard/models"
import { Effect } from "effect"
import * as Option from "effect/Option"
import { HttpApiBuilder, HttpApiEndpoint, HttpApiGroup } from "effect/unstable/httpapi"

const Api = Model.Api

export const AuthApiHandlers = HttpApiBuilder.group(
  WC.Api.Api,
  WC.Api.AuthApiGroup.identifier,
  (handlers) => {
    return handlers
      .handle(
        "signUpWithEmail",
        Effect.fn(function* ({ payload }) {}),
      )

      .handle(
        "loginWithEmail",
        Effect.fn(function* ({ payload }) {
          const Login = yield* Auth.User.logInWithEmail(payload).pipe(whenNotLoggedIn)
          return new Model.Api.Workspace.RedirectToOnboarding({ step: "userDetails" })
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
      Effect.map(Option.getOrElse(() => redirectIfLoggedIn!)),
    )
  })
}
