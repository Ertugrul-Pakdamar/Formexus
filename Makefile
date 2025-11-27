.PHONY: help install dev prod stop clean logs status test backup restore tunnel-setup tunnel-start tunnel-stop deploy update health

# Colors for output
CYAN := \033[0;36m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

##@ General

help: ## Display this help message
	@echo "$(CYAN)Formexus - Form Builder Platform$(NC)"
	@echo "$(CYAN)================================$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "Usage: make $(CYAN)<target>$(NC)\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(CYAN)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development

install: ## Install all dependencies
	@echo "$(GREEN)Installing dependencies...$(NC)"
	@cd backend && go mod download
	@cd frontend && npm install
	@echo "$(GREEN)✓ Dependencies installed$(NC)"

dev: ## Start development environment
	@echo "$(GREEN)Starting development environment...$(NC)"
	@docker compose up -d mongodb
	@echo "$(YELLOW)Waiting for MongoDB...$(NC)"
	@sleep 5
	@echo "$(GREEN)MongoDB ready!$(NC)"
	@echo "$(YELLOW)Start backend: cd backend && make run$(NC)"
	@echo "$(YELLOW)Start frontend: cd frontend && npm run dev$(NC)"

dev-full: ## Start full dev environment in Docker
	@echo "$(GREEN)Starting full development stack...$(NC)"
	@docker compose up -d
	@$(MAKE) logs

##@ Production

prod: ## Start production environment
	@echo "$(GREEN)Starting production environment...$(NC)"
	@docker compose up -d
	@echo "$(YELLOW)Waiting for services to start...$(NC)"
	@sleep 10
	@$(MAKE) status
	@echo "$(GREEN)✓ Production environment started$(NC)"
	@echo "$(CYAN)Frontend: http://localhost:3000$(NC)"
	@echo "$(CYAN)Backend: http://localhost:8080$(NC)"
	@echo "$(CYAN)Health check: make health$(NC)"

build: ## Build all Docker images
	@echo "$(GREEN)Building Docker images...$(NC)"
	@docker compose build
	@echo "$(GREEN)✓ Images built successfully$(NC)"

rebuild: ## Rebuild and restart all services
	@echo "$(GREEN)Rebuilding services...$(NC)"
	@docker compose up -d --build
	@echo "$(GREEN)✓ Services rebuilt and restarted$(NC)"

##@ Service Management

start: ## Start all services
	@echo "$(GREEN)Starting services...$(NC)"
	@docker compose start
	@echo "$(GREEN)✓ Services started$(NC)"

stop: ## Stop all services
	@echo "$(YELLOW)Stopping services...$(NC)"
	@docker compose stop
	@echo "$(GREEN)✓ Services stopped$(NC)"

restart: ## Restart all services
	@echo "$(YELLOW)Restarting services...$(NC)"
	@docker compose restart
	@echo "$(GREEN)✓ Services restarted$(NC)"

down: ## Stop and remove all containers
	@echo "$(RED)Stopping and removing containers...$(NC)"
	@docker compose down
	@echo "$(GREEN)✓ Containers removed$(NC)"

clean: ## Remove all containers, volumes, and images
	@echo "$(RED)WARNING: This will remove all data!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo ""; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker compose down -v; \
		docker system prune -f; \
		echo "$(GREEN)✓ Cleaned up$(NC)"; \
	else \
		echo "$(YELLOW)Cancelled$(NC)"; \
	fi

##@ Monitoring

status: ## Show status of all services
	@echo "$(CYAN)Service Status:$(NC)"
	@docker compose ps

logs: ## Show logs from all services
	@docker compose logs -f

logs-backend: ## Show backend logs
	@docker compose logs -f backend

logs-frontend: ## Show frontend logs
	@docker compose logs -f frontend

logs-mongodb: ## Show MongoDB logs
	@docker compose logs -f mongodb

logs-tunnel: ## Show Cloudflare Tunnel logs
	@docker compose logs -f cloudflared

health: ## Check health of all services
	@echo "$(CYAN)Health Check:$(NC)"
	@echo "$(YELLOW)Backend:$(NC)"
	@curl -s http://localhost:8080/health || echo "$(RED)✗ Backend not responding$(NC)"
	@echo ""
	@echo "$(YELLOW)Frontend:$(NC)"
	@curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:3000 || echo "$(RED)✗ Frontend not responding$(NC)"
	@echo ""
	@echo "$(YELLOW)MongoDB:$(NC)"
	@docker exec formexus-mongodb mongosh --quiet --eval "db.adminCommand('ping')" || echo "$(RED)✗ MongoDB not responding$(NC)"

##@ Cloudflare Tunnel

tunnel-setup: ## Setup Cloudflare Tunnel (first time)
	@echo "$(CYAN)Cloudflare Tunnel Setup$(NC)"
	@echo "$(YELLOW)1. Login to Cloudflare$(NC)"
	@cloudflared tunnel login || (echo "$(RED)✗ Install cloudflared first$(NC)" && exit 1)
	@echo ""
	@echo "$(YELLOW)2. Creating tunnel...$(NC)"
	@read -p "Enter tunnel name (default: formexus-tunnel): " tunnel_name; \
	tunnel_name=$${tunnel_name:-formexus-tunnel}; \
	cloudflared tunnel create $$tunnel_name; \
	echo "$(GREEN)✓ Tunnel created$(NC)"; \
	echo ""
	@echo "$(YELLOW)3. Update cloudflare-tunnel/config.yml with your tunnel ID$(NC)"
	@echo "$(YELLOW)4. Copy credentials: cp ~/.cloudflared/TUNNEL_ID.json cloudflare-tunnel/cert.json$(NC)"
	@echo "$(YELLOW)5. Setup DNS: make tunnel-dns$(NC)"

tunnel-dns: ## Setup DNS routes for tunnel
	@echo "$(CYAN)Setting up DNS routes...$(NC)"
	@read -p "Enter tunnel ID: " tunnel_id; \
	read -p "Enter domain (e.g., formexus.net): " domain; \
	cloudflared tunnel route dns $$tunnel_id $$domain; \
	cloudflared tunnel route dns $$tunnel_id www.$$domain; \
	echo "$(GREEN)✓ DNS routes configured$(NC)"

tunnel-start: ## Start Cloudflare Tunnel
	@echo "$(GREEN)Starting Cloudflare Tunnel...$(NC)"
	@docker compose up -d cloudflared
	@sleep 3
	@$(MAKE) logs-tunnel

tunnel-stop: ## Stop Cloudflare Tunnel
	@echo "$(YELLOW)Stopping Cloudflare Tunnel...$(NC)"
	@docker compose stop cloudflared
	@echo "$(GREEN)✓ Tunnel stopped$(NC)"

tunnel-restart: ## Restart Cloudflare Tunnel
	@echo "$(YELLOW)Restarting Cloudflare Tunnel...$(NC)"
	@docker compose restart cloudflared
	@sleep 3
	@$(MAKE) logs-tunnel

##@ Deployment

deploy: ## Deploy to production (Raspberry Pi)
	@echo "$(CYAN)Deploying to Raspberry Pi...$(NC)"
	@read -p "Enter Raspberry Pi IP (default: 192.168.1.104): " pi_ip; \
	pi_ip=$${pi_ip:-192.168.1.104}; \
	read -p "Enter username (default: epakdama): " pi_user; \
	pi_user=$${pi_user:-epakdama}; \
	echo "$(YELLOW)Syncing files...$(NC)"; \
	rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'mongodb' \
		./ $$pi_user@$$pi_ip:~/Formexus/; \
	echo "$(YELLOW)Deploying on Pi...$(NC)"; \
	ssh $$pi_user@$$pi_ip 'cd ~/Formexus && docker compose up -d --build'; \
	echo "$(GREEN)✓ Deployment complete$(NC)"

deploy-quick: ## Quick deploy (no rebuild)
	@echo "$(CYAN)Quick deploy to Raspberry Pi...$(NC)"
	@read -p "Enter Raspberry Pi IP (default: 192.168.1.104): " pi_ip; \
	pi_ip=$${pi_ip:-192.168.1.104}; \
	read -p "Enter username (default: epakdama): " pi_user; \
	pi_user=$${pi_user:-epakdama}; \
	rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'mongodb' \
		./ $$pi_user@$$pi_ip:~/Formexus/; \
	ssh $$pi_user@$$pi_ip 'cd ~/Formexus && docker compose restart'; \
	echo "$(GREEN)✓ Quick deploy complete$(NC)"

update: ## Update and restart services
	@echo "$(GREEN)Updating services...$(NC)"
	@git pull
	@docker compose pull
	@docker compose up -d --build
	@echo "$(GREEN)✓ Services updated$(NC)"

##@ Database

db-backup: ## Backup MongoDB database
	@echo "$(GREEN)Backing up MongoDB...$(NC)"
	@mkdir -p ./backups
	@docker exec formexus-mongodb mongodump --out /data/backup
	@docker cp formexus-mongodb:/data/backup ./backups/mongodb-$(shell date +%Y%m%d-%H%M%S)
	@echo "$(GREEN)✓ Backup complete: ./backups/mongodb-$(shell date +%Y%m%d-%H%M%S)$(NC)"

db-restore: ## Restore MongoDB database
	@echo "$(YELLOW)Available backups:$(NC)"
	@ls -1 ./backups/
	@read -p "Enter backup folder name: " backup; \
	docker cp ./backups/$$backup formexus-mongodb:/data/restore; \
	docker exec formexus-mongodb mongorestore /data/restore; \
	echo "$(GREEN)✓ Database restored$(NC)"

db-shell: ## Open MongoDB shell
	@docker exec -it formexus-mongodb mongosh

##@ Systemd Service (Raspberry Pi)

service-install: ## Install systemd service for auto-start
	@echo "$(GREEN)Installing systemd service...$(NC)"
	@chmod +x install-service.sh
	@./install-service.sh
	@echo "$(GREEN)✓ Service installed$(NC)"

service-status: ## Check systemd service status
	@sudo systemctl status formexus

service-enable: ## Enable auto-start on boot
	@sudo systemctl enable formexus
	@echo "$(GREEN)✓ Auto-start enabled$(NC)"

service-disable: ## Disable auto-start on boot
	@sudo systemctl disable formexus
	@echo "$(YELLOW)Auto-start disabled$(NC)"

service-logs: ## View systemd service logs
	@sudo journalctl -u formexus -f

##@ Testing

test-backend: ## Test backend
	@echo "$(GREEN)Testing backend...$(NC)"
	@cd backend && go test ./...

test-frontend: ## Test frontend
	@echo "$(GREEN)Testing frontend...$(NC)"
	@cd frontend && npm test

test-e2e: ## Run end-to-end tests
	@echo "$(GREEN)Running E2E tests...$(NC)"
	@curl -s http://localhost:8080/health
	@curl -s http://localhost:3000

##@ Utilities

shell-backend: ## Open shell in backend container
	@docker exec -it formexus-backend sh

shell-frontend: ## Open shell in frontend container
	@docker exec -it formexus-frontend sh

shell-db: ## Open shell in MongoDB container
	@docker exec -it formexus-mongodb bash

env-setup: ## Setup .env file from example
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "$(YELLOW).env file created. Please update with your values$(NC)"; \
		echo "$(CYAN)Generate JWT secret: openssl rand -base64 32$(NC)"; \
	else \
		echo "$(YELLOW).env file already exists$(NC)"; \
	fi

env-check: ## Validate .env configuration
	@echo "$(CYAN)Checking environment configuration...$(NC)"
	@if [ -f .env ]; then \
		echo "$(GREEN)✓ .env file exists$(NC)"; \
		grep -q "MONGO_ROOT_PASSWORD" .env && echo "$(GREEN)✓ MongoDB password set$(NC)" || echo "$(RED)✗ MongoDB password missing$(NC)"; \
		grep -q "JWT_SECRET" .env && echo "$(GREEN)✓ JWT secret set$(NC)" || echo "$(RED)✗ JWT secret missing$(NC)"; \
		grep -q "FRONTEND_URL" .env && echo "$(GREEN)✓ Frontend URL set$(NC)" || echo "$(RED)✗ Frontend URL missing$(NC)"; \
	else \
		echo "$(RED)✗ .env file not found$(NC)"; \
		echo "$(YELLOW)Run: make env-setup$(NC)"; \
	fi

stats: ## Show Docker resource usage
	@docker stats --no-stream

prune: ## Clean up unused Docker resources
	@echo "$(YELLOW)Cleaning up Docker resources...$(NC)"
	@docker system prune -f
	@echo "$(GREEN)✓ Cleanup complete$(NC)"

##@ Quick Commands

quick-start: env-setup build prod ## Quick start (setup + build + run)
	@echo "$(GREEN)✓ Formexus is running!$(NC)"
	@echo "$(CYAN)Frontend: http://localhost:3000$(NC)"
	@echo "$(CYAN)Backend: http://localhost:8080$(NC)"

quick-dev: env-setup install dev ## Quick dev setup
	@echo "$(GREEN)✓ Development environment ready!$(NC)"

quick-deploy: ## One-command deploy to Pi
	@$(MAKE) deploy
	@$(MAKE) tunnel-restart

##@ Information

info: ## Show system information
	@echo "$(CYAN)System Information:$(NC)"
	@echo "$(YELLOW)Docker Version:$(NC)"
	@docker --version
	@echo "$(YELLOW)Docker Compose Version:$(NC)"
	@docker compose version
	@echo "$(YELLOW)Node Version:$(NC)"
	@node --version 2>/dev/null || echo "Not installed"
	@echo "$(YELLOW)Go Version:$(NC)"
	@go version 2>/dev/null || echo "Not installed"
	@echo "$(YELLOW)Cloudflared Version:$(NC)"
	@cloudflared --version 2>/dev/null || echo "Not installed"

version: ## Show Formexus version
	@echo "$(CYAN)Formexus v1.0.0$(NC)"
	@echo "$(YELLOW)Form Builder Platform$(NC)"
	@git log -1 --pretty=format:"Latest commit: %h - %s (%ar)" || echo "Not a git repository"
