import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { Db } from "@crowdboard-backend/db";
import { schema } from "@crowdboard-backend/db-schema";
import { createId } from "@paralleldrive/cuid2";
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import { Context, Effect, Layer } from "effect";

export class Auth extends Context.Service<Auth>()("@app/auth", {
  make: Effect.gen(function* () {
    const db = yield* Db;

    return betterAuth({
      database: drizzleAdapter(db, {
        schema: schema,
        provider: "pg",
        camelCase: true,
      }),
      advanced: {
        cookiePrefix: "cb",
        database: {
          joins: true,
          generateId: createId,
        },
      },
      user: { modelName: "users" },
      session: { modelName: "userSessions" },
      account: { modelName: "userAccounts" },
      verification: { modelName: "verifications" },
      emailAndPassword: {
        enabled: true,
      },
      plugins: [
        organization({
          schema: {
            organization: { modelName: "workspaces" },
            member: {
              modelName: "workspaceMembers",
              fields: { organizationId: "workspaceId" },
            },
            invitation: {
              modelName: "invitations",
              fields: { organizationId: "workspaceId" },
            },
          },
        }),
      ],
    });
  }),
}) {
  static readonly layer = Layer.effect(this, this.make).pipe(Layer.provide(Db.layer));
}
