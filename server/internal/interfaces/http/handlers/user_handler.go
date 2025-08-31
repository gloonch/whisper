package handlers

import (
	"net/http"

	"whisper-server/internal/application/dto"
	"whisper-server/internal/application/usecases"
	"whisper-server/internal/interfaces/http/middleware"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userUseCase usecases.UserUseCase
}

func NewUserHandler(userUseCase usecases.UserUseCase) *UserHandler {
	return &UserHandler{
		userUseCase: userUseCase,
	}
}

// GetProfile handles GET /api/v1/users/profile
func (h *UserHandler) GetProfile(c *gin.Context) {
	userID := middleware.GetUserIDFromContext(c)

	profile, err := h.userUseCase.GetProfile(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, profile)
}

// UpdateProfile handles PUT /api/v1/users/profile
func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID := middleware.GetUserIDFromContext(c)

	var req dto.UpdateUserProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	profile, err := h.userUseCase.UpdateProfile(c.Request.Context(), userID, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, profile)
}
