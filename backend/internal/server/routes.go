package server

import (
	"changestreams/internal/db"
	"changestreams/internal/handler"
	"changestreams/internal/middleware"
	"changestreams/internal/model"
	"changestreams/internal/repository"
	"changestreams/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

func registerRoutes(r *gin.Engine, resources *db.Resources) {
	mainDB := resources.Main.DB

	userRepo := repository.NewUserRepository(mainDB)
	packageRepo := repository.NewPackageRepository(mainDB)
	orderRepo := repository.NewOrderRepository(mainDB)
	txRepo := repository.NewTransactionRepository(mainDB)

	authHandler := handler.NewAuthHandler(
		service.NewAuthService(userRepo),
	)
	userHandler := handler.NewUserHandler(
		service.NewUserService(userRepo, packageRepo, orderRepo, txRepo, mainDB.Client()),
	)
	adminHandler := handler.NewAdminHandler(
		service.NewAdminService(packageRepo, orderRepo, userRepo, txRepo, mainDB.Client()),
	)

	api := r.Group("/api/v1")
	api.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"data": gin.H{"status": "ok"}, "error": nil})
	})

	auth := api.Group("/auth")
	{
		auth.POST("/register", authHandler.RegisterUser)
		auth.POST("/login", authHandler.LoginUser)
	}

	adminAuth := api.Group("/admin/auth")
	{
		adminAuth.POST("/register", authHandler.RegisterAdmin)
		adminAuth.POST("/login", authHandler.LoginAdmin)
	}

	user := api.Group("/user", middleware.RequireAuth(), middleware.RequireRole(model.RoleUser))
	{
		user.GET("/packages", userHandler.GetPackages)
		user.POST("/topup", userHandler.TopupCredit)
		user.POST("/packages/:id/buy", userHandler.BuyPackage)
		user.GET("/orders", userHandler.GetOrders)
		user.POST("/orders/:id/refund", userHandler.RequestRefund)
	}

	admin := api.Group("/admin", middleware.RequireAuth(), middleware.RequireRole(model.RoleAdmin))
	{
		admin.POST("/packages", adminHandler.CreatePackage)
		admin.GET("/orders", adminHandler.ListOrders)
		admin.PUT("/orders/:id/approve", adminHandler.ApproveOrder)
		admin.PUT("/orders/:id/reject", adminHandler.RejectOrder)
		admin.PUT("/orders/:id/refund", adminHandler.ApproveRefund)
	}
}
