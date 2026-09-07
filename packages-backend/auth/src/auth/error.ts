import { isAPIError } from "better-auth/api";
import { Data } from "effect";

export class AuthError extends Data.TaggedError("AuthError")<{
  readonly cause: unknown;
}> {}

export const toAuthError = (error: unknown) => {
  if (!isAPIError(error)) {
    return new AuthError({ cause: error });
  }

  return new AuthError({
    cause: error.message,
  });
};
