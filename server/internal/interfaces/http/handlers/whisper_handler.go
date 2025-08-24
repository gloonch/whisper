package handlers

import (
	"net/http"

	"whisper-server/internal/application/dto"
	"whisper-server/internal/application/usecases"
	"whisper-server/internal/interfaces/http/middleware"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type WhisperHandler struct {
	uc usecases.WhisperUseCase
}

func NewWhisperHandler(uc usecases.WhisperUseCase) *WhisperHandler {
	return &WhisperHandler{uc: uc}
}

func (h *WhisperHandler) Register(rg *gin.RouterGroup) {
	rg.POST("/", h.Create)
	rg.GET("/", h.List)
	rg.PUT(":id", h.Update)
	rg.DELETE(":id", h.Delete)
	rg.POST(":id/convert", h.ConvertToEvent)
}

func (h *WhisperHandler) Create(c *gin.Context) {
	userID := middleware.GetUserIDFromContext(c)
	var req dto.CreateWhisperRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	res, err := h.uc.Create(c.Request.Context(), userID, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, res)
}

func (h *WhisperHandler) List(c *gin.Context) {
	userID := middleware.GetUserIDFromContext(c)
	res, err := h.uc.ListByCurrentRelationship(c.Request.Context(), userID, 100, 0)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, res)
}

func (h *WhisperHandler) Update(c *gin.Context) {
	userID := middleware.GetUserIDFromContext(c)
	idStr := c.Param("id")
	oid, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid id"})
		return
	}
	var req dto.UpdateWhisperRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	res, err := h.uc.Update(c.Request.Context(), userID, oid, &req)
	if err != nil {
		status := http.StatusInternalServerError
		if err == usecases.ErrForbidden {
			status = http.StatusForbidden
		}
		c.JSON(status, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, res)
}

func (h *WhisperHandler) Delete(c *gin.Context) {
	userID := middleware.GetUserIDFromContext(c)
	idStr := c.Param("id")
	oid, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid id"})
		return
	}
	if err := h.uc.Delete(c.Request.Context(), userID, oid); err != nil {
		status := http.StatusInternalServerError
		if err == usecases.ErrForbidden {
			status = http.StatusForbidden
		}
		c.JSON(status, gin.H{"message": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *WhisperHandler) ConvertToEvent(c *gin.Context) {
	userID := middleware.GetUserIDFromContext(c)
	idStr := c.Param("id")
	oid, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid id"})
		return
	}
	var req dto.ConvertWhisperRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		// allow empty body
		req = dto.ConvertWhisperRequest{}
	}
	res, err := h.uc.ConvertToEvent(c.Request.Context(), userID, oid, req.Image)
	if err != nil {
		status := http.StatusInternalServerError
		if err == usecases.ErrForbidden {
			status = http.StatusForbidden
		}
		c.JSON(status, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, res)
}
