# Whisper Server Makefile

# Variables
BINARY_NAME=server
MAIN_PATH=cmd/api/main.go
BUILD_DIR=bin

# Colors for output
CYAN=\033[36m
GREEN=\033[32m
YELLOW=\033[33m
RED=\033[31m
NC=\033[0m # No Color

.PHONY: help build run clean test lint fmt deps dev hot check

# Default target
help: ## Show this help message
	@echo "$(CYAN)Whisper Server - Available commands:$(NC)"
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ {printf "$(GREEN)  %-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Development
dev: ## Run the server in development mode
	@echo "$(CYAN)🚀 Starting development server...$(NC)"
	@go run $(MAIN_PATH)

hot: ## Run with hot reload (requires air)
	@echo "$(CYAN)🔥 Starting with hot reload...$(NC)"
	@if command -v air > /dev/null; then \
		air; \
	else \
		echo "$(RED)❌ Air not found. Install with: go install github.com/cosmtrek/air@latest$(NC)"; \
		echo "$(YELLOW)💡 Running without hot reload...$(NC)"; \
		go run $(MAIN_PATH); \
	fi

# Build
build: ## Build the server binary
	@echo "$(CYAN)🔨 Building server...$(NC)"
	@mkdir -p $(BUILD_DIR)
	@go build -o $(BUILD_DIR)/$(BINARY_NAME) $(MAIN_PATH)
	@echo "$(GREEN)✅ Build complete: $(BUILD_DIR)/$(BINARY_NAME)$(NC)"

build-linux: ## Build for Linux
	@echo "$(CYAN)🔨 Building for Linux...$(NC)"
	@mkdir -p $(BUILD_DIR)
	@GOOS=linux GOARCH=amd64 go build -o $(BUILD_DIR)/$(BINARY_NAME)-linux $(MAIN_PATH)
	@echo "$(GREEN)✅ Linux build complete: $(BUILD_DIR)/$(BINARY_NAME)-linux$(NC)"

build-prod: ## Build optimized production binary
	@echo "$(CYAN)🔨 Building production binary...$(NC)"
	@mkdir -p $(BUILD_DIR)
	@CGO_ENABLED=0 go build -a -installsuffix cgo -ldflags="-w -s" -o $(BUILD_DIR)/$(BINARY_NAME) $(MAIN_PATH)
	@echo "$(GREEN)✅ Production build complete: $(BUILD_DIR)/$(BINARY_NAME)$(NC)"

# Run
run: build ## Build and run the server
	@echo "$(CYAN)🚀 Running server...$(NC)"
	@./$(BUILD_DIR)/$(BINARY_NAME)

# Testing
test: ## Run all tests
	@echo "$(CYAN)🧪 Running tests...$(NC)"
	@go test -v ./...

test-coverage: ## Run tests with coverage
	@echo "$(CYAN)🧪 Running tests with coverage...$(NC)"
	@go test -v -coverprofile=coverage.out ./...
	@go tool cover -html=coverage.out -o coverage.html
	@echo "$(GREEN)✅ Coverage report generated: coverage.html$(NC)"

test-race: ## Run tests with race detection
	@echo "$(CYAN)🧪 Running tests with race detection...$(NC)"
	@go test -race -v ./...

# Code Quality
fmt: ## Format Go code
	@echo "$(CYAN)🎨 Formatting code...$(NC)"
	@go fmt ./...
	@echo "$(GREEN)✅ Code formatted$(NC)"

lint: ## Run linter
	@echo "$(CYAN)🔍 Running linter...$(NC)"
	@if command -v golangci-lint > /dev/null; then \
		golangci-lint run; \
	else \
		echo "$(RED)❌ golangci-lint not found. Install from: https://golangci-lint.run/usage/install/$(NC)"; \
		echo "$(YELLOW)💡 Running go vet instead...$(NC)"; \
		go vet ./...; \
	fi

check: fmt lint test ## Run all checks (format, lint, test)
	@echo "$(GREEN)✅ All checks passed$(NC)"

# Dependencies
deps: ## Download dependencies
	@echo "$(CYAN)📦 Downloading dependencies...$(NC)"
	@go mod download
	@echo "$(GREEN)✅ Dependencies downloaded$(NC)"

deps-update: ## Update dependencies
	@echo "$(CYAN)📦 Updating dependencies...$(NC)"
	@go get -u ./...
	@go mod tidy
	@echo "$(GREEN)✅ Dependencies updated$(NC)"

deps-vendor: ## Create vendor directory
	@echo "$(CYAN)📦 Creating vendor directory...$(NC)"
	@go mod vendor
	@echo "$(GREEN)✅ Vendor directory created$(NC)"

# Cleanup
clean: ## Clean build artifacts
	@echo "$(CYAN)🧹 Cleaning build artifacts...$(NC)"
	@rm -rf $(BUILD_DIR)
	@rm -f coverage.out coverage.html
	@echo "$(GREEN)✅ Cleaned$(NC)"

# Database
db-reset: ## Reset database (requires MongoDB running)
	@echo "$(CYAN)🗃️  Resetting database...$(NC)"
	@mongo whisper_db --eval "db.dropDatabase()"
	@echo "$(GREEN)✅ Database reset$(NC)"

# Docker (when added)
docker-build: ## Build Docker image
	@echo "$(CYAN)🐳 Building Docker image...$(NC)"
	@docker build -t whisper-server .
	@echo "$(GREEN)✅ Docker image built: whisper-server$(NC)"

docker-run: ## Run Docker container
	@echo "$(CYAN)🐳 Running Docker container...$(NC)"
	@docker run -p 8080:8080 whisper-server

# Utilities
install-tools: ## Install development tools
	@echo "$(CYAN)🛠️  Installing development tools...$(NC)"
	@go install github.com/cosmtrek/air@latest
	@echo "$(GREEN)✅ Tools installed$(NC)"

info: ## Show project information
	@echo "$(CYAN)📋 Project Information:$(NC)"
	@echo "$(GREEN)  Name:$(NC)         Whisper Server"
	@echo "$(GREEN)  Language:$(NC)     Go $(shell go version | cut -d' ' -f3)"
	@echo "$(GREEN)  Binary:$(NC)       $(BINARY_NAME)"
	@echo "$(GREEN)  Main Path:$(NC)    $(MAIN_PATH)"
	@echo "$(GREEN)  Build Dir:$(NC)    $(BUILD_DIR)" 