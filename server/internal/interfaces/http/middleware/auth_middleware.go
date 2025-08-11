package middleware

import (
	"net/http"
	"strings"

	"whisper-server/internal/application/dto"
	"whisper-server/internal/infrastructure/services"

	"github.com/gin-gonic/gin"
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
