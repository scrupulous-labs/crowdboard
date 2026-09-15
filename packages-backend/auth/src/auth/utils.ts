import { isAPIError } from "better-auth/api"

import { AuthError } from "../error"

export const toAuthError = (error: unknown) => {
  return !isAPIError(error) ? new AuthError({ cause: error }) : new AuthError({ cause: error.message })
}
