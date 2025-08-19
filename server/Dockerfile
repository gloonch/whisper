# =========================================
# Dev target (hot reload via Air)
# =========================================
FROM golang:1.24 AS dev
WORKDIR /app

# Cache modules
COPY go.mod go.sum ./
RUN go mod download

# Copy source once (we will mount in compose)
COPY . .

# Install Air for hot-reload
RUN go install github.com/air-verse/air@latest

# Expose API port (adjust if different)
EXPOSE 8080

# Run server with Air
CMD ["air", "-c", ".air.toml"]

# =========================================
# Prod target (build binary)
# =========================================
FROM golang:1.24 AS build
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/bin/server ./cmd/api/main.go

FROM gcr.io/distroless/base-debian12 AS prod
WORKDIR /app
COPY --from=build /app/bin/server /server
EXPOSE 8080
CMD ["/server"]
