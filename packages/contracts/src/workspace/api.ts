import * as Model from "@crowdboard/models"
import { Schema, Option, Context } from "effect"
import { HttpApi, HttpApiEndpoint, HttpApiGroup, HttpApiMiddleware } from "effect/unstable/httpapi"

export class UserSession extends Context.Service<
  UserSession,
  Option.Option<Model.Api.Workspace.UserSession>
>()("@services/contract/workspace/api/user-session") {}

export class UserSessionMiddleware extends HttpApiMiddleware.Service<
  UserSessionMiddleware,
  { provides: UserSession }
>()("@middleware/contract/workspace/api/user-session", {
  requiredForClient: true,
}) {}

export class AuthApiGroup extends HttpApiGroup.make("auth")
  .add(
    HttpApiEndpoint.post("signUpWithEmail", "/signup/email", {
      payload: Schema.Struct({ email: Model.Email, password: Model.Password }),
      success: Schema.Union([Model.Api.Workspace.RedirectToOnboarding]),
      error: Schema.Union([Model.Api.Workspace.FormValidationError]),
    }),

    HttpApiEndpoint.post("loginWithEmail", "/login/email", {
      payload: Schema.Struct({ email: Model.Email, password: Model.Password }),
      success: Schema.Union([
        Model.Api.Workspace.RedirectToOnboarding,
        Model.Api.Workspace.RedirectToApp,
      ]),
      error: Schema.Any,
    }),

    HttpApiEndpoint.post("loginWithGoogle", "/login/google", {
      payload: Schema.Struct({}),
      success: Model.Api.Workspace.RedirectToUrl,
    }),

    HttpApiEndpoint.get("loginWithGoogle", "/login/google", {
      query: Schema.Record(Schema.String, Schema.String),
    }),

    HttpApiEndpoint.post("logout", "/logout", {
      payload: Schema.Struct({}),
      success: Model.Api.Workspace.RedirectToLogin,
    }),
  )
  .prefix("/workspace")
  .middleware(UserSessionMiddleware) {}

export class Api extends HttpApi.make("workspace").add(AuthApiGroup) {}
