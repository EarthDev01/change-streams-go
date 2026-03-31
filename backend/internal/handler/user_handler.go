package handler

import (
	"changestreams/internal/service"
	"errors"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userSvc service.UserService
}

func NewUserHandler(userSvc service.UserService) *UserHandler {
	return &UserHandler{userSvc: userSvc}
}

func (h *UserHandler) GetPackages(c *gin.Context) {
	packages, err := h.userSvc.GetPackages(c.Request.Context())
	if err != nil {
		slog.ErrorContext(c.Request.Context(), "get packages failed", "error", err)
		respondError(c, http.StatusInternalServerError, "failed to fetch packages")
		return
	}
	respondSuccess(c, packages)
}

func (h *UserHandler) TopupCredit(c *gin.Context) {
	var input service.TopupInput
	if err := c.ShouldBindJSON(&input); err != nil {
		respondError(c, http.StatusBadRequest, err.Error())
		return
	}

	userID, err := extractUserID(c)
	if err != nil {
		respondError(c, http.StatusUnauthorized, "invalid user")
		return
	}

	if err := h.userSvc.TopupCredit(c.Request.Context(), userID, input.Amount); err != nil {
		slog.ErrorContext(c.Request.Context(), "topup failed", "user_id", userID, "error", err)
		respondError(c, http.StatusInternalServerError, "topup failed")
		return
	}

	respondSuccess(c, gin.H{"message": "credit topped up successfully"})
}

func (h *UserHandler) BuyPackage(c *gin.Context) {
	userID, err := extractUserID(c)
	if err != nil {
		respondError(c, http.StatusUnauthorized, "invalid user")
		return
	}

	packageID, err := service.ParseObjectID(c.Param("id"))
	if err != nil {
		respondError(c, http.StatusBadRequest, "invalid package id")
		return
	}

	order, err := h.userSvc.BuyPackage(c.Request.Context(), userID, packageID)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrInsufficientCredit):
			respondError(c, http.StatusPaymentRequired, "insufficient credit balance")
		case errors.Is(err, service.ErrPackageNotFound):
			respondError(c, http.StatusNotFound, "package not found")
		default:
			slog.ErrorContext(c.Request.Context(), "buy package failed", "user_id", userID, "package_id", packageID, "error", err)
			respondError(c, http.StatusInternalServerError, "purchase failed")
		}
		return
	}

	respondCreated(c, order)
}

func (h *UserHandler) GetOrders(c *gin.Context) {
	userID, err := extractUserID(c)
	if err != nil {
		respondError(c, http.StatusUnauthorized, "invalid user")
		return
	}

	orders, err := h.userSvc.GetOrders(c.Request.Context(), userID)
	if err != nil {
		slog.ErrorContext(c.Request.Context(), "get orders failed", "user_id", userID, "error", err)
		respondError(c, http.StatusInternalServerError, "failed to fetch orders")
		return
	}

	respondSuccess(c, orders)
}

func (h *UserHandler) RequestRefund(c *gin.Context) {
	userID, err := extractUserID(c)
	if err != nil {
		respondError(c, http.StatusUnauthorized, "invalid user")
		return
	}

	orderID, err := service.ParseObjectID(c.Param("id"))
	if err != nil {
		respondError(c, http.StatusBadRequest, "invalid order id")
		return
	}

	if err := h.userSvc.RequestRefund(c.Request.Context(), userID, orderID); err != nil {
		switch {
		case errors.Is(err, service.ErrOrderNotFound):
			respondError(c, http.StatusNotFound, "order not found")
		case errors.Is(err, service.ErrInvalidOrderState):
			respondError(c, http.StatusConflict, "order cannot be refunded in its current state")
		default:
			slog.ErrorContext(c.Request.Context(), "refund request failed", "user_id", userID, "order_id", orderID, "error", err)
			respondError(c, http.StatusInternalServerError, "refund request failed")
		}
		return
	}

	respondSuccess(c, gin.H{"message": "refund requested successfully"})
}
