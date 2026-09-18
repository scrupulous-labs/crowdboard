import { Schema } from "effect"

import { Email } from "../../utils"

export type UserId = typeof UserId.Type
export const UserId = Schema.String.pipe(Schema.brand("UserId"))

export class User extends Schema.Class<User>("User")({
  id: UserId,
  name: Schema.String,
  email: Email,
  emailVerified: Schema.Boolean,
  avatarUrl: Schema.String.pipe(Schema.OptionFromNullOr),
  isAnonymous: Schema.Boolean,
  createdAt: Schema.DateTimeUtcFromDate,
  updatedAt: Schema.DateTimeUtcFromDate,
}) {}
