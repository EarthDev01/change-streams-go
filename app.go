package stream

import (
	"changestreams/db"
	"net/http"
	"time"

	"github.com/fatih/color"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func StartServer() {
	_ = godotenv.Load()
	color.Green("Server starting...")

	r := gin.Default()
	r.Use(CORS)

	resources, err := db.ConnectDbs()
	if err != nil {
		time.Sleep(5 * time.Second)
		color.Red("Restart", err)
		return
	}

	if resources != nil {
	}

	router := r.Group("/api")
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "OK"})
	})
	r.Run("0.0.0.0:8888")
}

func CORS(c *gin.Context) {
	// First, we add the headers with need to enable CORS
	// Make sure to adjust these headers to your needs
	c.Header("Access-Control-Allow-Origin", "*")
	c.Header("Access-Control-Allow-Methods", "*")
	c.Header("Access-Control-Allow-Headers", "*")
	c.Header("Access-Control-Allow-Private-Network", "true")
	c.Header("Access-Control-Allow-Credential", "true")
	c.Header("Content-Type", "application/json")

	// Second, we handle the OPTIONS problem
	if c.Request.Method != "OPTIONS" {
		c.Next()
		return
	} else {
		c.AbortWithStatus(http.StatusOK)
		return
	}
}
