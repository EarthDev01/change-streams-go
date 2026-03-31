package handler

import (
	"changestreams/internal/model"
	"changestreams/internal/service"
	"errors"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authSvc service.AuthService
}

func NewAuthHandler(authSvc service.AuthService) *AuthHandler {
	return &AuthHandler{authSvc: authSvc}
}

func (h *AuthHandler) RegisterUser(c *gin.Context) {
	h.register(c, model.RoleUser)
}

func (h *AuthHandler) RegisterAdmin(c *gin.Context) {
	h.register(c, model.RoleAdmin)
}

func (h *AuthHandler) LoginUser(c *gin.Context) {
	h.login(c, model.RoleUser)
}

func (h *AuthHandler) LoginAdmin(c *gin.Context) {
	h.login(c, model.RoleAdmin)
}

func (h *AuthHandler) register(c *gin.Context, role model.Role) {
	var input service.RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		respondError(c, http.StatusBadRequest, err.Error())
		return
	}

	result, err := h.authSvc.Register(c.Request.Context(), input, role)
	if err != nil {
		if errors.Is(err, service.ErrEmailTaken) {
			respondError(c, http.StatusConflict, "email already registered")
			return
		}
		slog.ErrorContext(c.Request.Context(), "register failed", "role", role, "error", err)
		respondError(c, http.StatusInternalServerError, "internal server error")
		return
	}

	respondCreated(c, result)
}

func (h *AuthHandler) login(c *gin.Context, role model.Role) {
	var input service.LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		respondError(c, http.StatusBadRequest, err.Error())
		return
	}

	result, err := h.authSvc.Login(c.Request.Context(), input, role)
	if err != nil {
		if errors.Is(err, service.ErrInvalidCredentials) || errors.Is(err, service.ErrUnauthorizedRole) {
			respondError(c, http.StatusUnauthorized, "invalid email or password")
			return
		}
		slog.ErrorContext(c.Request.Context(), "login failed", "role", role, "error", err)
		respondError(c, http.StatusInternalServerError, "internal server error")
		return
	}

	respondSuccess(c, result)
}
