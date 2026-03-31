package middleware

import (
	"changestreams/internal/model"
	intsvc "changestreams/internal/service"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

const (
	ContextKeyUserID = "user_id"
	ContextKeyRole   = "role"
	ContextKeyEmail  = "email"
)

// RequireAuth validates the Bearer JWT token and injects user claims into context.
func RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"data": nil, "error": "missing authorization header"})
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"data": nil, "error": "invalid authorization header format"})
			return
		}

		claims, err := intsvc.ParseJWT(parts[1])
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"data": nil, "error": "invalid or expired token"})
			return
		}

		c.Set(ContextKeyUserID, claims.UserID)
		c.Set(ContextKeyRole, string(claims.Role))
		c.Set(ContextKeyEmail, claims.Email)
		c.Next()
	}
}

// RequireRole enforces that the authenticated user has the expected role.
func RequireRole(role model.Role) gin.HandlerFunc {
	return func(c *gin.Context) {
		r, exists := c.Get(ContextKeyRole)
		if !exists || r != string(role) {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"data": nil, "error": "forbidden"})
			return
		}
		c.Next()
	}
}
