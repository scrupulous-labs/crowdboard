# =========================================================
# Local Development Services
# Run these from the root: pnpm docker <cmd>
# =========================================================
start-dev:
	docker compose -f docker-compose.dev.yaml watch

stop-dev:
	docker compose -f docker-compose.dev.yaml down --remove-orphans

build:
	docker compose -f docker-compose.dev.yaml build --no-cache

reset-dev:
	docker compose -f docker-compose.dev.yaml down -v

psql:
	docker exec -it crowdboard-dev_pg psql -U postgres -d crowdboard

caddy-logs:
	docker logs -f crowdboard-dev_caddy


# =======================================================================================================
# Add Caddy Root CA to Mac trust store https://caddyserver.com/docs/running#local-https-with-docker
#.  Delete a CA - sudo security delete-certificate -Z <SHA-1_hash> /Library/Keychains/System.keychain
#   List caddy CAs - security find-certificate -a -c "Caddy" -Z /Library/Keychains/System.keychain
# =======================================================================================================
install-caddy-ca:
	docker compose -f docker-compose.dev.yaml cp caddy:/data/caddy/pki/authorities/local/root.crt /tmp/root.crt && \
	sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain /tmp/root.crt
