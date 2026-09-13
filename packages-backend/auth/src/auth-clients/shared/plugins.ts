import { organization as organizationPlugin } from "better-auth/plugins"

export const organization = organizationPlugin({
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
})
