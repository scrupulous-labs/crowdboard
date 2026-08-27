create table "users" (
	"id" text not null primary key,
	"name" text not null,
	"image" text,
	"email" text not null unique,
	"emailVerified" boolean not null,
	"createdAt" timestamptz default CURRENT_TIMESTAMP not null,
	"updatedAt" timestamptz default CURRENT_TIMESTAMP not null
);


create table "userSessions" (
	"id" text not null primary key,
	"userId" text not null references "users" ("id") on delete cascade,
	"token" text not null unique,
	"expiresAt" timestamptz not null,
	"ipAddress" text,
	"userAgent" text,
	"createdAt" timestamptz default CURRENT_TIMESTAMP not null,
	"updatedAt" timestamptz not null
);
create index "userSessions_userId_idx" on "userSessions" ("userId");


create table "userAccounts" (
	"id" text not null primary key,
	"userId" text not null references "users" ("id") on delete cascade,
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
create index "userAccounts_userId_idx" on "userAccounts" ("userId");
create unique index "userAccounts_issuer_accountId_uidx" on "userAccounts" ("issuer", "accountId");


create table "verifications" (
	"id" text not null primary key,
	"value" text not null,
	"identifier" text not null,
	"expiresAt" timestamptz not null,
	"createdAt" timestamptz default CURRENT_TIMESTAMP not null,
	"updatedAt" timestamptz default CURRENT_TIMESTAMP not null
);
create index "verifications_identifier_idx" on "verifications" ("identifier");
