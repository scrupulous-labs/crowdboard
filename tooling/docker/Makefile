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
