import { Schema } from "effect"
import { HttpStatus } from "effect/http"

// Standard HTTP Errors
export class NotFound extends Schema.TaggedError<NotFound>()(
  "NotFound",
  { message: Schema.NonEmptyString },
  { httpApiStatus: HttpStatus.fromLiteral("NotFound") },
) {}

export class Unauthorized extends Schema.TaggedError<Unauthorized>()(
  "Unauthorized",
  { message: Schema.NonEmptyString },
  { httpApiStatus: HttpStatus.fromLiteral("Unauthorized") },
) {}

export class BadRequest extends Schema.TaggedError<BadRequest>()(
  "BadRequest",
  { message: Schema.NonEmptyString },
  { httpApiStatus: HttpStatus.fromLiteral("BadRequest") },
) {}

export class Forbidden extends Schema.TaggedError<Forbidden>()(
  "Forbidden",
  { message: Schema.NonEmptyString },
  { httpApiStatus: HttpStatus.fromLiteral("Forbidden") },
) {}

export class UnprocessableEntity extends Schema.TaggedError<UnprocessableEntity>()(
  "UnprocessableEntity",
  { message: Schema.NonEmptyString },
  { httpApiStatus: HttpStatus.fromLiteral("UnprocessableEntity") },
) {}

// Custom Errors
export class AlreadyAuthenticated extends Schema.TaggedError<AlreadyAuthenticated>()(
  "AlreadyAuthenticated",
  {},
  { httpApiStatus: HttpStatus.fromLiteral("Conflict") },
) {}
