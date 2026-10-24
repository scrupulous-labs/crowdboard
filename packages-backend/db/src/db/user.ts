import * as Model from "@crowdboard/models"
import { eq } from "drizzle-orm"
import { Effect } from "effect"

import { users } from "../drizzle"
import { Db } from "../service"

export const getByEmail = Effect.fn(function* (email: Model.Email) {
  const db = yield* Db
  return yield* db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .pipe(
      Effect.map(([user]) => user),
      Effect.andThen(Model.Db.User.decodeFromDb),
    )
})
