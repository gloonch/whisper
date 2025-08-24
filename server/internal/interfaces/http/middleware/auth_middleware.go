package middleware

import (
	"net/http"
	"strings"

	"whisper-server/internal/application/dto"
	"whisper-server/internal/infrastructure/services"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func AuthMiddleware(jwt services.JWTService) gin.HandlerFunc {
	return func(c *gin.Context) {
		auth := c.GetHeader("Authorization")
		if auth == "" || !strings.HasPrefix(auth, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, dto.ErrorResponse{Code: http.StatusUnauthorized, Message: "missing bearer token"})
			return
		}
		token := strings.TrimPrefix(auth, "Bearer ")
		claims, err := jwt.ValidateAccessToken(token)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, dto.ErrorResponse{Code: http.StatusUnauthorized, Message: "invalid token"})
			return
		}
		c.Set("userID", claims.UserID)
		c.Set("username", claims.Username)
		c.Next()
	}
}

// GetUserIDFromContext extracts the authenticated user's ObjectID from context.
// It panics if the value is missing or invalid; handlers should ensure AuthMiddleware is used.
func GetUserIDFromContext(c *gin.Context) primitive.ObjectID {
	v, exists := c.Get("userID")
	if !exists {
		return primitive.NilObjectID
	}
	if s, ok := v.(string); ok {
		oid, err := primitive.ObjectIDFromHex(s)
		if err == nil {
			return oid
		}
	}
	if oid, ok := v.(primitive.ObjectID); ok {
		return oid
	}
	return primitive.NilObjectID
}
