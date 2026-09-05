import { ConfigProvider } from "effect";

const dotEnv = `
APP_ROOT_DOMAIN=google.com
APP_WORKSPACE_ORIGIN=https://google.com

SERVER_PORT=3001
SERVER_ORIGIN=https://google.com
SERVER_ORIGIN_LOCALHOST=https://google.com

AUTH_GOOGLE_CLIENT_ID=google
AUTH_GOOGLE_CLIENT_SECRET=google
AUTH_GOOGLE_REDIRECT_URI=https://google.com

PG_HOST=localhost
PG_PORT=5433
PG_USER=postgres
PG_PASSWORD=postgres
PG_DATABASE=crowdboard
PG_MIGRATIONS_ENABLED=true
`;

export const layer = ConfigProvider.layer(ConfigProvider.fromDotEnvContents(dotEnv));
