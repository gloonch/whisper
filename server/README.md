# Whisper Server 💕

Backend API for Whisper - A relationship timeline application built with Go, Gin, and MongoDB using Domain-Driven Design (DDD) architecture.

## 🏗️ Architecture

This project follows **Domain-Driven Design (DDD)** principles with clean architecture:

```
server/
├── cmd/api/                 # Application entry points
├── internal/
│   ├── domain/             # Domain layer (business logic)
│   │   ├── entities/       # Domain entities
│   │   ├── repositories/   # Repository interfaces
│   │   └── services/       # Domain services
│   ├── application/        # Application layer
│   │   ├── usecases/       # Use cases (application logic)
│   │   └── dto/            # Data Transfer Objects
│   ├── infrastructure/     # Infrastructure layer
│   │   ├── database/       # Database implementations
│   │   ├── config/         # Configuration
│   │   └── external/       # External services
│   └── interfaces/         # Interface layer
│       └── http/          # HTTP handlers, middleware, routes
├── pkg/                    # Public libraries
├── configs/                # Configuration files
└── docs/                   # Documentation
```

## 🚀 Features

### Core Functionality
- 👥 **User Management** - Registration, authentication, profiles
- 💕 **Relationship System** - Partner invites, shared timelines
- 🎉 **Events Timeline** - Create, edit, share relationship memories
- 🌟 **Whispers** - Daily reminders and shared activities
- ✅ **Todo System** - Task management with event conversion
- 🌍 **Public Explore** - Discover and share event ideas

### Technical Features
- 🔐 **JWT Authentication** - Secure token-based auth
- 📊 **MongoDB Integration** - Optimized database with indexes
- 🔄 **RESTful API** - Clean, documented endpoints
- 🛡️ **Input Validation** - Comprehensive request validation
- ⚡ **Performance** - Efficient queries and caching
- 🔍 **Monitoring** - Health checks and logging

## 🛠️ Tech Stack

- **Language**: Go 1.21+
- **Framework**: Gin Web Framework
- **Database**: MongoDB
- **Authentication**: JWT
- **Validation**: go-playground/validator
- **Configuration**: Environment variables

## 📦 Installation

### Prerequisites
- Go 1.21+
- MongoDB 5.0+
- Git

### Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd whisper/server
```

2. **Install dependencies:**
```bash
go mod download
```

3. **Environment configuration:**
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your settings
# Required: MONGODB_URI, JWT_SECRET
```

4. **Run the application:**
```bash
# Development
go run cmd/api/main.go

# Build and run
go build -o bin/server cmd/api/main.go
./bin/server
```

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_NAME` | Whisper Server | Application name |
| `ENVIRONMENT` | development | Environment (development/production) |
| `PORT` | 8080 | Server port |
| `MONGODB_URI` | mongodb://localhost:27017 | MongoDB connection string |
| `MONGODB_NAME` | whisper_db | Database name |
| `JWT_SECRET` | - | JWT signing secret (required) |
| `JWT_ACCESS_TTL` | 24 | Access token TTL (hours) |
| `JWT_REFRESH_TTL` | 720 | Refresh token TTL (hours) |

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh tokens

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update profile
- `PUT /api/v1/users/settings` - Update settings

### Relationships
- `POST /api/v1/relationships/invite` - Generate invite code
- `POST /api/v1/relationships/join` - Join with invite code
- `GET /api/v1/relationships/current` - Get current relationship
- `DELETE /api/v1/relationships/disconnect` - Disconnect relationship

### Events
- `GET /api/v1/events` - List events
- `POST /api/v1/events` - Create event
- `GET /api/v1/events/:id` - Get event details
- `PUT /api/v1/events/:id` - Update event
- `DELETE /api/v1/events/:id` - Delete event
- `PUT /api/v1/events/:id/visibility` - Toggle public/private

### Whispers
- `GET /api/v1/whispers` - List whispers
- `POST /api/v1/whispers` - Create whisper
- `PUT /api/v1/whispers/:id/done` - Mark whisper as done
- `DELETE /api/v1/whispers/:id` - Delete whisper

### Todos
- `GET /api/v1/todos` - List todos
- `POST /api/v1/todos` - Create todo
- `PUT /api/v1/todos/:id/complete` - Complete todo
- `DELETE /api/v1/todos/:id` - Delete todo

### Explore
- `GET /api/v1/explore/events` - Browse public events
- `GET /api/v1/explore/events/:id` - Get public event details

### Health Check
- `GET /health` - Server health status

## 🗃️ Database Schema

### Collections
- **users** - User profiles and settings
- **relationships** - Partner connections
- **events** - Timeline events
- **whispers** - Daily reminders
- **todos** - Task management
- **public_events** - Shared event ideas
- **invite_codes** - Active invitation codes
- **event_types** - Event type definitions
- **whisper_types** - Whisper type definitions

### Indexes
Optimized indexes for:
- User lookups (username, email)
- Relationship queries
- Event timeline queries
- Date-based queries
- Public event browsing

## 🏃‍♂️ Development

### Running Tests
```bash
go test ./...
```

### Code Formatting
```bash
go fmt ./...
```

### Building
```bash
# Development build
go build -o bin/server cmd/api/main.go

# Production build
CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o bin/server cmd/api/main.go
```

## 🚀 Deployment

### Docker (Coming Soon)
```bash
docker build -t whisper-server .
docker run -p 8080:8080 whisper-server
```

### Production Checklist
- [ ] Set `ENVIRONMENT=production`
- [ ] Generate secure `JWT_SECRET`
- [ ] Configure MongoDB replica set
- [ ] Set up SSL/TLS certificates
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 📞 Support

For questions and support, please contact the development team.

---

Built with ❤️ using Go and Domain-Driven Design 