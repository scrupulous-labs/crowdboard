import { Schema } from "effect"

import { Email } from "../utils"

export type UserId = typeof UserId.Type
export const UserId = Schema.String.pipe(Schema.brand("UserId"))

export class User extends Schema.Class<User>("User")({
  id: UserId,
  name: Schema.String,
  image: Schema.String.pipe(Schema.OptionFromNullOr),
  email: Email,
  emailVerified: Schema.Boolean,
  createdAt: Schema.DateTimeUtcFromDate,
  updatedAt: Schema.DateTimeUtcFromDate,
}) {}
