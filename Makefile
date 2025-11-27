.PHONY: help up down restart logs status clean

help:
	@echo "Formexus - Form Builder"
	@echo ""
	@echo "Commands:"
	@echo "  make up       - Start all services"
	@echo "  make down     - Stop all services"
	@echo "  make restart  - Restart all services"
	@echo "  make logs     - Show logs"
	@echo "  make status   - Show service status"
	@echo "  make clean    - Clean everything"

up:
	@docker compose up -d --build

down:
	@docker compose down

restart:
	@docker compose restart

logs:
	@docker compose logs -f

status:
	@docker compose ps

clean:
	@docker compose down -v
	@docker system prune -f
