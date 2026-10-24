import * as HttpApiSchema from "@crowdboard/effect-extra/http-api/HttpApiSchema"
import * as Model from "@crowdboard/models"
import { Rpc, RpcGroup } from "effect/rpc"
import * as Schema from "effect/Schema"

export class AuthRpcGroup extends RpcGroup.make(
  Rpc.make("signUpWithEmail", {
    payload: { email: Model.Email, password: Model.Password, name: Schema.NonEmptyString },
    success: Model.Api.Workspace.RedirectToOnboarding.pipe(
      HttpApiSchema.status("Created"),
      HttpApiSchema.headers({
        "Set-Cookie": Schema.String,
      }),
    ),
    error: Schema.Union([Model.Error.UnprocessableEntity, Model.Error.AlreadyAuthenticated]),
  }),

  Rpc.make("logInWithEmail", {
    payload: { email: Model.Email, password: Model.Password },
    success: Schema.Union([
      Model.Api.Workspace.RedirectToOnboarding,
      Model.Api.Workspace.RedirectToApp,
    ]).pipe(
      HttpApiSchema.status("Ok"),
      HttpApiSchema.headers({
        "Set-Cookie": Schema.String.pipe(Schema.optional),
      }),
    ),
    error: Schema.Union([Model.Error.UnprocessableEntity, Model.Error.AlreadyAuthenticated]),
  }),

  Rpc.make("logInWithGoogle", {}),

  Rpc.make("logOut", {
    success: Model.Api.Workspace.RedirectToLogin,
  }),
).prefix("auth") {}
