# =========================================================
# Local Development Services
# Run these from the root: pnpm docker <cmd>
# =========================================================
start-dev:
	docker compose -f docker-compose.dev.yaml up -d

stop-dev:
	docker compose -f docker-compose.dev.yaml down

reset-dev:
	docker compose -f docker-compose.dev.yaml down -v

# Connect to dev postgresql
dev-db:
	docker exec -it crowdboard-dev_db psql -U postgres -d crowdboard
