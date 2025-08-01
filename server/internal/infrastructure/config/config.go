package config

import (
	"os"
	"strconv"
)

type Config struct {
	App      AppConfig
	Database DatabaseConfig
	JWT      JWTConfig
}

type AppConfig struct {
	Name        string
	Version     string
	Environment string
	Port        string
	BaseURL     string
}

type DatabaseConfig struct {
	URI            string
	Name           string
	ConnectTimeout int
	MaxPoolSize    uint64
	MinPoolSize    uint64
}

type JWTConfig struct {
	Secret           string // تغییر شده
	AccessExpiresIn  string // تغییر شده
	RefreshExpiresIn string // تغییر شده
}

func Load() *Config {
	return &Config{
		App: AppConfig{
			Name:        getEnv("APP_NAME", "Whisper Server"),
			Version:     getEnv("APP_VERSION", "1.0.0"),
			Environment: getEnv("ENVIRONMENT", "development"),
			Port:        getEnv("PORT", "8080"),
			BaseURL:     getEnv("BASE_URL", "http://localhost:8080"),
		},
		Database: DatabaseConfig{
			URI:            getEnv("MONGODB_URI", "mongodb://localhost:27017"),
			Name:           getEnv("MONGODB_NAME", "whisper_db"),
			ConnectTimeout: getEnvAsInt("MONGODB_CONNECT_TIMEOUT", 30),
			MaxPoolSize:    uint64(getEnvAsInt("MONGODB_MAX_POOL_SIZE", 100)),
			MinPoolSize:    uint64(getEnvAsInt("MONGODB_MIN_POOL_SIZE", 10)),
		},
		JWT: JWTConfig{
			Secret:           getEnv("JWT_SECRET", "your-super-secret-jwt-key-change-in-production"),
			AccessExpiresIn:  getEnv("JWT_ACCESS_EXPIRES_IN", "24h"),   // تغییر شده
			RefreshExpiresIn: getEnv("JWT_REFRESH_EXPIRES_IN", "720h"), // تغییر شده
		},
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	valueStr := getEnv(key, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultValue
}
