package handler

import (
	"changestreams/internal/middleware"
	"changestreams/internal/service"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func respondSuccess(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, gin.H{"data": data, "error": nil})
}

func respondCreated(c *gin.Context, data interface{}) {
	c.JSON(http.StatusCreated, gin.H{"data": data, "error": nil})
}

func respondError(c *gin.Context, statusCode int, msg string) {
	c.JSON(statusCode, gin.H{"data": nil, "error": msg})
}

func extractUserID(c *gin.Context) (primitive.ObjectID, error) {
	idVal, exists := c.Get(middleware.ContextKeyUserID)
	if !exists {
		return primitive.NilObjectID, errors.New("user_id not in context")
	}
	idStr, ok := idVal.(string)
	if !ok {
		return primitive.NilObjectID, errors.New("user_id is not a string")
	}
	return service.ParseObjectID(idStr)
}
