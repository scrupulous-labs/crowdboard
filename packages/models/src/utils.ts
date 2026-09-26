import { Schema } from "effect"

export type Email = typeof Email.Type
export const Email = Schema.String.pipe(Schema.brand("Email"))

export type Password = typeof Password.Type
export const Password = Schema.String.pipe(Schema.brand("Password"))
