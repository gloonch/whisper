package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"whisper-server/internal/application/dto"
	"whisper-server/internal/application/usecases"
)

type EventHandler struct {
	uc usecases.EventUseCase
}

func NewEventHandler(uc usecases.EventUseCase) *EventHandler {
	return &EventHandler{uc: uc}
}

// helpers: extract userID from context (populated by auth middleware)
func getUserID(c *gin.Context) (primitive.ObjectID, bool) {
	userIDStr, ok := c.Get("userID")
	if !ok {
		return primitive.NilObjectID, false
	}
	oid, err := primitive.ObjectIDFromHex(userIDStr.(string))
	if err != nil {
		return primitive.NilObjectID, false
	}
	return oid, true
}

func (h *EventHandler) RegisterEvent(c *gin.Context) {
	var req dto.CreateEventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{Code: http.StatusBadRequest, Message: "Invalid request", Details: err.Error()})
		return
	}
	userID, ok := getUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, dto.ErrorResponse{Code: http.StatusUnauthorized, Message: "Unauthorized"})
		return
	}
	// relationshipID should be resolved for the user; for now set nil -> 400 if not provided
	// relIDStr := c.Query("relationshipId")
	// if relIDStr == "" {
	// 	c.JSON(http.StatusBadRequest, dto.ErrorResponse{Code: http.StatusBadRequest, Message: "relationshipId is required"})
	// 	return
	// }
	// relID, err := primitive.ObjectIDFromHex(relIDStr)
	// if err != nil {
	// 	c.JSON(http.StatusBadRequest, dto.ErrorResponse{Code: http.StatusBadRequest, Message: "invalid relationshipId"})
	// 	return
	// }

	res, err := h.uc.RegisterEvent(c.Request.Context(), userID, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Code: http.StatusInternalServerError, Message: err.Error()})
		return
	}
	c.JSON(http.StatusCreated, res)
}

func (h *EventHandler) GetEventByID(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, dto.ErrorResponse{Code: http.StatusUnauthorized, Message: "Unauthorized"})
		return
	}
	idStr := c.Param("id")
	oid, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{Code: http.StatusBadRequest, Message: "invalid id"})
		return
	}
	res, err := h.uc.GetEventByID(c.Request.Context(), userID, oid)
	if err != nil {
		if err == usecases.ErrForbidden {
			c.JSON(http.StatusForbidden, dto.ErrorResponse{Code: http.StatusForbidden, Message: "forbidden"})
			return
		}
		c.JSON(http.StatusNotFound, dto.ErrorResponse{Code: http.StatusNotFound, Message: err.Error()})
		return
	}
	c.JSON(http.StatusOK, res)
}

func (h *EventHandler) UpdateEventByID(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, dto.ErrorResponse{Code: http.StatusUnauthorized, Message: "Unauthorized"})
		return
	}
	idStr := c.Param("id")
	oid, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{Code: http.StatusBadRequest, Message: "invalid id"})
		return
	}
	var req dto.UpdateEventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{Code: http.StatusBadRequest, Message: "Invalid request", Details: err.Error()})
		return
	}
	res, err := h.uc.UpdateEventByID(c.Request.Context(), userID, oid, &req)
	if err != nil {
		if err == usecases.ErrForbidden {
			c.JSON(http.StatusForbidden, dto.ErrorResponse{Code: http.StatusForbidden, Message: "forbidden"})
			return
		}
		c.JSON(http.StatusNotFound, dto.ErrorResponse{Code: http.StatusNotFound, Message: err.Error()})
		return
	}
	c.JSON(http.StatusOK, res)
}

func (h *EventHandler) GetAllEventsByUserID(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, dto.ErrorResponse{Code: http.StatusUnauthorized, Message: "Unauthorized"})
		return
	}
	// pagination
	limitStr := c.DefaultQuery("limit", "50")
	offsetStr := c.DefaultQuery("offset", "0")
	limit, _ := strconv.ParseInt(limitStr, 10, 64)
	offset, _ := strconv.ParseInt(offsetStr, 10, 64)

	res, err := h.uc.GetAllEventsByUserID(c.Request.Context(), userID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Code: http.StatusInternalServerError, Message: err.Error()})
		return
	}
	c.JSON(http.StatusOK, res)
}
