import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { DbNative } from "@crowdboard-backend/db";
import { schema } from "@crowdboard-backend/db-schema";
import { Env } from "@crowdboard-backend/env";
import { createId } from "@paralleldrive/cuid2";
import { betterAuth } from "better-auth";
import { organization as _organization } from "better-auth/plugins";
import { lastLoginMethod } from "better-auth/plugins";
import { Context, Effect, Layer } from "effect";

export class Auth extends Context.Service<Auth>()("@app/auth", {
  make: Effect.gen(function* () {
    const db = yield* DbNative;
    const env = yield* Env;

    return betterAuth({
      baseURL: env.hostname,
      database: drizzleAdapter(db, {
        schema: schema,
        provider: "pg",
        camelCase: true,
      }),
      advanced: {
        cookiePrefix: "cb",
        useSecureCookies: true,
        database: {
          joins: true,
          generateId: createId,
        },
        crossSubDomainCookies: {
          enabled: true,
          domain: getDomain(env),
        },
      },
      trustedOrigins: getTrustedDomains(env),
      user: {
        modelName: "users",
        fields: { image: "avatarUrl" },
      },
      account: { modelName: "accounts" },
      session: { modelName: "userSessions" },
      verification: { modelName: "verifications" },
      emailAndPassword: {
        enabled: true,
      },
      plugins: [lastLoginMethod(), organization()],
    });
  }),
}) {
  static readonly layer = Layer.effect(this, this.make).pipe(
    Layer.provide(DbNative.layer),
    Layer.provide(Env.layer),
  );

  static readonly layerForMigrationScripts = Layer.effect(this, this.make).pipe(
    Layer.provide(DbNative.layerForMigrationScripts),
    Layer.provide(Env.layerForMigrationScripts),
  );
}


// Utils - crossSubDomainCookies
function getDomain(env: Context.Service.Shape<typeof Env>) {
  switch (env.nodeEnv) {
    case "production":
      return "app.crowdboard.io";
    case "development":
      return "app.crowdboard.localhost";
    default:
      return "";
  }
}

function getTrustedDomains(env: Context.Service.Shape<typeof Env>) {
  switch (env.nodeEnv) {
    case "production":
      return ["crowdboard.io", "app.crowdboard.io"];
    case "development":
      return ["crowdboard.localhost", "app.crowdboard.localhost"];
    default:
      return [];
  }
}

// Utils - Plugins
function organization() {
  return _organization({
    creatorRole: "owner",
    teams: {
      enabled: true,
      allowRemovingAllTeams: false,
    },
    schema: {
      session: {
        fields: { activeOrganizationId: "activeWorkspaceId" },
      },
      organization: {
        modelName: "workspaces",
        fields: { logo: "logoUrl" },
      },
      team: {
        modelName: "teams",
        fields: { organizationId: "workspaceId" },
      },
      invitation: {
        modelName: "invitations",
        fields: { organizationId: "workspaceId" },
      },
      member: {
        modelName: "workspaceMembers",
        fields: { organizationId: "workspaceId" },
        additionalFields: {
          firstName: { type: "string", required: true },
          lastName: { type: "string", required: false },
          avatarUrl: { type: "string", required: false },
        },
      },
      teamMember: {
        modelName: "teamMembers",
      },
    },
  });
}
