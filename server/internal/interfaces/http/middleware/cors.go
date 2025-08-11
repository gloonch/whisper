package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// CORSMiddleware provides basic CORS handling without external deps
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
        if origin != "" {
            // Mirror origin for dev, include same-origin when none
            c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Vary", "Origin")
			c.Header("Access-Control-Allow-Credentials", "true")
		}

		c.Header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Authorization, Content-Type")
		c.Header("Access-Control-Expose-Headers", "Content-Length")
		c.Header("Access-Control-Max-Age", "86400")

        if c.Request.Method == http.MethodOptions {
            c.Status(http.StatusNoContent)
            c.Header("Content-Length", "0")
            c.Header("Content-Type", "text/plain")
            c.Writer.WriteHeaderNow()
            c.Abort()
			return
		}

		c.Next()
	}
}
