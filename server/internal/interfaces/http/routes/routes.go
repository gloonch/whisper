package routes

import (
	"whisper-server/internal/infrastructure/config"
	"whisper-server/internal/infrastructure/database"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine, db *database.MongoDB, cfg *config.Config) {
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
			authRoutes.POST("/register", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
			authRoutes.POST("/login", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
			authRoutes.POST("/refresh", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
		}

		// User routes
		userRoutes := v1.Group("/users")
		{
			userRoutes.GET("/profile", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
			userRoutes.PUT("/profile", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
			userRoutes.PUT("/settings", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
		}

		// Relationship routes
		relationshipRoutes := v1.Group("/relationships")
		{
			relationshipRoutes.POST("/invite", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
			relationshipRoutes.POST("/join", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
			relationshipRoutes.GET("/current", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
			relationshipRoutes.DELETE("/disconnect", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
		}

		// Events routes
		eventRoutes := v1.Group("/events")
		{
			eventRoutes.GET("/", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
			eventRoutes.POST("/", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
			eventRoutes.GET("/:id", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
			eventRoutes.PUT("/:id", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
			eventRoutes.DELETE("/:id", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
			eventRoutes.PUT("/:id/visibility", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
		}

		// Whispers routes
		whisperRoutes := v1.Group("/whispers")
		{
			whisperRoutes.GET("/", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
			whisperRoutes.POST("/", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
			whisperRoutes.PUT("/:id/done", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
			whisperRoutes.DELETE("/:id", func(c *gin.Context) {
				c.JSON(501, gin.H{"message": "Not implemented yet"})
			})
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
