import { Effect, Match } from "@crowdboard/effect-extra"
import * as Model from "@crowdboard/models"
import { APIError } from "better-auth"

import { Auth } from "../service"
import { DefaultAuthOpts, toAPIErrorOrDie } from "../utils"

export const isSlugAvailable = Effect.fn(function* (params: { slug: string }) {
  const defaultAuthOpts = yield* DefaultAuthOpts
  const auth = yield* Auth.expect(Auth.workspace)
  const e = auth.$ERROR_CODES

  return yield* Effect.tryPromise(() =>
    auth.api.checkOrganizationSlug({ ...defaultAuthOpts, body: params }),
  ).pipe(
    Effect.map(() => true),
    Effect.catchChain(
      toAPIErrorOrDie,
      Match.type<APIError>().pipe(
        Match.when(Match.APIError.code(e.ORGANIZATION_SLUG_ALREADY_TAKEN), () => {
          return Effect.succeed(false)
        }),
        Match.orElse((err) => Effect.die(err)),
      ),
    ),
  )
})

export const createWorkspace = Effect.fn(function* (params: { name: string; slug: string }) {
  const defaultAuthOpts = yield* DefaultAuthOpts
  const auth = yield* Auth.expect(Auth.workspace)
  const e = auth.$ERROR_CODES

  return yield* Effect.tryPromise(() =>
    auth.api.createOrganization({
      ...defaultAuthOpts,
      body: { ...params, keepCurrentActiveOrganization: false },
    }),
  ).pipe(
    Effect.map(({ response }) => Model.Db.Workspace.decode(response)),
    Effect.catchChain(
      toAPIErrorOrDie,
      Match.type<APIError>().pipe(
        Match.when(Match.APIError.code(e.ORGANIZATION_ALREADY_EXISTS), () => {
          const message = "This slug is already in use. Try with a new one."
          return Effect.fail(new Model.Error.UnprocessableEntity({ message }))
        }),
        Match.when(Match.APIError.code(e.YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION), () => {
          const message = "You do not have permission to create a new workspace."
          return Effect.fail(new Model.Error.Forbidden({ message }))
        }),
        Match.when(Match.APIError.code(e.YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS), () => {
          const message = "You have reached maximum number of workspaces for an account."
          return Effect.fail(new Model.Error.Forbidden({ message }))
        }),
        Match.orElse((err) => Effect.die(err)),
      ),
    ),
  )
})

export const deleteWorkspace = Effect.fn(function* (params: {
  workspaceId: Model.Db.Workspace.WorkspaceId
}) {
  const defaultAuthOpts = yield* DefaultAuthOpts
  const auth = yield* Auth.expect(Auth.workspace)
  const e = auth.$ERROR_CODES

  return yield* Effect.tryPromise(() =>
    auth.api.deleteOrganization({
      ...defaultAuthOpts,
      body: { organizationId: params.workspaceId },
    }),
  ).pipe(
    Effect.asVoid,
    Effect.catchChain(
      toAPIErrorOrDie,
      Match.type<APIError>().pipe(
        Match.when(Match.APIError.code(e.ORGANIZATION_NOT_FOUND), () => {
          const message = "This workspace does not exist."
          return Effect.fail(new Model.Error.NotFound({ message }))
        }),
        Match.whenOr(
          Match.APIError.code(e.USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION),
          Match.APIError.code(e.YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION),
          () => {
            const message = "You don't have the permission to delete this workspace."
            return Effect.fail(new Model.Error.Forbidden({ message }))
          },
        ),
        Match.orElse((err) => Effect.die(err)),
      ),
    ),
  )
})
