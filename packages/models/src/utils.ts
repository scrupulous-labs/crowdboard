import { Schema } from "effect";

export type Email = typeof Email.Type;
export const Email = Schema.String.pipe(Schema.brand("email"));
