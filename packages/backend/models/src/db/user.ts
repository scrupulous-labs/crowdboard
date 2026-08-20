import { UserRow } from "@crowdboard-backend/db-schema";
import { Schema, Types } from "effect";

export const UserId = Schema.String.pipe(Schema.brand("user"));

export const User = Schema.Struct({
  id: UserId,
  name: Schema.String,
  image: Schema.String.pipe(Schema.OptionFromNullOr),
  email: Schema.String,
  emailVerified: Schema.Boolean,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
});

// verfy encoded type matches db row
type C0 = Types.Equals<typeof User.Encoded, typeof UserRow.Type>;
const c0: C0 = true;
void c0;
