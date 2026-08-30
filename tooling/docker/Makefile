# =========================================================
# Local Development Services
# Run these from the root: pnpm d <cmd>
# =========================================================
start:
	docker compose -f compose.dev.yaml watch

stop:
	docker compose -f compose.dev.yaml down --remove-orphans

rebuild:
	docker compose -f compose.dev.yaml build --no-cache

logs:
	docker logs -f crowdboard-dev_$(SERVICE)

connect-pg:
	docker exec -it crowdboard-dev_pg psql -U postgres -d crowdboard



# =======================================================================================================
# Add Caddy Root CA to Mac trust store https://caddyserver.com/docs/running#local-https-with-docker
#   List caddy CA - security find-certificate -a -c "Caddy" -Z /Library/Keychains/System.keychain
#   Delete a CA   - security delete-certificate -Z <SHA-1_hash> /Library/Keychains/System.keychain
# =======================================================================================================
install-caddy-ca:
	docker compose -f compose.dev.yaml cp caddy:/data/caddy/pki/authorities/local/root.crt /tmp/root.crt && \
	sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain /tmp/root.crt

# Remove anonymous volumes
prune-volumes:
	docker volume prune
