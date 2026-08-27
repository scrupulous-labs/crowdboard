create table "workspaces" (
	"id" text not null primary key,
	"name" text not null,
	"slug" text not null unique,
	"logo" text,
	"metadata" text,
	"createdAt" timestamptz not null
);


create table "workspaceMembers" (
	"id" text not null primary key,
	"userId" text not null references "users" ("id") on delete cascade,
	"workspaceId" text not null references "workspaces" ("id") on delete cascade,
	"role" text not null,
	"createdAt" timestamptz not null
);
create index "workspaceMembers_userId_idx" on "workspaceMembers" ("userId");
create index "workspaceMembers_workspaceId_idx" on "workspaceMembers" ("workspaceId");


create table "invitations" (
	"id" text not null primary key,
	"inviterId" text not null references "users" ("id") on delete cascade,
	"workspaceId" text not null references "workspaces" ("id") on delete cascade,
	"email" text not null,
	"role" text,
	"status" text not null,
	"expiresAt" timestamptz not null,
	"createdAt" timestamptz default CURRENT_TIMESTAMP not null
);
create index "invitations_email_idx" on "invitations" ("email");
create index "invitations_workspaceId_idx" on "invitations" ("workspaceId");


alter table "userSessions" add column "activeOrganizationId" text;
