# 🐳 Docker Setup Guide for Whisper

این راهنما نحوه راه‌اندازی پروژه Whisper با Docker را به صورت کامل توضیح می‌دهد.

## 📁 ساختار فایل‌ها

```
whisper/
├── docker-compose.yml          # Main compose file
├── scripts/
│   └── mongo-init.js          # MongoDB initialization
├── server/
│   ├── Dockerfile             # Go application Dockerfile  
│   ├── .dockerignore          # Docker ignore rules
│   └── .env.example           # Environment template
└── client/                    # Frontend (آینده)
```

## 🚀 راه‌اندازی سریع

### 1. Clone و Setup
```bash
# Clone repository
git clone <repository-url>
cd whisper

# Create environment file
cp server/.env.example server/.env
# Edit server/.env and set your configurations
```

### 2. Build و Run
```bash
# Build و start تمام services
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f whisper-api
```

### 3. Test API
```bash
# Health check
curl http://localhost:8080/health

# با Postman Collection test کنید
```

## 🛠️ دستورات مفید Docker

### Development Commands
```bash
# Start in development mode with Mongo Express
docker-compose --profile dev up -d

# Start only specific services
docker-compose up mongodb whisper-api -d

# Rebuild specific service
docker-compose build whisper-api
docker-compose up whisper-api -d
```

### Monitoring Commands
```bash
# View all logs
docker-compose logs

# Follow logs for specific service
docker-compose logs -f whisper-api
docker-compose logs -f mongodb

# Container stats
docker stats

# Service status
docker-compose ps
```

### Database Management
```bash
# Connect to MongoDB container
docker-compose exec mongodb mongosh -u whisper_admin -p whisper_secure_password_2024 --authenticationDatabase admin

# Backup database
docker-compose exec mongodb mongodump --uri="mongodb://whisper_admin:whisper_secure_password_2024@localhost:27017/whisper_db?authSource=admin" --out=/backup

# Restore database
docker-compose exec mongodb mongorestore --uri="mongodb://whisper_admin:whisper_secure_password_2024@localhost:27017/whisper_db?authSource=admin" /backup/whisper_db
```

### Cleanup Commands
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ Data will be lost!)
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Complete cleanup
docker system prune -a
```

## 🌍 Environment Variables

### Required Variables (در server/.env):
```bash
# Application
APP_NAME="Whisper Server"
ENVIRONMENT="production"  # development/production
PORT="8080"

# Database  
MONGODB_URI="mongodb://whisper_admin:whisper_secure_password_2024@mongodb:27017/whisper_db?authSource=admin"
MONGODB_NAME="whisper_db"

# JWT (⚠️ Change in production!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

## 🔧 Services Overview

### 📊 whisper-api (Go Application)
- **Port**: 8080
- **Health**: http://localhost:8080/health
- **Dependencies**: MongoDB
- **Restart**: unless-stopped

### 🗄️ mongodb (Database)
- **Port**: 27017
- **Username**: whisper_admin
- **Password**: whisper_secure_password_2024
- **Database**: whisper_db
- **Volume**: `mongodb_data` (persistent)

### 🔍 mongo-express (Database UI - Development Only)
- **Port**: 8081 
- **Username**: admin
- **Password**: admin123
- **Profile**: dev/development only
- **URL**: http://localhost:8081

## 🎯 بهینه‌سازی‌های اعمال شده

### 🏗️ Multi-Stage Dockerfile
```dockerfile
# Stage 1: Build (golang:1.21-alpine)
- Dependency caching with go.mod/go.sum
- Compilation with size optimization (-ldflags="-w -s")
- Static binary creation (CGO_ENABLED=0)

# Stage 2: Production (scratch)
- Minimal image size (~10MB total)
- Only essential files copied
- SSL certificates included
- Timezone data available
```

### 🚀 Performance Optimizations
- **Build Context**: .dockerignore excludes unnecessary files
- **Layer Caching**: Dependencies downloaded before source copy
- **Static Binary**: No runtime dependencies
- **Health Checks**: Automatic container health monitoring
- **Indexes**: Database indexes for optimal query performance

### 💾 Data Persistence
- **MongoDB Data**: `mongodb_data` volume
- **MongoDB Config**: `mongodb_config` volume
- **Automatic Backups**: Through volume snapshots

### 🔒 Security Features
- **Non-root User**: Containers run as non-privileged users
- **Network Isolation**: Custom bridge network
- **Authentication**: MongoDB with user authentication
- **Environment Isolation**: Separate environments for dev/prod

## 🌟 Production Considerations

### Environment Setup
```bash
# Create production environment file
cp server/.env.example server/.env.prod

# Update production values
ENVIRONMENT="production"
GIN_MODE="release"
JWT_SECRET="$(openssl rand -base64 32)"
MONGODB_URI="mongodb://secure_user:secure_password@mongodb:27017/whisper_db?authSource=admin"
```

### Security Hardening
```bash
# Use secrets instead of environment variables
docker swarm init
echo "strong_jwt_secret" | docker secret create jwt_secret -
echo "secure_db_password" | docker secret create db_password -
```

### Monitoring
```bash
# Add monitoring stack
docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d
```

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
- name: Build and Push Docker Image
  run: |
    docker build -t whisper-api:${{ github.sha }} ./server
    docker tag whisper-api:${{ github.sha }} whisper-api:latest
```

### Deployment
```bash
# Production deployment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🆘 Troubleshooting

### Common Issues

#### 🔴 MongoDB Connection Failed
```bash
# Check MongoDB status
docker-compose logs mongodb

# Verify network connectivity
docker-compose exec whisper-api ping mongodb

# Check authentication
docker-compose exec mongodb mongosh -u whisper_admin -p whisper_secure_password_2024 --authenticationDatabase admin
```

#### 🔴 Go Application Won't Start
```bash
# Check build logs
docker-compose logs whisper-api

# Rebuild with no cache
docker-compose build --no-cache whisper-api

# Check environment variables
docker-compose exec whisper-api env
```

#### 🔴 Port Already in Use
```bash
# Check what's using the port
lsof -i :8080
lsof -i :27017

# Change ports in docker-compose.yml
ports:
  - "8081:8080"  # Change host port
```

#### 🔴 Volume Permission Issues
```bash
# Fix volume permissions
docker-compose down
docker volume rm whisper_mongodb_data
docker-compose up -d
```

## 📈 Scaling

### Horizontal Scaling
```bash
# Scale API service
docker-compose up --scale whisper-api=3

# Load balancer needed for multiple instances
```

### Resource Limits
```yaml
# Add to docker-compose.yml
services:
  whisper-api:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.1'
          memory: 128M
```

---

## 🎉 شما آماده‌اید!

Docker setup شما کامل است. با دستورات بالا می‌توانید:
- ✅ Development environment راه‌اندازی کنید
- ✅ Production deployment انجام دهید  
- ✅ Database را مدیریت کنید
- ✅ Monitoring و troubleshooting کنید
- ✅ در آینده frontend را اضافه کنید

Happy Dockerizing! 🐳🚀 