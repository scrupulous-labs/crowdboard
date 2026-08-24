import { Schema } from "effect";

export const UserId = Schema.String.pipe(Schema.brand("models/db/user_id"));
export class User extends Schema.Class<User, { readonly brand: unique symbol }>("models/db/user")({
  id: UserId,
  name: Schema.String,
  image: Schema.String.pipe(Schema.OptionFromNullOr),
  email: Schema.String,
  emailVerified: Schema.Boolean,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
}) {}
