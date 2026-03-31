package stream

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

func Route(r *gin.Engine, resource *db.Resource) {
	authH, userH, adminH := initHandlers(resource)
	registerRoutes(r, authH, userH, adminH)
}

func initHandlers(resource *db.Resource) (*handler.AuthHandler, *handler.UserHandler, *handler.AdminHandler) {
	mongoClient := resource.DB.Client()

	userRepo := repository.NewUserRepository(resource.DB)
	packageRepo := repository.NewPackageRepository(resource.DB)
	orderRepo := repository.NewOrderRepository(resource.DB)
	txRepo := repository.NewTransactionRepository(resource.DB)

	authSvc := service.NewAuthService(userRepo)
	userSvc := service.NewUserService(userRepo, packageRepo, orderRepo, txRepo, mongoClient)
	adminSvc := service.NewAdminService(packageRepo, orderRepo, userRepo, txRepo, mongoClient)

	return handler.NewAuthHandler(authSvc),
		handler.NewUserHandler(userSvc),
		handler.NewAdminHandler(adminSvc)
}

func registerRoutes(r *gin.Engine, authH *handler.AuthHandler, userH *handler.UserHandler, adminH *handler.AdminHandler) {
	api := r.Group("/api/")

	api.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"data": "OK", "error": nil})
	})

	registerAuthRoutes(api, authH)
	registerUserRoutes(api, userH)
	registerAdminRoutes(api, adminH)
}

func registerAuthRoutes(api *gin.RouterGroup, h *handler.AuthHandler) {
	auth := api.Group("/auth")
	auth.POST("/register", h.RegisterUser)
	auth.POST("/login", h.LoginUser)

	adminAuth := api.Group("/admin/auth")
	adminAuth.POST("/register", h.RegisterAdmin)
	adminAuth.POST("/login", h.LoginAdmin)
}

func registerUserRoutes(api *gin.RouterGroup, h *handler.UserHandler) {
	user := api.Group("/user", middleware.RequireAuth(), middleware.RequireRole(model.RoleUser))
	user.POST("/topup", h.TopupCredit)
	user.GET("/packages", h.GetPackages)
	user.POST("/packages/:id/buy", h.BuyPackage)
	user.GET("/orders", h.GetOrders)
	user.POST("/orders/:id/refund", h.RequestRefund)
}

func registerAdminRoutes(api *gin.RouterGroup, h *handler.AdminHandler) {
	admin := api.Group("/admin", middleware.RequireAuth(), middleware.RequireRole(model.RoleAdmin))
	admin.POST("/packages", h.CreatePackage)
	admin.GET("/orders", h.ListOrders)
	admin.PUT("/orders/:id/approve", h.ApproveOrder)
	admin.PUT("/orders/:id/reject", h.RejectOrder)
	admin.PUT("/orders/:id/refund/approve", h.ApproveRefund)
}
