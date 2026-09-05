import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { DbAsync } from "@crowdboard-backend/db";
import { schema } from "@crowdboard-backend/db-schema";
import { type BetterAuthOptions } from "better-auth";
import { organization as _organization } from "better-auth/plugins";
import { Effect } from "effect";

export const SharedOptions = Effect.gen(function* () {
  const db = yield* DbAsync;
  return {
    database: drizzleAdapter(db, { schema, provider: "pg", camelCase: true }),
    user: { modelName: "users", fields: { image: "avatarUrl" } },
    account: { modelName: "accounts" },
    session: { modelName: "userSessions" },
    verification: { modelName: "verifications" },
  } satisfies Pick<BetterAuthOptions, "database" | "user" | "account" | "session" | "verification">;
});

export const organization = _organization({
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
