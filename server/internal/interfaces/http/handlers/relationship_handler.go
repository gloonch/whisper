package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"whisper-server/internal/application/dto"
	"whisper-server/internal/application/usecases"
)

type RelationshipHandler struct {
	uc usecases.RelationshipUseCase
}

func NewRelationshipHandler(uc usecases.RelationshipUseCase) *RelationshipHandler {
	return &RelationshipHandler{uc: uc}
}

func (h *RelationshipHandler) GenerateInvite(c *gin.Context) {
    userIDStr, _ := c.Get("userID")
    oid, _ := primitive.ObjectIDFromHex(userIDStr.(string))
    var req dto.GenerateInviteCodeRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, dto.ErrorResponse{Code: http.StatusBadRequest, Message: "Invalid request", Details: err.Error()})
        return
    }
    res, err := h.uc.GenerateInvitationCode(c.Request.Context(), oid, req.FirstMeetingDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Code: http.StatusInternalServerError, Message: err.Error()})
		return
	}
	c.JSON(http.StatusOK, res)
}

func (h *RelationshipHandler) Join(c *gin.Context) {
	var req dto.JoinWithInviteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{Code: http.StatusBadRequest, Message: "Invalid request", Details: err.Error()})
		return
	}
	userIDStr, _ := c.Get("userID")
	oid, _ := primitive.ObjectIDFromHex(userIDStr.(string))
	res, err := h.uc.JoinWithInviteCode(c.Request.Context(), oid, req.Code)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{Code: http.StatusBadRequest, Message: err.Error()})
		return
	}
	c.JSON(http.StatusOK, res)
}

func (h *RelationshipHandler) Current(c *gin.Context) {
	userIDStr, _ := c.Get("userID")
	oid, _ := primitive.ObjectIDFromHex(userIDStr.(string))
	res, err := h.uc.GetCurrentRelationship(c.Request.Context(), oid)
	if err != nil {
		c.JSON(http.StatusNotFound, dto.ErrorResponse{Code: http.StatusNotFound, Message: err.Error()})
		return
	}
	c.JSON(http.StatusOK, res)
}

func (h *RelationshipHandler) Disconnect(c *gin.Context) {
	userIDStr, _ := c.Get("userID")
	oid, _ := primitive.ObjectIDFromHex(userIDStr.(string))
	if err := h.uc.DisconnectRelationship(c.Request.Context(), oid); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{Code: http.StatusBadRequest, Message: err.Error()})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}
