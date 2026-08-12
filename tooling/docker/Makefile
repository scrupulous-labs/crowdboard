# =========================================================
# Local Development Services
# Run these from the root: make -C tooling/docker <cmd>
# =========================================================
start-dev-services:
	docker compose -f docker-compose.dev.yaml up -d

stop-dev-services:
	docker compose -f docker-compose.dev.yaml down

reset-dev-services:
	docker compose -f docker-compose.dev.yaml down -v

connect-dev-db:
	docker exec -it crowdboard-dev_db psql -U postgres -d crowdboard
