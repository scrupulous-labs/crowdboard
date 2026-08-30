create table "public.users" (
	"id" text not null primary key,
	"name" text not null,
	"email" text not null unique,
	"avatarUrl" text,
	"emailVerified" boolean not null,
	"createdAt" timestamptz default CURRENT_TIMESTAMP not null,
	"updatedAt" timestamptz default CURRENT_TIMESTAMP not null
);


create table "public.workspaces" (
	"id" text not null primary key,
	"name" text not null,
	"slug" text not null unique,
	"logoUrl" text,
	"metadata" text,
	"createdAt" timestamptz not null
);


create table "public.teams" (
	"id" text not null primary key,
	"workspaceId" text not null references "public.workspaces" ("id") on delete cascade,
	"name" text not null,
	"memberCount" integer not null,
	"createdAt" timestamptz not null,
	"updatedAt" timestamptz
);
create index "teams_workspaceId_idx" on "public.teams" ("workspaceId");


create table "public.workspaceMembers" (
	"id" text not null primary key,
	"userId" text not null references "public.users" ("id") on delete cascade,
	"workspaceId" text not null references "public.workspaces" ("id") on delete cascade,
	"role" text not null,
	"firstName" text not null,
	"lastName" text,
	"avatarUrl" text,
	"createdAt" timestamptz not null
);
create index "workspaceMembers_userId_idx" on "public.workspaceMembers" ("userId");
create index "workspaceMembers_workspaceId_idx" on "public.workspaceMembers" ("workspaceId");


create table "public.teamMembers" (
	"id" text not null primary key,
	"userId" text not null references "public.users" ("id") on delete cascade,
	"teamId" text not null references "public.teams" ("id") on delete cascade,
	"membershipKey" text unique,
	"createdAt" timestamptz
);
create index "teamMembers_userId_idx" on "public.teamMembers" ("userId");
create index "teamMembers_teamId_idx" on "public.teamMembers" ("teamId");


create table "public.accounts" (
	"id" text not null primary key,
	"userId" text not null references "public.users" ("id") on delete cascade,
	"issuer" text not null,
	"accountId" text not null,
	"providerId" text not null,
	"scope" text,
	"password" text,
	"idToken" text,
	"accessToken" text,
	"refreshToken" text,
	"accessTokenExpiresAt" timestamptz,
	"refreshTokenExpiresAt" timestamptz,
	"createdAt" timestamptz default CURRENT_TIMESTAMP not null,
	"updatedAt" timestamptz not null
);
create index "accounts_userId_idx" on "public.accounts" ("userId");
create unique index "accounts_issuer_accountId_uidx" on "public.accounts" ("issuer", "accountId");


create table "public.invitations" (
	"id" text not null primary key,
	"inviterId" text not null references "public.users" ("id") on delete cascade,
	"workspaceId" text not null references "public.workspaces" ("id") on delete cascade,
	"teamId" text,
	"email" text not null,
	"role" text,
	"status" text not null,
	"expiresAt" timestamptz not null,
	"createdAt" timestamptz default CURRENT_TIMESTAMP not null
);
create index "invitations_email_idx" on "public.invitations" ("email");
create index "invitations_workspaceId_idx" on "public.invitations" ("workspaceId");


create table "public.userSessions" (
	"id" text not null primary key,
	"userId" text not null references "public.users" ("id") on delete cascade,
	"activeWorkspaceId" text,
	"activeTeamId" text,
	"token" text not null unique,
	"ipAddress" text,
	"userAgent" text,
	"expiresAt" timestamptz not null,
	"createdAt" timestamptz default CURRENT_TIMESTAMP not null,
	"updatedAt" timestamptz not null
);
create index "userSessions_userId_idx" on "public.userSessions" ("userId");


create table "public.verifications" (
	"id" text not null primary key,
	"value" text not null,
	"identifier" text not null,
	"expiresAt" timestamptz not null,
	"createdAt" timestamptz default CURRENT_TIMESTAMP not null,
	"updatedAt" timestamptz default CURRENT_TIMESTAMP not null
);
create index "verifications_identifier_idx" on "public.verifications" ("identifier");
