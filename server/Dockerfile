# 🏗️ Build stage - استفاده از Alpine برای سبکی
FROM golang:1.23-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git ca-certificates tzdata

# Set working directory  
WORKDIR /app

# Copy go mod files first for better layer caching
COPY go.mod go.sum ./

# Download dependencies (این layer cache می‌شود)
RUN go mod download

# Copy source code
COPY . .

# Build the application with optimizations
# CGO_ENABLED=0 برای static binary
# -ldflags="-w -s" برای کاهش سایز binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags="-w -s -X main.version=$(date +%Y%m%d-%H%M%S)" \
    -a -installsuffix cgo \
    -o main ./cmd/api

# 🚀 Production stage - استفاده از scratch برای کمترین سایز
FROM scratch AS production

# Copy timezone data
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo

# Copy SSL certificates for HTTPS requests
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Copy binary from builder
COPY --from=builder /app/main /main

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD ["/main", "health"] || exit 1

# Run the application
ENTRYPOINT ["/main"] 