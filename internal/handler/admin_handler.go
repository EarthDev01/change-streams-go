package handler

import (
	"changestreams/internal/model"
	"changestreams/internal/service"
	"errors"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AdminHandler struct {
	adminSvc service.AdminService
}

func NewAdminHandler(adminSvc service.AdminService) *AdminHandler {
	return &AdminHandler{adminSvc: adminSvc}
}

func (h *AdminHandler) CreatePackage(c *gin.Context) {
	var input service.CreatePackageInput
	if err := c.ShouldBindJSON(&input); err != nil {
		respondError(c, http.StatusBadRequest, err.Error())
		return
	}

	adminID, err := extractUserID(c)
	if err != nil {
		respondError(c, http.StatusUnauthorized, "invalid admin")
		return
	}

	pkg, err := h.adminSvc.CreatePackage(c.Request.Context(), adminID, input)
	if err != nil {
		slog.ErrorContext(c.Request.Context(), "create package failed", "admin_id", adminID, "error", err)
		respondError(c, http.StatusInternalServerError, "failed to create package")
		return
	}

	respondCreated(c, pkg)
}

func (h *AdminHandler) ListOrders(c *gin.Context) {
	status := model.OrderStatus(c.DefaultQuery("status", string(model.OrderStatusPending)))
	orders, err := h.adminSvc.ListOrders(c.Request.Context(), status)
	if err != nil {
		slog.ErrorContext(c.Request.Context(), "list orders failed", "status", status, "error", err)
		respondError(c, http.StatusInternalServerError, "failed to fetch orders")
		return
	}
	respondSuccess(c, orders)
}

func (h *AdminHandler) ApproveOrder(c *gin.Context) {
	h.handleOrderAction(c, func(orderID primitive.ObjectID) error {
		return h.adminSvc.ApproveOrder(c.Request.Context(), orderID)
	})
}

func (h *AdminHandler) RejectOrder(c *gin.Context) {
	h.handleOrderAction(c, func(orderID primitive.ObjectID) error {
		return h.adminSvc.RejectOrder(c.Request.Context(), orderID)
	})
}

func (h *AdminHandler) ApproveRefund(c *gin.Context) {
	h.handleOrderAction(c, func(orderID primitive.ObjectID) error {
		return h.adminSvc.ApproveRefund(c.Request.Context(), orderID)
	})
}

func (h *AdminHandler) handleOrderAction(c *gin.Context, action func(primitive.ObjectID) error) {
	orderID, err := service.ParseObjectID(c.Param("id"))
	if err != nil {
		respondError(c, http.StatusBadRequest, "invalid order id")
		return
	}

	if err := action(orderID); err != nil {
		switch {
		case errors.Is(err, service.ErrOrderNotFound):
			respondError(c, http.StatusNotFound, "order not found")
		case errors.Is(err, service.ErrInvalidOrderState):
			respondError(c, http.StatusConflict, "order is in an invalid state for this action")
		default:
			slog.ErrorContext(c.Request.Context(), "order action failed", "order_id", orderID, "error", err)
			respondError(c, http.StatusInternalServerError, "failed to update order")
		}
		return
	}

	respondSuccess(c, gin.H{"message": "success"})
}
