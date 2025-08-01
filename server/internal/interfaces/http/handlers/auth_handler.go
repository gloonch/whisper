package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"whisper-server/internal/application/dto"
	"whisper-server/internal/application/usecases"
)

type AuthHandler struct {
	authUseCase usecases.AuthUseCase
}

func NewAuthHandler(authUseCase usecases.AuthUseCase) *AuthHandler {
	return &AuthHandler{
		authUseCase: authUseCase,
	}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req dto.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "Invalid request format",
			Details: err.Error(),
		})
		return
	}

	result, err := h.authUseCase.Register(c.Request.Context(), &req)
	if err != nil {
		status := http.StatusInternalServerError
		if err.Error() == "username already exists" || err.Error() == "email already exists" {
			status = http.StatusConflict
		}

		c.JSON(status, dto.ErrorResponse{
			Code:    status,
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, result)
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "Invalid request format",
			Details: err.Error(),
		})
		return
	}

	result, err := h.authUseCase.Login(c.Request.Context(), &req)
	if err != nil {
		status := http.StatusUnauthorized
		if err.Error() == "invalid username or password" {
			status = http.StatusUnauthorized
		}

		c.JSON(status, dto.ErrorResponse{
			Code:    status,
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, result)
}

func (h *AuthHandler) RefreshToken(c *gin.Context) {
	var req dto.RefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: "Invalid request format",
			Details: err.Error(),
		})
		return
	}

	result, err := h.authUseCase.RefreshToken(c.Request.Context(), &req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, dto.ErrorResponse{
			Code:    http.StatusUnauthorized,
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, result)
}