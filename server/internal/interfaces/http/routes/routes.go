package routes

import (
	"whisper-server/internal/application/usecases"
	"whisper-server/internal/infrastructure/config"
	"whisper-server/internal/infrastructure/database"
	"whisper-server/internal/infrastructure/repositories"
	"whisper-server/internal/infrastructure/services"
	"whisper-server/internal/interfaces/http/handlers"
	"whisper-server/internal/interfaces/http/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine, db *database.MongoDB, cfg *config.Config) {
	// CORS for browser clients without external dependency
	router.Use(middleware.CORSMiddleware())
	// Initialize services
	jwtService := services.NewJWTService(cfg)
	passwordService := services.NewPasswordService()

	// Initialize repositories
	userRepo := repositories.NewUserRepository(db)
	relationshipRepo := repositories.NewRelationshipRepository(db)
	inviteRepo := repositories.NewInviteRepository(db)
	eventRepo := repositories.NewEventRepository(db)
	whisperRepo := repositories.NewWhisperRepository(db)

	// Initialize use cases
	authUseCase := usecases.NewAuthUseCase(userRepo, jwtService, passwordService)
	relationshipUseCase := usecases.NewRelationshipUseCase(relationshipRepo, userRepo, inviteRepo)
	eventUseCase := usecases.NewEventUseCase(eventRepo, relationshipRepo)
	whisperUsecase := usecases.NewWhisperUseCase(whisperRepo, relationshipRepo, eventRepo)
	userUseCase := usecases.NewUserUseCase(userRepo)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authUseCase)
	relationshipHandler := handlers.NewRelationshipHandler(relationshipUseCase)
	eventHandler := handlers.NewEventHandler(eventUseCase)
	whisperHandler := handlers.NewWhisperHandler(whisperUsecase)
	userHandler := handlers.NewUserHandler(userUseCase)

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "healthy",
			"service": "Whisper API",
			"version": cfg.App.Version,
		})
	})

	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		// Auth routes
		authRoutes := v1.Group("/auth")
		{
			authRoutes.POST("/register", authHandler.Register)
			authRoutes.POST("/login", authHandler.Login)
			authRoutes.POST("/refresh", authHandler.RefreshToken)
		}

		// Protected group
		protected := v1.Group("")
		protected.Use(middleware.AuthMiddleware(jwtService))
		{
			// Events routes
			eventRoutes := protected.Group("/events")
			{
				// Support both with and without trailing slash to avoid 301/307 redirects (CORS issues)
				eventRoutes.POST("/", eventHandler.RegisterEvent)
				eventRoutes.POST("", eventHandler.RegisterEvent)
				eventRoutes.GET("/:id", eventHandler.GetEventByID)
				eventRoutes.PUT("/:id", eventHandler.UpdateEventByID)
				eventRoutes.DELETE("/:id", eventHandler.DeleteEventByID)
				eventRoutes.GET("/", eventHandler.GetAllEventsByUserID)
				eventRoutes.GET("", eventHandler.GetAllEventsByUserID)
			}

			// Whispers routes (protected)
			whisperRoutes := protected.Group("/whispers")
			{
				// Support both with and without trailing slash
				whisperRoutes.GET("/", whisperHandler.List)
				whisperRoutes.GET("", whisperHandler.List)
				whisperRoutes.POST("/", whisperHandler.Create)
				whisperRoutes.POST("", whisperHandler.Create)
				whisperRoutes.PUT(":id", whisperHandler.Update)
				whisperRoutes.DELETE(":id", whisperHandler.Delete)
				whisperRoutes.POST(":id/convert", whisperHandler.ConvertToEvent)
			}
		}

		// User routes (protected)
		userRoutes := protected.Group("/users")
		{
			userRoutes.GET("/profile", userHandler.GetProfile)
			userRoutes.PUT("/profile", userHandler.UpdateProfile)
			userRoutes.PUT("/settings", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Settings not implemented yet"})
			})
		}

		// Relationship routes (protected)
		relationshipRoutes := v1.Group("/relationships")
		relationshipRoutes.Use(middleware.AuthMiddleware(jwtService))
		{
			relationshipRoutes.POST("/invite", relationshipHandler.GenerateInvite)
			relationshipRoutes.POST("/join", relationshipHandler.Join)
			relationshipRoutes.GET("/current", relationshipHandler.Current)
			relationshipRoutes.DELETE("/disconnect", relationshipHandler.Disconnect)
		}

		// Todos routes
		todoRoutes := v1.Group("/todos")
		{
			todoRoutes.GET("/", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
			todoRoutes.POST("/", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
			todoRoutes.PUT("/:id/complete", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
			todoRoutes.DELETE("/:id", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
		}

		// Public events (explore) routes
		exploreRoutes := v1.Group("/explore")
		{
			exploreRoutes.GET("/events", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
			exploreRoutes.GET("/events/:id", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
		}

		// Statistics routes
		statsRoutes := v1.Group("/stats")
		{
			statsRoutes.GET("/relationship", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
		}
	}
}
